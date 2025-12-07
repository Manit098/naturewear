"use client"

import { SignIn } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Leaf } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <Leaf className="w-12 h-12 text-green-600 mx-auto" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="text-gray-600">
            Sign in to your NatureWear account
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-2xl border border-green-100",
                headerTitle: "text-green-700",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "border-green-200 hover:bg-green-50",
                formButtonPrimary: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
                footerActionLink: "text-green-600 hover:text-green-700",
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

