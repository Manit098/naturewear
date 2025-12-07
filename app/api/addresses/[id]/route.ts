import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Address from "@/models/Address"
import { currentUser } from "@clerk/nextjs/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    const { id } = await params
    
    const body = await request.json()
    const { fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = body
    
    // If this is set as default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { userId: user.id, _id: { $ne: id } },
        { $set: { isDefault: false } }
      )
    }
    
    const address = await Address.findOneAndUpdate(
      { _id: id, userId: user.id },
      {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        isDefault,
      },
      { new: true }
    )
    
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }
    
    return NextResponse.json(address, { status: 200 })
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    const { id } = await params
    
    const address = await Address.findOneAndDelete({ _id: id, userId: user.id })
    
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }
    
    return NextResponse.json({ message: "Address deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    )
  }
}

