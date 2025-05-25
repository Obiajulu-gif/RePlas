import crypto from "crypto"
import QRCode from "qrcode"
import { NotFoundError } from "../errors"
import PlasticSubmission from "../models/plastic-submission.model"

// Generate a batch ID
export const generateBatchId = async (submissionId: string): Promise<string> => {
  // Create a hash of the submission ID and current timestamp
  const hash = crypto.createHash("sha256").update(`${submissionId}-${Date.now()}`).digest("hex")

  // Use first 8 characters of hash
  const batchId = `BATCH-${hash.substring(0, 8).toUpperCase()}`

  return batchId
}

// Generate QR code for a batch
export const generateQRCode = async (batchId: string): Promise<string> => {
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(batchId, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 300,
    })

    return qrCodeDataUrl
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`)
  }
}

// Resolve batch ID to get batch information
export const resolveBatchId = async (batchId: string): Promise<any> => {
  // Find submission with this batch ID
  const submission = await PlasticSubmission.findOne({ batchId }).populate("user", "name email role")

  if (!submission) {
    throw new NotFoundError(`No batch found with ID: ${batchId}`)
  }

  return {
    batchId: submission.batchId,
    type: submission.type,
    weight: submission.weight,
    status: submission.status,
    submittedBy: submission.user,
    submittedAt: submission.createdAt,
    verifiedAt: submission.verificationData?.verifiedAt,
  }
}

// Generate multiple QR codes for a producer
export const generateMultipleQRCodes = async (
  count: number,
  producerId: string,
  plasticType: string,
): Promise<Array<{ batchId: string; qrCode: string }>> => {
  const results = []

  for (let i = 0; i < count; i++) {
    // Generate unique batch ID
    const hash = crypto.createHash("sha256").update(`${producerId}-${plasticType}-${Date.now()}-${i}`).digest("hex")

    const batchId = `BATCH-${hash.substring(0, 8).toUpperCase()}`

    // Generate QR code
    const qrCode = await generateQRCode(batchId)

    results.push({ batchId, qrCode })
  }

  return results
}
