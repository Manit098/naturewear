import { currentUser } from "@clerk/nextjs/server"

export async function isAdmin() {
  const user = await currentUser()
  return user?.publicMetadata?.role === "admin"
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error("Unauthorized: Admin access required")
  }
  return true
}

