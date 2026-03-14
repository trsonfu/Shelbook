import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { caption, shelbyFileId, shelbyFileUrl, fileType, mediaWidth, mediaHeight } = body

    if (!shelbyFileId || !shelbyFileUrl || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save story metadata to Supabase
    const { data: story, error } = await supabase
      .from('stories')
      .insert({
        user_id: user.id,
        shelby_file_id: shelbyFileId,
        shelby_file_url: shelbyFileUrl,
        file_type: fileType,
        caption: caption || null,
        media_width: mediaWidth || null,
        media_height: mediaHeight || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving story:', error)
      return NextResponse.json(
        { error: 'Failed to save story' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      story,
    })
  } catch (error: unknown) {
    console.error('Story upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Story upload failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch stories
export async function GET() {
  try {
    // Fetch non-expired stories from last 24 hours
    const { data: stories, error } = await supabase
      .from('stories')
      .select(`
        *,
        user:users(*)
      `)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching stories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch stories' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      stories: stories || [],
    })
  } catch (error: unknown) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}
