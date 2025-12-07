import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/products(.*)",
  "/cart(.*)",
  "/privacy-policy(.*)",
  "/refund-policy(.*)",
  "/terms(.*)",
  "/important(.*)",
  "/api(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  // Only protect admin routes, allow public routes
  if (isAdminRoute(req) && !isPublicRoute(req)) {
    await auth.protect()
    
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
    
    try {
      // Fetch user from Clerk API to get publicMetadata
      // publicMetadata is not included in sessionClaims by default
      const client = await clerkClient()
      const user = await client.users.getUser(userId)
      const role = (user.publicMetadata as { role?: string })?.role
      
      if (role !== "admin") {
        // Redirect non-admin users
        return NextResponse.redirect(new URL("/", req.url))
      }
    } catch (error) {
      // On error, redirect to home for safety
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching user metadata:", error)
      }
      return NextResponse.redirect(new URL("/", req.url))
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and Clerk health checks
    "/((?!_next|SignIn_clerk_catchall_check|SignUp_clerk_catchall_check|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}

