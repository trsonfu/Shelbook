'use client'

import type { Session } from '@/lib/auth'

const SESSION_COOKIE_NAME = 'session'

export function setWalletSessionCookie(walletAddress: string) {
  const session: Session = {
    walletAddress,
    // UI-only: dùng walletAddress làm userId để giữ luồng hiện tại (profile/create page đang check session).
    userId: walletAddress,
    authenticated: true,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }

  const value = encodeURIComponent(JSON.stringify(session))
  const maxAge = 7 * 24 * 60 * 60
  document.cookie = `${SESSION_COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
}

export function clearWalletSessionCookie() {
  document.cookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`
}

