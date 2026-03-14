import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to get user by ID first (UUID format)
    let query = supabase
      .from('users')
      .select('*')

    // Check if id looks like a wallet address (starts with 0x and long)
    if (id.startsWith('0x') && id.length > 20) {
      query = query.eq('wallet_address', id)
    } else {
      query = query.eq('id', id)
    }

    const { data: user, error } = await query.single()

    if (error || !user) {
      // Return a structure indicating user not found but provide the wallet address
      return NextResponse.json(
        { 
          error: 'User not found',
          walletAddress: id.startsWith('0x') ? id : null,
          user: null,
          followersCount: 0,
          followingCount: 0,
        },
        { status: 200 } // Return 200 instead of 404 so we can handle it in the UI
      )
    }

    // Get followers count
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', user.id)

    // Get following count
    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', user.id)

    return NextResponse.json({
      user,
      followersCount: followersCount || 0,
      followingCount: followingCount || 0,
    })
  } catch (error: any) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH/PUT endpoint to create or update user profile (UPSERT)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { display_name, bio, avatar_url, username } = body

    console.log('PATCH /api/users/[id]:', { id, body })

    // Validate wallet address format
    const isWalletAddress = id.startsWith('0x') && id.length > 20
    
    if (!isWalletAddress) {
      // If it's a UUID, we need to find and update existing user
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Update existing user by UUID
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          display_name: display_name || null,
          bio: bio || null,
          avatar_url: avatar_url || null,
          username: username || existingUser.username,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        user: updatedUser,
      })
    }

    // For wallet addresses, use UPSERT (insert or update)
    const walletAddress = id

    // Generate a default username if not provided
    const defaultUsername = username || `user_${walletAddress.slice(0, 8)}`

    // Use upsert to create or update the user
    const { data: upsertedUser, error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          wallet_address: walletAddress,
          username: defaultUsername,
          display_name: display_name || null,
          bio: bio || null,
          avatar_url: avatar_url || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'wallet_address', // Use wallet_address as unique constraint
          ignoreDuplicates: false, // Update if exists
        }
      )
      .select()
      .single()

    if (upsertError) {
      console.error('Upsert error:', upsertError)
      throw upsertError
    }

    console.log('Profile upserted successfully:', upsertedUser)

    return NextResponse.json({
      success: true,
      user: upsertedUser,
      created: !upsertedUser.display_name && display_name, // Indicate if this was a new profile
    })
  } catch (error: any) {
    console.error('Error updating/creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile', details: error },
      { status: 500 }
    )
  }
}
