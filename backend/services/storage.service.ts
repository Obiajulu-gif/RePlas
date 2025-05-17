import { v4 as uuidv4 } from "uuid"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { config } from "dotenv"

config()

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

/**
 * Uploads an image to storage
 * @param base64Image Base64-encoded image data
 * @returns URL of the uploaded image
 */
export const uploadImage = async (base64Image: string): Promise<string> => {
  try {
    // Remove data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")

    // Decode base64 to binary
    const buffer = Buffer.from(base64Data, "base64")

    // Generate unique filename
    const filename = `${uuidv4()}.jpg`

    // Upload to S3
    const bucketName = process.env.S3_BUCKET_NAME || "replas-images"
    const key = `submissions/${filename}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: "image/jpeg",
        ACL: "public-read",
      }),
    )

    // Return public URL
    return `https://${bucketName}.s3.amazonaws.com/${key}`
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}

/**
 * Uploads a QR code image to storage
 * @param qrCodeDataUrl QR code data URL
 * @param batchId Batch ID
 * @returns URL of the uploaded QR code
 */
export const uploadQRCode = async (qrCodeDataUrl: string, batchId: string): Promise<string> => {
  try {
    // Remove data URL prefix
    const base64Data = qrCodeDataUrl.replace(/^data:image\/\w+;base64,/, "")

    // Decode base64 to binary
    const buffer = Buffer.from(base64Data, "base64")

    // Upload to S3
    const bucketName = process.env.S3_BUCKET_NAME || "replas-images"
    const key = `qrcodes/${batchId}.png`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: "image/png",
        ACL: "public-read",
      }),
    )

    // Return public URL
    return `https://${bucketName}.s3.amazonaws.com/${key}`
  } catch (error) {
    console.error("Error uploading QR code:", error)
    throw new Error(`Failed to upload QR code: ${error.message}`)
  }
}
