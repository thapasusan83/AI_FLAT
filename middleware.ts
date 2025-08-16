import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        const userRole = token?.role

        // Allow access to auth pages for everyone
        if (pathname.startsWith("/auth")) {
          return true
        }

        // Require authentication for protected routes
        if (!token) {
          return false
        }

        // Role-based access control
        if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
          return false
        }

        if (pathname.startsWith("/landlord") && userRole !== "LANDLORD") {
          return false
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/landlord/:path*", "/admin/:path*", "/auth/:path*"],
}
