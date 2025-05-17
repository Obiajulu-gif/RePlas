import mongoose, { type Document, Schema } from "mongoose"
import { PlasticType } from "./plastic-submission.model"

export interface IMaterialBatch extends Document {
  batchId: string
  producer: mongoose.Types.ObjectId
  type: PlasticType
  weight: number
  submissions: mongoose.Types.ObjectId[]
  consumers: mongoose.Types.ObjectId[]
  recyclers: mongoose.Types.ObjectId[]
  status: "pending" | "verified" | "processed" | "recycled"
  blockchainTxHash?: string
  createdAt: Date
  updatedAt: Date
}

const materialBatchSchema = new Schema<IMaterialBatch>(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
    },
    producer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(PlasticType),
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: [0.01, "Weight must be at least 0.01 kg"],
    },
    submissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "PlasticSubmission",
      },
    ],
    consumers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    recyclers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "verified", "processed", "recycled"],
      default: "pending",
    },
    blockchainTxHash: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model<IMaterialBatch>("MaterialBatch", materialBatchSchema)
