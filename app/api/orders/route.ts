import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user || user.publicMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    const orders = await Order.find({}).sort({ createdAt: -1 })
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching orders:", error)
    }
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

