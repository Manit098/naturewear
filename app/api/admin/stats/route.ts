import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { currentUser, clerkClient } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user || user.publicMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    // Get total users from Clerk
    const client = await clerkClient()
    const clerkUsers = await client.users.getUserList({ limit: 1 })
    const totalUsers = clerkUsers.totalCount || 0
    
    // Get total orders from database
    const totalOrders = await Order.countDocuments()
    
    return NextResponse.json(
      {
        totalUsers,
        totalOrders,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

