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

      // Get admin account from private key
      const privateKey = process.env.ADMIN_PRIVATE_KEY
      if (!privateKey) {
        throw new Error("Admin private key not configured")
      }

      const account = this.kit.web3.eth.accounts.privateKeyToAccount(privateKey)
      this.kit.addAccount(account.privateKey)

      // Set default account
      this.kit.defaultAccount = account.address

      // Find user wallet address from database
      // In a real implementation, we would look up the user's wallet address
      const to = process.env.RECIPIENT_ADDRESS || "0x1234567890123456789012345678901234567890"

      // Call contract method
      const tx = await contract.methods.distributeRewards(to, role, amount, metadata).send({
        from: account.address,
        gasPrice: this.kit.web3.utils.toWei("0.5", "gwei"),
      })

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

  /**
   * Transfer tokens between addresses
   * @param from Sender address
   * @param to Recipient address
   * @param amount Amount to transfer
   * @returns Transaction hash
   */
  async transfer(from: string, to: string, amount: string): Promise<string> {
    try {
      const contract = new this.kit.web3.eth.Contract(tokenAbi, this.contractAddress)

      // Get admin account
      const privateKey = process.env.ADMIN_PRIVATE_KEY
      if (!privateKey) {
        throw new Error("Admin private key not configured")
      }

      const account = this.kit.web3.eth.accounts.privateKeyToAccount(privateKey)
      this.kit.addAccount(account.privateKey)

      // Set default account
      this.kit.defaultAccount = account.address

      // Call transfer method
      const tx = await contract.methods.transfer(to, amount).send({
        from: account.address,
        gasPrice: this.kit.web3.utils.toWei("0.5", "gwei"),
      })

      return tx.transactionHash
    } catch (error) {
      console.error("Error transferring tokens:", error)
      throw error
    }
  }
}
