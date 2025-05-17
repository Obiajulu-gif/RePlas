import type { Request, Response } from "express"
import PlasticSubmission, { PlasticType, SubmissionStatus } from "../models/plastic-submission.model"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError } from "../errors"
import { analyzeImage } from "../services/ai.service"
import { generateBatchId } from "../services/qr-code.service"
import { distributeRewards } from "../services/token-reward.service"
import { uploadImage } from "../services/storage.service"

// Create a new plastic submission
export const createSubmission = async (req: Request, res: Response) => {
  const { type, weight, image, location } = req.body
  const userId = req.user.id

  // Validate plastic type
  if (!Object.values(PlasticType).includes(type)) {
    throw new BadRequestError("Invalid plastic type")
  }

  // Validate weight
  if (!weight || weight <= 0) {
    throw new BadRequestError("Weight must be greater than 0")
  }

  // Validate image
  if (!image) {
    throw new BadRequestError("Image is required")
  }

  // Upload image to storage
  const imageUrl = await uploadImage(image)

  // Analyze image with AI
  const aiAnalysis = await analyzeImage(imageUrl)

  // Create submission
  const submission = await PlasticSubmission.create({
    user: userId,
    type,
    weight,
    imageUrl,
    location,
    status: SubmissionStatus.PENDING,
    verificationData: {
      aiConfidence: aiAnalysis.confidence,
      notes: aiAnalysis.description,
    },
  })

  // If AI confidence is high, auto-verify
  if (aiAnalysis.confidence > 0.85 && aiAnalysis.type === type) {
    submission.status = SubmissionStatus.VERIFIED
    submission.verificationData.verifiedAt = new Date()

    // Calculate token reward
    const tokenReward = calculateReward(type, weight)
    submission.tokenReward = tokenReward

    // Generate batch ID if not already assigned
    if (!submission.batchId) {
      submission.batchId = await generateBatchId(submission._id.toString())
    }

    await submission.save()

    // Distribute tokens
    await distributeRewards(userId, tokenReward, `Verified submission: ${submission._id}`)
  } else {
    await submission.save()
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    submission: {
      id: submission._id,
      type: submission.type,
      weight: submission.weight,
      status: submission.status,
      batchId: submission.batchId,
      tokenReward: submission.tokenReward,
      aiConfidence: submission.verificationData?.aiConfidence,
      createdAt: submission.createdAt,
    },
  })
}

// Get all submissions for current user
export const getUserSubmissions = async (req: Request, res: Response) => {
  const userId = req.user.id

  const submissions = await PlasticSubmission.find({ user: userId }).sort({ createdAt: -1 })

  res.status(StatusCodes.OK).json({
    success: true,
    count: submissions.length,
    submissions: submissions.map((submission) => ({
      id: submission._id,
      type: submission.type,
      weight: submission.weight,
      status: submission.status,
      batchId: submission.batchId,
      tokenReward: submission.tokenReward,
      imageUrl: submission.imageUrl,
      createdAt: submission.createdAt,
    })),
  })
}

// Get submission by ID
export const getSubmissionById = async (req: Request, res: Response) => {
  const { id } = req.params

  const submission = await PlasticSubmission.findById(id)

  if (!submission) {
    throw new NotFoundError(`No submission with id ${id}`)
  }

  // Check if user is authorized to view this submission
  if (submission.user.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "recycler") {
    throw new NotFoundError(`No submission with id ${id}`)
  }

  res.status(StatusCodes.OK).json({
    success: true,
    submission: {
      id: submission._id,
      user: submission.user,
      type: submission.type,
      weight: submission.weight,
      status: submission.status,
      batchId: submission.batchId,
      tokenReward: submission.tokenReward,
      imageUrl: submission.imageUrl,
      location: submission.location,
      verificationData: submission.verificationData,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    },
  })
}

// Verify submission (admin or recycler only)
export const verifySubmission = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status, notes } = req.body

  // Validate status
  if (!Object.values(SubmissionStatus).includes(status)) {
    throw new BadRequestError("Invalid status")
  }

  const submission = await PlasticSubmission.findById(id)

  if (!submission) {
    throw new NotFoundError(`No submission with id ${id}`)
  }

  // Update submission
  submission.status = status
  submission.verificationData = {
    ...submission.verificationData,
    verifiedBy: req.user.id,
    verifiedAt: new Date(),
    notes: notes || submission.verificationData?.notes,
  }

  // If verified, calculate and distribute rewards
  if (status === SubmissionStatus.VERIFIED && submission.status !== SubmissionStatus.VERIFIED) {
    // Calculate token reward
    const tokenReward = calculateReward(submission.type, submission.weight)
    submission.tokenReward = tokenReward

    // Generate batch ID if not already assigned
    if (!submission.batchId) {
      submission.batchId = await generateBatchId(submission._id.toString())
    }

    await submission.save()

    // Distribute tokens
    await distributeRewards(submission.user.toString(), tokenReward, `Verified submission: ${submission._id}`)
  } else {
    await submission.save()
  }

  res.status(StatusCodes.OK).json({
    success: true,
    submission: {
      id: submission._id,
      status: submission.status,
      batchId: submission.batchId,
      tokenReward: submission.tokenReward,
      verificationData: submission.verificationData,
    },
  })
}

// Get all submissions (admin or recycler only)
export const getAllSubmissions = async (req: Request, res: Response) => {
  const { status, type, startDate, endDate } = req.query

  // Build query
  const query: any = {}

  if (status) {
    query.status = status
  }

  if (type) {
    query.type = type
  }

  if (startDate || endDate) {
    query.createdAt = {}
    if (startDate) {
      query.createdAt.$gte = new Date(startDate as string)
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate as string)
    }
  }

  const submissions = await PlasticSubmission.find(query).sort({ createdAt: -1 }).populate("user", "name email role")

  res.status(StatusCodes.OK).json({
    success: true,
    count: submissions.length,
    submissions: submissions.map((submission) => ({
      id: submission._id,
      user: submission.user,
      type: submission.type,
      weight: submission.weight,
      status: submission.status,
      batchId: submission.batchId,
      tokenReward: submission.tokenReward,
      imageUrl: submission.imageUrl,
      createdAt: submission.createdAt,
    })),
  })
}

// Helper function to calculate token reward based on plastic type and weight
const calculateReward = (type: PlasticType, weight: number): number => {
  // Reward rates per kg
  const rewardRates: Record<PlasticType, number> = {
    [PlasticType.PET]: 10,
    [PlasticType.HDPE]: 8,
    [PlasticType.PVC]: 4,
    [PlasticType.LDPE]: 6,
    [PlasticType.PP]: 7,
    [PlasticType.PS]: 5,
    [PlasticType.OTHER]: 3,
  }

  return Math.round(weight * rewardRates[type] * 100) / 100
}
