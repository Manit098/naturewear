import mongoose, { Schema, Model } from "mongoose"

export interface IPolicy {
  type: "refund" | "privacy" | "important" | "terms"
  content: string
  updatedAt: Date
}

const PolicySchema = new Schema<IPolicy>(
  {
    type: {
      type: String,
      required: true,
      enum: ["refund", "privacy", "important", "terms"],
      unique: true,
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const Policy: Model<IPolicy> =
  mongoose.models.Policy || mongoose.model<IPolicy>("Policy", PolicySchema)

export default Policy

