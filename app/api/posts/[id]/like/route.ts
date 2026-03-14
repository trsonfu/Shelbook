import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
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

    const { id: postId } = params

    // Check if like already exists
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      return NextResponse.json({ success: true, liked: true })
    }

    // Create like
    const { error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: user.id,
      })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, liked: true })
  } catch (error: any) {
    console.error('Error liking post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to like post' },
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

    const { id: postId } = params

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, liked: false })
  } catch (error: any) {
    console.error('Error unliking post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to unlike post' },
      { status: 500 }
    )
  }
}
