import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Address from "@/models/Address"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    const addresses = await Address.find({ userId: user.id }).sort({ isDefault: -1, createdAt: -1 })
    return NextResponse.json(addresses, { status: 200 })
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    const body = await request.json()
    const { fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = body
    
    // If this is set as default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { userId: user.id },
        { $set: { isDefault: false } }
      )
    }
    
    const address = await Address.create({
      userId: user.id,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country: country || "United States",
      isDefault: isDefault || false,
    })
    
    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error("Error creating address:", error)
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    )
  }
}

