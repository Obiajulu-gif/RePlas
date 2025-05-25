import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError } from "../errors"
import MaterialBatch from "../models/material-batch.model"
import PlasticSubmission from "../models/plastic-submission.model"
import { logPlasticBatch, linkConsumerToBatch } from "../services/traceability.service"

// Create a new material batch
export const createBatch = async (req: Request, res: Response) => {
  const { batchId, type, weight } = req.body
  const producerId = req.user.id

  if (!batchId || !type || !weight) {
    throw new BadRequestError("Batch ID, type, and weight are required")
  }

  // Check if batch already exists
  const existingBatch = await MaterialBatch.findOne({ batchId })

  if (existingBatch) {
    throw new BadRequestError("Batch ID already exists")
  }

  try {
    // Create batch
    const batch = await MaterialBatch.create({
      batchId,
      producer: producerId,
      type,
      weight,
      status: "pending",
    })

    // Log batch on blockchain
    const txHash = await logPlasticBatch(batchId, weight.toString(), type, producerId)

    // Update batch with transaction hash
    batch.blockchainTxHash = txHash
    await batch.save()

    res.status(StatusCodes.CREATED).json({
      success: true,
      batch: {
        id: batch._id,
        batchId: batch.batchId,
        type: batch.type,
        weight: batch.weight,
        status: batch.status,
        blockchainTxHash: batch.blockchainTxHash,
        createdAt: batch.createdAt,
      },
    })
  } catch (error) {
    throw new BadRequestError(`Batch creation failed: ${error.message}`)
  }
}

// Get batch by ID
export const getBatchById = async (req: Request, res: Response) => {
  const { batchId } = req.params

  const batch = await MaterialBatch.findOne({ batchId })
    .populate("producer", "name email role")
    .populate("submissions")
    .populate("consumers", "name email role")
    .populate("recyclers", "name email role")

  if (!batch) {
    throw new NotFoundError(`No batch found with ID: ${batchId}`)
  }

  res.status(StatusCodes.OK).json({
    success: true,
    batch: {
      id: batch._id,
      batchId: batch.batchId,
      producer: batch.producer,
      type: batch.type,
      weight: batch.weight,
      status: batch.status,
      submissions: batch.submissions,
      consumers: batch.consumers,
      recyclers: batch.recyclers,
      blockchainTxHash: batch.blockchainTxHash,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    },
  })
}

// Link submission to batch
export const linkSubmissionToBatch = async (req: Request, res: Response) => {
  const { batchId, submissionId } = req.body

  if (!batchId || !submissionId) {
    throw new BadRequestError("Batch ID and submission ID are required")
  }

  // Find batch
  const batch = await MaterialBatch.findOne({ batchId })

  if (!batch) {
    throw new NotFoundError(`No batch found with ID: ${batchId}`)
  }

  // Find submission
  const submission = await PlasticSubmission.findById(submissionId)

  if (!submission) {
    throw new NotFoundError(`No submission found with ID: ${submissionId}`)
  }

  // Check if submission is already linked to this batch
  if (batch.submissions.includes(submission._id)) {
    throw new BadRequestError("Submission is already linked to this batch")
  }

  try {
    // Add submission to batch
    batch.submissions.push(submission._id)

    // Update submission with batch ID
    submission.batchId = batchId

    // Save both documents
    await batch.save()
    await submission.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Submission linked to batch successfully",
    })
  } catch (error) {
    throw new BadRequestError(`Linking failed: ${error.message}`)
  }
}

// Link consumer to batch
export const addConsumerToBatch = async (req: Request, res: Response) => {
  const { batchId } = req.body
  const consumerId = req.user.id

  if (!batchId) {
    throw new BadRequestError("Batch ID is required")
  }

  // Find batch
  const batch = await MaterialBatch.findOne({ batchId })

  if (!batch) {
    throw new NotFoundError(`No batch found with ID: ${batchId}`)
  }

  // Check if consumer is already linked to this batch
  if (batch.consumers.some((id) => id.toString() === consumerId)) {
    throw new BadRequestError("Consumer is already linked to this batch")
  }

  try {
    // Add consumer to batch
    batch.consumers.push(consumerId)

    // Log on blockchain
    await linkConsumerToBatch(batchId, consumerId)

    // Save batch
    await batch.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Consumer linked to batch successfully",
    })
  } catch (error) {
    throw new BadRequestError(`Linking failed: ${error.message}`)
  }
}

// Update batch status
export const updateBatchStatus = async (req: Request, res: Response) => {
  const { batchId } = req.params
  const { status } = req.body

  if (!status || !["pending", "verified", "processed", "recycled"].includes(status)) {
    throw new BadRequestError("Valid status is required")
  }

  // Find batch
  const batch = await MaterialBatch.findOne({ batchId })

  if (!batch) {
    throw new NotFoundError(`No batch found with ID: ${batchId}`)
  }

  // Update status
  batch.status = status

  // If recycler is updating status, add them to recyclers list
  if (req.user.role === "recycler" && !batch.recyclers.includes(req.user.id)) {
    batch.recyclers.push(req.user.id)
  }

  await batch.save()

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Batch status updated to ${status}`,
    batch: {
      batchId: batch.batchId,
      status: batch.status,
      updatedAt: batch.updatedAt,
    },
  })
}

// Get all batches
export const getAllBatches = async (req: Request, res: Response) => {
  const { status, type, producer } = req.query

  // Build query
  const query: any = {}

  if (status) {
    query.status = status
  }

  if (type) {
    query.type = type
  }

  if (producer) {
    query.producer = producer
  }

  const batches = await MaterialBatch.find(query).sort({ createdAt: -1 }).populate("producer", "name email role")

  res.status(StatusCodes.OK).json({
    success: true,
    count: batches.length,
    batches: batches.map((batch) => ({
      id: batch._id,
      batchId: batch.batchId,
      producer: batch.producer,
      type: batch.type,
      weight: batch.weight,
      status: batch.status,
      createdAt: batch.createdAt,
    })),
  })
}
