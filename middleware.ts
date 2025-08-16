import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to auth pages and public routes
  if (
    pathname.startsWith("/auth") ||
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  // For now, allow all other routes until authentication is properly set up
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/landlord/:path*", "/admin/:path*", "/auth/:path*"],
}
