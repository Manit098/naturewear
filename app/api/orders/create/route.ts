import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { currentUser } from "@clerk/nextjs/server"

// Create order after successful payment
export async function POST(request: Request) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    const { items, total, shippingAddress } = await request.json()
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid items" },
        { status: 400 }
      )
    }
    
    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      )
    }
    
    const order = await Order.create({
      userId: user.id,
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      items,
      total: total || items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      status: "pending",
      shippingAddress,
    })
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

