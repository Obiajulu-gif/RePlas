import type { ContractKit } from "@celo/contractkit"
import type { AbiItem } from "web3-utils"

// ABI for the RePlasCeloToken contract
const tokenAbi: AbiItem[] = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "role",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadata",
        type: "string",
      },
    ],
    name: "RewardDistributed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "role",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
    ],
    name: "distributeRewards",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export class RewardTokenContract {
  private kit: ContractKit
  private contractAddress: string

  constructor(kit: ContractKit) {
    this.kit = kit
    this.contractAddress = process.env.TOKEN_CONTRACT_ADDRESS || ""

    if (!this.contractAddress) {
      throw new Error("Token contract address not configured")
    }
  }

  /**
   * Distributes rewards to a user
   * @param role User role
   * @param amount Amount to distribute
   * @param metadata Additional information
   * @returns Transaction hash
   */
  async distributeRewards(role: string, amount: string, metadata: string): Promise<string> {
    try {
      const contract = new this.kit.web3.eth.Contract(tokenAbi, this.contractAddress)

      // Get user address from private key
      const accounts = await this.kit.web3.eth.getAccounts()
      const from = accounts[0]

      if (!from) {
        throw new Error("No account available for transaction")
      }

      // Find user wallet address from database
      // In a real implementation, we would look up the user's wallet address
      const to = "0x1234567890123456789012345678901234567890" // Placeholder

      // Call contract method
      const tx = await contract.methods.distributeRewards(to, role, amount, metadata).send({ from })

      return tx.transactionHash
    } catch (error) {
      console.error("Error distributing rewards:", error)
      throw error
    }
  }

  /**
   * Gets token balance for an address
   * @param address Wallet address
   * @returns Token balance
   */
  async balanceOf(address: string): Promise<string> {
    try {
      const contract = new this.kit.web3.eth.Contract(tokenAbi, this.contractAddress)

      // Call contract method
      const balance = await contract.methods.balanceOf(address).call()

      return balance
    } catch (error) {
      console.error("Error getting token balance:", error)
      throw error
    }
  }
}
