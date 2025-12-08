import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"

const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID || ""
  const secret = process.env.PAYPAL_SECRET || ""

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64")
  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal token error: ${text}`)
  }

  const data = await res.json()
  return data.access_token as string
}

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

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )

    const accessToken = await getPayPalAccessToken()

    const orderRes = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total.toFixed(2),
            },
            shipping: {
              name: { full_name: shippingAddress.fullName },
              address: {
                address_line_1: shippingAddress.addressLine1,
                address_line_2: shippingAddress.addressLine2 || "",
                admin_area_2: shippingAddress.city,
                admin_area_1: shippingAddress.state,
                postal_code: shippingAddress.zipCode,
                country_code: shippingAddress.country || "US",
              },
            },
          },
        ],
        application_context: {
          shipping_preference: "SET_PROVIDED_ADDRESS",
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/cart?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/cart?canceled=true`,
        },
      }),
    })

    if (!orderRes.ok) {
      const text = await orderRes.text()
      throw new Error(`PayPal order error: ${text}`)
    }

    const orderData = await orderRes.json()
    const approvalLink = orderData.links?.find(
      (link: any) => link.rel === "approve"
    )?.href

    // Create order in DB as pending
    await connectDB()
    await Order.create({
      userId: user.id,
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      paypalOrderId: orderData.id,
      items,
      total,
      status: "pending",
      shippingAddress,
    })
    
    return NextResponse.json({ orderId: orderData.id, url: approvalLink }, { status: 200 })
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating PayPal checkout:", error)
    }
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? error.message : "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

