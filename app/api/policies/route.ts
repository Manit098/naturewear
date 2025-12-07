import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Policy from "@/models/Policy"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(request: Request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    
    if (type) {
      const policy = await Policy.findOne({ type })
      if (!policy) {
        return NextResponse.json({ content: "" }, { status: 200 })
      }
      return NextResponse.json({ content: policy.content }, { status: 200 })
    }
    
    const policies = await Policy.find({})
    return NextResponse.json(policies, { status: 200 })
  } catch (error) {
    console.error("Error fetching policies:", error)
    return NextResponse.json(
      { error: "Failed to fetch policies" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    
    if (!user || user.publicMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    const { type, content } = await request.json()
    
    if (!type || !["refund", "privacy", "important", "terms"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid policy type" },
        { status: 400 }
      )
    }
    
    const policy = await Policy.findOneAndUpdate(
      { type },
      { content, updatedAt: new Date() },
      { upsert: true, new: true }
    )
    
    return NextResponse.json(policy, { status: 200 })
  } catch (error) {
    console.error("Error saving policy:", error)
    return NextResponse.json(
      { error: "Failed to save policy" },
      { status: 500 }
    )
  }
}

