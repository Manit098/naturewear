import { NextResponse } from "next/server"
import Stripe from "stripe"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
})

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      await connectDB()

      // Get line items from session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      const items = lineItems.data.map((item) => ({
        productId: item.price?.product as string || "",
        name: item.description || "Product",
        price: (item.price?.unit_amount || 0) / 100,
        quantity: item.quantity || 1,
      }))

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      // Parse shipping address from metadata
      let shippingAddress = {
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      }

      if (session.metadata?.shippingAddress) {
        try {
          shippingAddress = JSON.parse(session.metadata.shippingAddress)
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error parsing shipping address:", e)
          }
        }
      }

      // Create order in database
      await Order.create({
        userId: session.metadata?.userId || "",
        userEmail: session.metadata?.userEmail || session.customer_email || "",
        items,
        total,
        status: "pending",
        shippingAddress,
      })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Webhook error:", error)
    }
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? error.message : "Webhook processing failed" },
      { status: 400 }
    )
  }
}

