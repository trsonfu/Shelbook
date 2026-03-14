import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('xxxxx') || supabaseKey.includes('xxxxx')) {
      return NextResponse.json(
        { error: 'Database is not configured. Please set up Supabase environment variables.' },
        { status: 503 }
      )
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (user doesn't exist)
      console.error('Supabase query error:', selectError)
      return NextResponse.json(
        { error: 'Database connection failed. Please check your configuration.' },
        { status: 500 }
      )
    }

    let user

    if (existingUser) {
      // Update user if exists
      user = existingUser
    } else {
      // Create new user in Supabase
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
          username: `user_${walletAddress.slice(0, 8)}`,
        })
        .select()
        .single()

      if (createError) {
        console.error('Failed to create user:', createError)
        return NextResponse.json(
          { error: 'Failed to create user account. Please try again.' },
          { status: 500 }
        )
      }

      user = newUser
    }

    // Create session (you can use cookies or JWT here)
    const session = {
      walletAddress,
      userId: user.id,
      authenticated: true,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user,
      authenticated: true,
    })

    // Store session in cookie
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error: unknown) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie.value)
    
    // Verify session is still valid
    if (session.expiresAt < Date.now()) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user,
    })
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}
