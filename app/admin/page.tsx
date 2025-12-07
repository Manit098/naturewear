"use client"

import { motion } from "framer-motion"
import { Users, Package } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface Stats {
  totalUsers: number
  totalOrders: number
}

export default function AdminDashboard() {
  const { user } = useUser()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const timeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent">
            {timeOfDay()}, {user?.firstName || "Admin"}! 👋
          </span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Here's what's happening with your store today
        </p>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Total Users",
              value: stats.totalUsers.toLocaleString(),
              icon: Users,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50",
            },
            {
              title: "Total Orders",
              value: stats.totalOrders.toLocaleString(),
              icon: Package,
              color: "from-green-500 to-green-600",
              bgColor: "bg-green-50",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-md`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 font-medium text-sm sm:text-base">{stat.title}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-green-100"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          Quick Actions
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Navigate to <strong>Settings</strong> from the sidebar to manage your
          store policies, including Privacy Policy, Refund Policy, and Important
          Notices.
        </p>
      </motion.div>
    </div>
  )
}
