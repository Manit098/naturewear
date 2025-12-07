import { NextResponse } from "next/server"
import Stripe from "stripe"
import { currentUser } from "@clerk/nextjs/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
})

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { items, shippingAddress } = await request.json()
    
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
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/cart?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/cart?canceled=true`,
      customer_email: user.emailAddresses[0]?.emailAddress,
      metadata: {
        userId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress || "",
        shippingAddress: JSON.stringify(shippingAddress),
      },
    })
    
    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 })
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating checkout session:", error)
    }
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? error.message : "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

