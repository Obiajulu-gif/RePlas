import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { BadRequestError } from "../errors"
import { chatWithAI, analyzeImage, generateEnvironmentalImpact, detectFakeSubmission } from "../services/ai.service"
import PlasticSubmission from "../models/plastic-submission.model"

// Chat with AI
export const chat = async (req: Request, res: Response) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new BadRequestError("Messages are required")
  }

  try {
    const response = await chatWithAI(messages)

    res.status(StatusCodes.OK).json({
      success: true,
      response,
    })
  } catch (error) {
    throw new BadRequestError(`AI chat failed: ${error.message}`)
  }
}

// Analyze image
export const analyze = async (req: Request, res: Response) => {
  const { imageUrl } = req.body

  if (!imageUrl) {
    throw new BadRequestError("Image URL is required")
  }

  try {
    const analysis = await analyzeImage(imageUrl)

    res.status(StatusCodes.OK).json({
      success: true,
      analysis,
    })
  } catch (error) {
    throw new BadRequestError(`Image analysis failed: ${error.message}`)
  }
}

// Generate environmental impact
export const environmentalImpact = async (req: Request, res: Response) => {
  const userId = req.user.id

  try {
    // Get user's verified submissions
    const submissions = await PlasticSubmission.find({
      user: userId,
      status: "verified",
    })

    // Format submissions for impact calculation
    const formattedSubmissions = submissions.map((sub) => ({
      type: sub.type,
      weight: sub.weight,
      timestamp: sub.createdAt.getTime(),
    }))

    // Generate impact
    const impact = await generateEnvironmentalImpact(formattedSubmissions)

    res.status(StatusCodes.OK).json({
      success: true,
      impact,
    })
  } catch (error) {
    throw new BadRequestError(`Environmental impact generation failed: ${error.message}`)
  }
}

// Detect fake submission
export const detectFake = async (req: Request, res: Response) => {
  const { imageUrl, claimedType, claimedWeight } = req.body

  if (!imageUrl || !claimedType || !claimedWeight) {
    throw new BadRequestError("Image URL, claimed type, and claimed weight are required")
  }

  try {
    const result = await detectFakeSubmission(imageUrl, claimedType, claimedWeight)

    res.status(StatusCodes.OK).json({
      success: true,
      result,
    })
  } catch (error) {
    throw new BadRequestError(`Fake detection failed: ${error.message}`)
  }
}
