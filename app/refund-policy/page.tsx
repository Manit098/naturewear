"use client"

import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"

export default function RefundPolicyPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolicy()
  }, [])

  const fetchPolicy = async () => {
    try {
      const response = await fetch("/api/policies?type=refund")
      if (response.ok) {
        const data = await response.json()
        setContent(data.content || "")
      }
    } catch (error) {
      console.error("Error fetching policy:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <RotateCcw className="w-16 h-16 text-green-600 mx-auto" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent">
              Refund Policy
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Our refund and return policy
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg"
          >
            {content ? (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-4">
                  Refund policy content will be managed from the admin dashboard
                </p>
                <p className="text-gray-400">
                  This content will be stored in the database and displayed here dynamically.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

