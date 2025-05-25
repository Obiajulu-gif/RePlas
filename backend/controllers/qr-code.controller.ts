import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { BadRequestError } from "../errors"
import { generateQRCode, resolveBatchId, generateMultipleQRCodes } from "../services/qr-code.service"

// Generate QR code for a batch ID
export const generateQR = async (req: Request, res: Response) => {
  const { batchId } = req.body

  if (!batchId) {
    throw new BadRequestError("Batch ID is required")
  }

  try {
    const qrCode = await generateQRCode(batchId)

    res.status(StatusCodes.OK).json({
      success: true,
      qrCode,
    })
  } catch (error) {
    throw new BadRequestError(`QR code generation failed: ${error.message}`)
  }
}

// Resolve a batch ID
export const resolveBatch = async (req: Request, res: Response) => {
  const { batchId } = req.params

  try {
    const batchInfo = await resolveBatchId(batchId)

    res.status(StatusCodes.OK).json({
      success: true,
      batch: batchInfo,
    })
  } catch (error) {
    throw new BadRequestError(`Batch resolution failed: ${error.message}`)
  }
}

// Generate multiple QR codes (for producers)
export const generateMultipleQR = async (req: Request, res: Response) => {
  const { count, plasticType } = req.body
  const producerId = req.user.id

  if (!count || count <= 0 || count > 100) {
    throw new BadRequestError("Count must be between 1 and 100")
  }

  if (!plasticType) {
    throw new BadRequestError("Plastic type is required")
  }

  try {
    const qrCodes = await generateMultipleQRCodes(count, producerId, plasticType)

    res.status(StatusCodes.OK).json({
      success: true,
      count: qrCodes.length,
      qrCodes,
    })
  } catch (error) {
    throw new BadRequestError(`QR code generation failed: ${error.message}`)
  }
}
