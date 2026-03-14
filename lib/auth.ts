import { cookies } from 'next/headers'
import { supabase } from './supabase'

export interface Session {
  walletAddress: string
  userId: string
  authenticated: boolean
  expiresAt: number
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return null
    }

    let raw = sessionCookie.value
    try {
      raw = decodeURIComponent(raw)
    } catch {
      // ignore
    }

    const session: Session = JSON.parse(raw)

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      return null
    }

    return session
  } catch (error) {
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  
  if (!session) {
    return null
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.userId)
    .single()

  if (error || !user) {
    return null
  }

  return user
}
