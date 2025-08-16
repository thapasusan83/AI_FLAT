import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to auth pages and public routes
  if (pathname.startsWith("/auth") || pathname === "/") {
    return NextResponse.next()
  }

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect to signin if no token for protected routes
  if (
    !token &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/landlord") || pathname.startsWith("/admin"))
  ) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Role-based access control
  if (token) {
    const userRole = token.role as string

    // Admin routes - only admins allowed
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Landlord routes - only landlords allowed
    if (pathname.startsWith("/landlord") && userRole !== "LANDLORD") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/landlord/:path*", "/admin/:path*", "/auth/:path*"],
}
