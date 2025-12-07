import mongoose, { Schema, Model } from "mongoose"

export interface IUser {
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
  },
  {
    timestamps: true,
  }
)

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User

