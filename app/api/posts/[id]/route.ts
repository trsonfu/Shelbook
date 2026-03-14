import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', id)
      .single()

    if (error || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get likes and comments counts
    const [likesResult, commentsResult] = await Promise.all([
      supabase
        .from('likes')
        .select('user_id')
        .eq('post_id', id),
      supabase
        .from('comments')
        .select('id')
        .eq('post_id', id),
    ])

    post.likes_count = likesResult.data?.length || 0
    post.comments_count = commentsResult.data?.length || 0

    // Get current user's like status
    const currentUser = await getCurrentUser()
    if (currentUser) {
      const userLiked = likesResult.data?.some(like => like.user_id === currentUser.id)
      post.is_liked = !!userLiked
    } else {
      post.is_liked = false
    }

    return NextResponse.json({ post })
  } catch (error: any) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Check if user owns the post
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!post || post.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 }
    )
  }
}
