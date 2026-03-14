import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    // Validate Supabase connection
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Database configuration error', posts: [] },
        { status: 500 }
      )
    }

    const session = await getSession()
    const currentUserId = session?.userId

    // Fetch posts with user info, likes count, and comments count
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users!posts_user_id_fkey (
          id,
          wallet_address,
          username,
          display_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json(
        { error: error.message, posts: [] },
        { status: 500 }
      )
    }

    // If no posts, return empty array
    if (!posts || posts.length === 0) {
      return NextResponse.json({
        posts: [],
      })
    }

    // Fetch likes and comments counts for all posts
    const postIds = posts?.map(p => p.id) || []
    
    const [likesData, commentsData, userLikesData] = await Promise.all([
      // Get likes count for each post
      supabase
        .from('likes')
        .select('post_id')
        .in('post_id', postIds),
      
      // Get comments count for each post
      supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds),
      
      // Get current user's likes if authenticated
      currentUserId
        ? supabase
            .from('likes')
            .select('post_id')
            .eq('user_id', currentUserId)
            .in('post_id', postIds)
        : Promise.resolve({ data: [] })
    ])

    // Count likes and comments per post
    const likesCount: Record<string, number> = {}
    const commentsCount: Record<string, number> = {}
    const userLikes = new Set(userLikesData.data?.map(l => l.post_id) || [])

    likesData.data?.forEach(like => {
      likesCount[like.post_id] = (likesCount[like.post_id] || 0) + 1
    })

    commentsData.data?.forEach(comment => {
      commentsCount[comment.post_id] = (commentsCount[comment.post_id] || 0) + 1
    })

    // Enrich posts with counts and is_liked status
    const enrichedPosts = posts?.map(post => ({
      ...post,
      likes_count: likesCount[post.id] || 0,
      comments_count: commentsCount[post.id] || 0,
      is_liked: userLikes.has(post.id),
    }))

    return NextResponse.json({
      posts: enrichedPosts || [],
    })
  } catch (error: unknown) {
    console.error('Error in posts API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts'
    return NextResponse.json(
      { error: errorMessage, posts: [] },
      { status: 200 } // Return 200 with empty posts instead of 500
    )
  }
}
