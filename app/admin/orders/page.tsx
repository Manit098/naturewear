"use client"

import { motion } from "framer-motion"
import { Package, Calendar, CheckCircle, XCircle, Clock, Truck, MapPin, Mail } from "lucide-react"
import { useState, useEffect } from "react"

interface Order {
  _id: string
  userId: string
  userEmail: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "delayed"
  deliveryTime?: string
  shippingAddress?: {
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    status: "",
    deliveryTime: "",
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        setEditingOrder(null)
        setEditData({ status: "", deliveryTime: "" })
        fetchOrders()
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700"
      case "shipped":
        return "bg-blue-100 text-blue-700"
      case "processing":
        return "bg-yellow-100 text-yellow-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      case "delayed":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return CheckCircle
      case "shipped":
        return Truck
      case "cancelled":
        return XCircle
      case "delayed":
        return Clock
      default:
        return Package
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent">
            Orders Management
          </span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Manage and track all customer orders
        </p>
      </motion.div>

      <div className="space-y-4">
        {orders.map((order, index) => {
          const StatusIcon = getStatusIcon(order.status)
          const isEditing = editingOrder === order._id

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-lg font-bold text-gray-900">
                      Order #{order._id.substring(0, 8)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <p>
                      <strong>User ID:</strong> {order.userId.substring(0, 20)}...
                    </p>
                    {order.userEmail && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <strong>Email:</strong>{" "}
                        <a
                          href={`mailto:${order.userEmail}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {order.userEmail}
                        </a>
                      </p>
                    )}
                    <p>
                      <strong>Items:</strong> {order.items.length} item(s)
                    </p>
                    <p>
                      <strong>Total:</strong> ${order.total.toFixed(2)}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.deliveryTime && (
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <strong>Delivery:</strong>{" "}
                        {new Date(order.deliveryTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Order Items:
                    </p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
                        >
                          {item.name} - Qty: {item.quantity} - $
                          {item.price.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.shippingAddress && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-semibold text-gray-900">
                          Shipping Address:
                        </p>
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><strong>{order.shippingAddress.fullName}</strong></p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && (
                          <p>{order.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                        <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:w-64 w-full">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={editData.status || order.status}
                          onChange={(e) =>
                            setEditData({ ...editData, status: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="delayed">Delayed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Delivery Time
                        </label>
                        <input
                          type="datetime-local"
                          value={
                            editData.deliveryTime ||
                            (order.deliveryTime
                              ? new Date(order.deliveryTime)
                                  .toISOString()
                                  .slice(0, 16)
                              : "")
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              deliveryTime: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(order._id)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingOrder(null)
                            setEditData({ status: "", deliveryTime: "" })
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingOrder(order._id)
                        setEditData({
                          status: order.status,
                          deliveryTime: order.deliveryTime
                            ? new Date(order.deliveryTime).toISOString().slice(0, 16)
                            : "",
                        })
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-semibold"
                    >
                      Update Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-20">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No orders yet</p>
        </div>
      )}
    </div>
  )
}

