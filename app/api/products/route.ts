import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import { currentUser } from "@clerk/nextjs/server"

// GET - Fetch all products (public) or with admin filter
export async function GET(request: Request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get("admin") === "true"
    const activeOnly = searchParams.get("activeOnly") !== "false"
    
    let query: any = {}
    
    // If not admin request, only show active products
    if (!admin && activeOnly) {
      query.isActive = true
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 })
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching products:", error)
    }
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST - Create new product (admin only)
export async function POST(request: Request) {
  try {
    const user = await currentUser()
    
    if (!user || user.publicMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectDB()
    
    const body = await request.json()
    const { name, description, price, image, category, stock, isActive } = body
    
    if (!name || !description || !price || !image || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      image,
      category,
      stock: parseInt(stock) || 0,
      isActive: isActive !== undefined ? isActive : true,
    })
    
    await product.save()
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating product:", error)
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

