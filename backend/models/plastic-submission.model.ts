import mongoose, { type Document, Schema } from "mongoose"

export enum PlasticType {
  PET = "PET",
  HDPE = "HDPE",
  PVC = "PVC",
  LDPE = "LDPE",
  PP = "PP",
  PS = "PS",
  OTHER = "OTHER",
}

export enum SubmissionStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export interface IPlasticSubmission extends Document {
  user: mongoose.Types.ObjectId
  batchId?: string
  type: PlasticType
  weight: number
  imageUrl: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  status: SubmissionStatus
  verificationData?: {
    verifiedBy?: mongoose.Types.ObjectId
    verifiedAt?: Date
    aiConfidence?: number
    notes?: string
  }
  tokenReward?: number
  createdAt: Date
  updatedAt: Date
}

const plasticSubmissionSchema = new Schema<IPlasticSubmission>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    batchId: {
      type: String,
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
    imageUrl: {
      type: String,
      required: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.PENDING,
    },
    verificationData: {
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: Date,
      aiConfidence: Number,
      notes: String,
    },
    tokenReward: {
      type: Number,
    },
  },
  { timestamps: true },
)

export default mongoose.model<IPlasticSubmission>("PlasticSubmission", plasticSubmissionSchema)
