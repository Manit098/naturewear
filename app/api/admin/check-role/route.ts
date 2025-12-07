import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

// Debug route to check user role
export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        message: "Not authenticated" 
      }, { status: 200 })
    }
    
    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      publicMetadata: user.publicMetadata,
      role: (user.publicMetadata as any)?.role,
      isAdmin: (user.publicMetadata as any)?.role === "admin",
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check role" },
      { status: 500 }
    )
  }
}

