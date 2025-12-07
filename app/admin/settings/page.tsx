"use client"

import { motion } from "framer-motion"
import { Save, Lock, RotateCcw, FileText } from "lucide-react"
import { useState, useEffect } from "react"

type PolicyType = "privacy" | "refund" | "important" | "terms"

interface Policy {
  type: PolicyType
  content: string
}

export default function SettingsPage() {
  const [policies, setPolicies] = useState<Policy[]>([
    { type: "privacy", content: "" },
    { type: "refund", content: "" },
    { type: "important", content: "" },
    { type: "terms", content: "" },
  ])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<PolicyType | null>(null)
  const [saved, setSaved] = useState<PolicyType | null>(null)

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const response = await fetch("/api/policies")
      if (response.ok) {
        const data = await response.json()
        const policiesMap = new Map<string, string>(
          data.map((p: { type: PolicyType; content: string }) => [p.type, p.content])
        )
        setPolicies((prev) =>
          prev.map((p) => ({
            ...p,
            content: (policiesMap.get(p.type) as string) || "",
          }))
        )
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching policies:", error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (type: PolicyType) => {
    setSaving(type)
    setSaved(null)

    try {
      const policy = policies.find((p) => p.type === type)
      if (!policy) return

      const response = await fetch("/api/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          content: policy.content,
        }),
      })

      if (response.ok) {
        setSaved(type)
        setTimeout(() => setSaved(null), 3000)
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error saving policy:", error)
      }
    } finally {
      setSaving(null)
    }
  }

  const updatePolicy = (type: PolicyType, content: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.type === type ? { ...p, content } : p))
    )
  }

  const policyConfig = [
    {
      type: "privacy" as PolicyType,
      title: "Privacy Policy",
      icon: Lock,
      description: "Manage your privacy policy content",
      color: "from-purple-500 to-purple-600",
    },
    {
      type: "refund" as PolicyType,
      title: "Refund Policy",
      icon: RotateCcw,
      description: "Manage your refund policy content",
      color: "from-orange-500 to-orange-600",
    },
    {
      type: "terms" as PolicyType,
      title: "Terms of Service",
      icon: FileText,
      description: "Manage terms and conditions content",
      color: "from-blue-500 to-blue-600",
    },
    {
      type: "important" as PolicyType,
      title: "Important Notice",
      icon: FileText,
      description: "Manage important notices (shown on /important page)",
      color: "from-green-500 to-green-600",
    },
  ]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading policies...</p>
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
            Settings
          </span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Manage your store policies and important notices
        </p>
      </motion.div>

      <div className="space-y-6">
        {policyConfig.map((config, index) => {
          const policy = policies.find((p) => p.type === config.type)
          return (
            <motion.div
              key={config.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-green-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${config.color} flex items-center justify-center`}
                >
                  <config.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {config.title}
                  </h2>
                  <p className="text-gray-600 text-sm">{config.description}</p>
                </div>
              </div>

              <textarea
                value={policy?.content || ""}
                onChange={(e) => updatePolicy(config.type, e.target.value)}
                placeholder={`Enter ${config.title.toLowerCase()} content here...`}
                className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm"
              />

              <div className="mt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSave(config.type)}
                  disabled={saving === config.type}
                  className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
                    saved === config.type
                      ? "bg-green-500 text-white"
                      : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                  } shadow-lg hover:shadow-xl transition-all disabled:opacity-50`}
                >
                  {saving === config.type ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : saved === config.type ? (
                    <>
                      <Save className="w-5 h-5" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save {config.title}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

