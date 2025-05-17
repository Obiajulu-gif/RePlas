import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { BadRequestError } from "../errors"
import TokenTransaction from "../models/token-transaction.model"
import MaterialBatch from "../models/material-batch.model"

// Handle token transfer events
export const handleTokenTransfer = async (req: Request, res: Response) => {
  const { txHash, from, to, amount, eventType } = req.body

  if (!txHash || !from || !to || !amount || !eventType) {
    throw new BadRequestError("Missing required fields")
  }

  try {
    // Find any pending transactions with this hash
    const transaction = await TokenTransaction.findOne({
      txHash,
      status: "pending",
    })

    if (transaction) {
      // Update transaction status
      transaction.status = "completed"
      await transaction.save()
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Webhook processed successfully",
    })
  } catch (error) {
    throw new BadRequestError(`Webhook processing failed: ${error.message}`)
  }
}

// Handle batch update events
export const handleBatchUpdate = async (req: Request, res: Response) => {
  const { batchId, status, txHash } = req.body

  if (!batchId || !status || !txHash) {
    throw new BadRequestError("Missing required fields")
  }

  try {
    // Find batch
    const batch = await MaterialBatch.findOne({ batchId })

    if (batch) {
      // Update batch status
      batch.status = status
      batch.blockchainTxHash = txHash
      await batch.save()
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Webhook processed successfully",
    })
  } catch (error) {
    throw new BadRequestError(`Webhook processing failed: ${error.message}`)
  }
}
