import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'ADMIN') {
        return Response.redirect(new URL('/login?callbackUrl=/admin', req.url))
      }
    }

    // Account routes protection
    if (pathname.startsWith('/account') || pathname.startsWith('/orders')) {
      if (!token) {
        return Response.redirect(new URL('/login?callbackUrl=' + pathname, req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: () => true, // Let middleware handle authorization
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/orders/:path*']
}