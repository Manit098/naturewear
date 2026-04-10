"use client"

import Link from "next/link"
import { ShoppingCart, Leaf, User, Shield, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function Nav() {
  const { user, isLoaded } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  
  const isAdmin = user?.publicMetadata?.role === "admin"

  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(cart.length)
    }
    updateCartCount()
    window.addEventListener("storage", updateCartCount)
    return () => window.removeEventListener("storage", updateCartCount)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </motion.div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              NatureWear
            </span>
            <span className="text-sm text-green-600 font-semibold hidden sm:inline">🇮🇳 India</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium text-sm lg:text-base"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium text-sm lg:text-base"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {isLoaded && (
              <>
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors font-medium text-sm lg:text-base"
                      >
                        <Shield className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="hidden lg:inline">Admin</span>
                      </Link>
                    )}
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8 lg:w-10 lg:h-10",
                        },
                      }}
                    />
                  </>
                ) : (
                  <div className="flex items-center gap-2 lg:gap-4">
                    <SignInButton mode="modal">
                      <button className="text-gray-700 hover:text-green-600 transition-colors font-medium text-sm lg:text-base">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold text-xs lg:text-sm shadow-lg hover:shadow-xl transition-shadow"
                      >
                        Sign Up
                      </motion.button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-green-100 bg-white"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
              >
                Products
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              
              {isLoaded && (
                <>
                  {user ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                        >
                          <Shield className="w-5 h-5" />
                          Admin
                        </Link>
                      )}
                      <div className="flex items-center gap-2 py-2">
                        <UserButton
                          appearance={{
                            elements: {
                              avatarBox: "w-8 h-8",
                            },
                          }}
                        />
                        <span className="text-sm text-gray-600">
                          {user.firstName || user.emailAddresses[0]?.emailAddress}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 pt-2">
                      <SignInButton mode="modal">
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                        >
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
                        >
                          Sign Up
                        </motion.button>
                      </SignUpButton>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

