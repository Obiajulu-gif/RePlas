import type { Request, Response } from "express"
import TokenTransaction, { TransactionType } from "../models/token-transaction.model"
import User from "../models/user.model"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError } from "../errors"
import { distributeRewards, getTokenBalance } from "../services/token-reward.service"

// Get token balance
export const getBalance = async (req: Request, res: Response) => {
  const userId = req.user.id

  const user = await User.findById(userId)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  if (!user.walletAddress) {
    throw new BadRequestError("User does not have a wallet address")
  }

  const balance = await getTokenBalance(user.walletAddress)

  res.status(StatusCodes.OK).json({
    success: true,
    balance,
  })
}

// Get transaction history
export const getTransactionHistory = async (req: Request, res: Response) => {
  const userId = req.user.id

  const transactions = await TokenTransaction.find({ user: userId }).sort({ createdAt: -1 })

  res.status(StatusCodes.OK).json({
    success: true,
    count: transactions.length,
    transactions: transactions.map((tx) => ({
      id: tx._id,
      type: tx.type,
      amount: tx.amount,
      metadata: tx.metadata,
      txHash: tx.txHash,
      status: tx.status,
      createdAt: tx.createdAt,
    })),
  })
}

// Transfer tokens
export const transferTokens = async (req: Request, res: Response) => {
  const { recipientAddress, amount, metadata } = req.body
  const userId = req.user.id

  if (!recipientAddress) {
    throw new BadRequestError("Recipient address is required")
  }

  if (!amount || amount <= 0) {
    throw new BadRequestError("Amount must be greater than 0")
  }

  const user = await User.findById(userId)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  if (!user.walletAddress) {
    throw new BadRequestError("User does not have a wallet address")
  }

  // Create transaction record
  const transaction = await TokenTransaction.create({
    user: userId,
    type: TransactionType.TRANSFER,
    amount,
    metadata: metadata || `Transfer to ${recipientAddress}`,
  })

  try {
    // Call blockchain service to transfer tokens
    const txHash = await transferTokensOnChain(user.walletAddress, recipientAddress, amount)

    // Update transaction with hash and status
    transaction.txHash = txHash
    transaction.status = "completed"
    await transaction.save()

    res.status(StatusCodes.OK).json({
      success: true,
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        txHash: transaction.txHash,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
    })
  } catch (error) {
    // Update transaction status to failed
    transaction.status = "failed"
    await transaction.save()

    throw new BadRequestError(`Transfer failed: ${error.message}`)
  }
}

// Admin: Distribute rewards
export const adminDistributeRewards = async (req: Request, res: Response) => {
  const { userId, amount, metadata } = req.body

  if (!userId) {
    throw new BadRequestError("User ID is required")
  }

  if (!amount || amount <= 0) {
    throw new BadRequestError("Amount must be greater than 0")
  }

  const user = await User.findById(userId)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  try {
    // Distribute rewards
    const txHash = await distributeRewards(userId, amount, metadata || "Admin reward distribution")

    res.status(StatusCodes.OK).json({
      success: true,
      txHash,
    })
  } catch (error) {
    throw new BadRequestError(`Reward distribution failed: ${error.message}`)
  }
}

// Mock function for transferring tokens on-chain
// In a real implementation, this would call the Celo contract
const transferTokensOnChain = async (fromAddress: string, toAddress: string, amount: number): Promise<string> => {
  // Simulate blockchain delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock transaction hash
  return `0x${Math.random().toString(16).substr(2, 64)}`
}
