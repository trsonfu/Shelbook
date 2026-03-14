import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth/login']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If accessing protected route without session, redirect to login
  if (!isPublicRoute && !session) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing login page with valid session, redirect to home
  if (pathname === '/login' && session) {
    try {
      const sessionData = JSON.parse(session.value)
      if (sessionData.expiresAt > Date.now()) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      // Invalid session, allow access to login
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
}
