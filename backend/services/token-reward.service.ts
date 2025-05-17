import { getContractKit } from "../config/blockchain"
import TokenTransaction, { TransactionType } from "../models/token-transaction.model"
import User from "../models/user.model"
import { RewardTokenContract } from "../contracts/reward-token"
import { NotFoundError } from "../errors"

// Distribute rewards to a user
export const distributeRewards = async (userId: string, amount: number, metadata: string): Promise<string> => {
  // Find user
  const user = await User.findById(userId)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  if (!user.walletAddress) {
    throw new Error("User does not have a wallet address")
  }

  // Create transaction record
  const transaction = await TokenTransaction.create({
    user: userId,
    type: TransactionType.REWARD,
    amount,
    metadata,
  })

  try {
    // Get contract kit
    const kit = getContractKit()

    // Get token contract instance
    const tokenContract = new RewardTokenContract(kit)

    // Call contract method to distribute rewards
    const txHash = await tokenContract.distributeRewards(user.role, amount.toString(), metadata)

    // Update transaction with hash and status
    transaction.txHash = txHash
    transaction.status = "completed"
    await transaction.save()

    return txHash
  } catch (error) {
    // Update transaction status to failed
    transaction.status = "failed"
    await transaction.save()

    throw error
  }
}

// Get token balance for a wallet address
export const getTokenBalance = async (walletAddress: string): Promise<string> => {
  try {
    // Get contract kit
    const kit = getContractKit()

    // Get token contract instance
    const tokenContract = new RewardTokenContract(kit)

    // Call contract method to get balance
    const balance = await tokenContract.balanceOf(walletAddress)

    return balance
  } catch (error) {
    throw error
  }
}
