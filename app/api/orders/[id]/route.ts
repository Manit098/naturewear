import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { currentUser } from "@clerk/nextjs/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser()
    
    if (!user || user.publicMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    const { id } = await params
    
    const body = await request.json()
    const { status, deliveryTime } = body
    
    const updateData: any = {}
    if (status) {
      updateData.status = status
    }
    if (deliveryTime) {
      updateData.deliveryTime = new Date(deliveryTime)
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    return NextResponse.json(order, { status: 200 })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}

