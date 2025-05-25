import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { BadRequestError } from "../errors"
import TokenTransaction from "../models/token-transaction.model"
import User from "../models/user.model"
import MaterialBatch from "../models/material-batch.model"

// Handle blockchain events
export const handleBlockchainEvent = async (req: Request, res: Response) => {
  const { eventType, txHash, data } = req.body

  if (!eventType || !txHash) {
    throw new BadRequestError("Event type and transaction hash are required")
  }

  try {
    // Process different event types
    switch (eventType) {
      case "RewardDistributed":
        await processRewardEvent(txHash, data)
        break
      case "BatchCreated":
        await processBatchEvent(txHash, data)
        break
      case "ConsumerLinked":
        await processConsumerEvent(txHash, data)
        break
      default:
        throw new BadRequestError(`Unknown event type: ${eventType}`)
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Processed ${eventType} event`,
    })
  } catch (error) {
    console.error(`Webhook error (${eventType}):`, error)
    throw new BadRequestError(`Failed to process webhook: ${error.message}`)
  }
}

// Process reward distribution event
const processRewardEvent = async (txHash: string, data: any) => {
  const { to, role, amount, metadata } = data

  if (!to || !amount) {
    throw new BadRequestError("Recipient address and amount are required")
  }

  // Find user by wallet address
  const user = await User.findOne({ walletAddress: to })

  if (!user) {
    console.warn(`User with wallet address ${to} not found`)
    return
  }

  // Check if transaction already exists
  const existingTx = await TokenTransaction.findOne({ txHash })

  if (existingTx) {
    console.log(`Transaction ${txHash} already processed`)
    return
  }

  // Create transaction record
  await TokenTransaction.create({
    user: user._id,
    type: "reward",
    amount: Number.parseFloat(amount),
    metadata: metadata || `Blockchain reward: ${role}`,
    txHash,
    status: "completed",
  })

  console.log(`Processed reward event for user ${user._id}, amount: ${amount}`)
}

// Process batch creation event
const processBatchEvent = async (txHash: string, data: any) => {
  const { batchId, producerId, type, weight } = data

  if (!batchId) {
    throw new BadRequestError("Batch ID is required")
  }

  // Check if batch already exists
  const existingBatch = await MaterialBatch.findOne({ batchId })

  if (existingBatch) {
    // Update blockchain transaction hash if not set
    if (!existingBatch.blockchainTxHash) {
      existingBatch.blockchainTxHash = txHash
      await existingBatch.save()
    }
    return
  }

  // Find producer by ID or wallet address
  const producer = await User.findOne({
    $or: [{ _id: producerId }, { walletAddress: producerId }],
  })

  if (!producer) {
    console.warn(`Producer ${producerId} not found`)
    return
  }

  // Create batch record
  await MaterialBatch.create({
    batchId,
    producer: producer._id,
    type: type || "OTHER",
    weight: Number.parseFloat(weight) || 0,
    status: "verified",
    blockchainTxHash: txHash,
  })

  console.log(`Processed batch creation event for batch ${batchId}`)
}

// Process consumer linking event
const processConsumerEvent = async (txHash: string, data: any) => {
  const { batchId, consumerId } = data

  if (!batchId || !consumerId) {
    throw new BadRequestError("Batch ID and consumer ID are required")
  }

  // Find batch
  const batch = await MaterialBatch.findOne({ batchId })

  if (!batch) {
    console.warn(`Batch ${batchId} not found`)
    return
  }

  // Find consumer by ID or wallet address
  const consumer = await User.findOne({
    $or: [{ _id: consumerId }, { walletAddress: consumerId }],
  })

  if (!consumer) {
    console.warn(`Consumer ${consumerId} not found`)
    return
  }

  // Check if consumer is already linked
  if (batch.consumers.includes(consumer._id)) {
    console.log(`Consumer ${consumer._id} already linked to batch ${batchId}`)
    return
  }

  // Add consumer to batch
  batch.consumers.push(consumer._id)
  await batch.save()

  console.log(`Processed consumer linking event for batch ${batchId}, consumer: ${consumer._id}`)
}

// Handle external service webhooks (e.g., payment processors, notification services)
export const handleExternalServiceWebhook = async (req: Request, res: Response) => {
  const { service, event, data } = req.body

  if (!service || !event) {
    throw new BadRequestError("Service and event are required")
  }

  try {
    // Process different services
    switch (service) {
      case "payment":
        await processPaymentWebhook(event, data)
        break
      case "notification":
        await processNotificationWebhook(event, data)
        break
      default:
        throw new BadRequestError(`Unknown service: ${service}`)
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Processed ${service} webhook: ${event}`,
    })
  } catch (error) {
    console.error(`External webhook error (${service}/${event}):`, error)
    throw new BadRequestError(`Failed to process webhook: ${error.message}`)
  }
}

// Process payment service webhook
const processPaymentWebhook = async (event: string, data: any) => {
  // Implementation depends on the payment service
  console.log(`Processing payment webhook: ${event}`, data)
}

// Process notification service webhook
const processNotificationWebhook = async (event: string, data: any) => {
  // Implementation depends on the notification service
  console.log(`Processing notification webhook: ${event}`, data)
}
