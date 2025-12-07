"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, LayoutDashboard, Settings, Package, ShoppingBag, Menu, X } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { AnimatePresence } from "framer-motion"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      if (!user || user.publicMetadata?.role !== "admin") {
        router.push("/")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, isLoaded, router])

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.publicMetadata?.role !== "admin") {
    return null
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="flex">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed top-24 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-green-100"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block w-64 bg-white border-r border-green-100 min-h-screen fixed left-0 top-20 z-30"
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                        isActive
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                          : "text-gray-700 hover:bg-green-50"
                      }`}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 sm:w-10 sm:h-10",
                    },
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {user.firstName || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
              />
              <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden w-64 bg-white border-r border-green-100 min-h-screen fixed left-0 top-20 z-50"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-green-600" />
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      Admin Panel
                    </span>
                  </div>

                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <motion.div
                            whileHover={{ x: 5 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                                : "text-gray-700 hover:bg-green-50"
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </motion.div>
                        </Link>
                      )
                    })}
                  </nav>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10",
                          },
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName || "Admin"}
                        </p>
                        <p className="text-xs text-gray-500">Administrator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 w-full lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}

