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

// Transfer tokens between wallets
export const transferTokens = async (
  fromUserId: string,
  toAddress: string,
  amount: number,
  metadata: string,
): Promise<string> => {
  // Find sender user
  const user = await User.findById(fromUserId)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  if (!user.walletAddress) {
    throw new Error("User does not have a wallet address")
  }

  // Create transaction record
  const transaction = await TokenTransaction.create({
    user: fromUserId,
    type: TransactionType.TRANSFER,
    amount,
    metadata,
  })

  try {
    // Get contract kit
    const kit = getContractKit()

    // Add account to wallet
    const account = kit.web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY || "")
    kit.addAccount(account.privateKey)

    // Set default account
    kit.defaultAccount = account.address

    // Get token contract
    const tokenContract = await kit.contracts.getGoldToken()

    // Send transaction
    const tx = await tokenContract.transfer(toAddress, amount.toString()).send({
      from: account.address,
      gasPrice: kit.web3.utils.toWei("0.5", "gwei"),
    })

    // Wait for receipt
    const receipt = await tx.waitReceipt()

    // Update transaction with hash and status
    transaction.txHash = receipt.transactionHash
    transaction.status = "completed"
    await transaction.save()

    return receipt.transactionHash
  } catch (error) {
    // Update transaction status to failed
    transaction.status = "failed"
    await transaction.save()

    console.error("Transfer error:", error)
    throw error
  }
}

// Get reward rate for a specific plastic type
export const getRewardRate = (plasticType: string): number => {
  // Reward rates per kg
  const rewardRates: Record<string, number> = {
    PET: 10,
    HDPE: 8,
    PVC: 4,
    LDPE: 6,
    PP: 7,
    PS: 5,
    OTHER: 3,
  }

  return rewardRates[plasticType] || rewardRates["OTHER"]
}

// Calculate reward amount based on plastic type and weight
export const calculateReward = (plasticType: string, weight: number): number => {
  const rate = getRewardRate(plasticType)
  return Math.round(weight * rate * 100) / 100
}
