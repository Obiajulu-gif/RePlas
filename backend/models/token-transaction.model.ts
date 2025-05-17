import mongoose, { type Document, Schema } from "mongoose"

export enum TransactionType {
  REWARD = "reward",
  TRANSFER = "transfer",
  PURCHASE = "purchase",
  REDEMPTION = "redemption",
}

export interface ITokenTransaction extends Document {
  user: mongoose.Types.ObjectId
  type: TransactionType
  amount: number
  metadata: string
  txHash?: string
  status: "pending" | "completed" | "failed"
  createdAt: Date
  updatedAt: Date
}

const tokenTransactionSchema = new Schema<ITokenTransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    metadata: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
)

export default mongoose.model<ITokenTransaction>("TokenTransaction", tokenTransactionSchema)
