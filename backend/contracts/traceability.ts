import type { ContractKit } from "@celo/contractkit"
import type { AbiItem } from "web3-utils"

// ABI for the RePlasTraceability contract
const traceabilityAbi: AbiItem[] = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "batchId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "weight",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "plasticType",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "producer",
        type: "address",
      },
    ],
    name: "BatchLogged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "batchId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "status",
        type: "string",
      },
    ],
    name: "BatchStatusUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "batchId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "consumer",
        type: "address",
      },
    ],
    name: "ConsumerLinked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "batchId",
        type: "string",
      },
    ],
    name: "getBatchInfo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "batchId",
        type: "string",
      },
    ],
    name: "linkConsumerToBatch",
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
        internalType: "string",
        name: "batchId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "weight",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "plasticType",
        type: "string",
      },
    ],
    name: "logPlasticBatch",
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
        internalType: "string",
        name: "batchId",
        type: "string",
      },
      {
        internalType: "string",
        name: "status",
        type: "string",
      },
    ],
    name: "updateBatchStatus",
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
]

export class TraceabilityContract {
  private kit: ContractKit
  private contractAddress: string

  constructor(kit: ContractKit) {
    this.kit = kit
    this.contractAddress = process.env.TRACEABILITY_CONTRACT_ADDRESS || ""

    if (!this.contractAddress) {
      throw new Error("Traceability contract address not configured")
    }
  }

  /**
   * Logs a plastic batch on the blockchain
   * @param batchId Batch ID
   * @param weight Weight in grams
   * @param plasticType Type of plastic
   * @param producerId Producer ID
   * @returns Transaction hash
   */
  async logPlasticBatch(batchId: string, weight: string, plasticType: string, producerId: string): Promise<string> {
    try {
      const contract = new this.kit.web3.eth.Contract(traceabilityAbi, this.contractAddress)

      // Get user address from private key
      const accounts = await this.kit.web3.eth.getAccounts()
      const from = accounts[0]

      if (!from) {
        throw new Error("No account available for transaction")
      }

      // Call contract method
      const tx = await contract.methods.logPlasticBatch(batchId, weight, plasticType).send({ from })

      return tx.transactionHash
    } catch (error) {
      console.error("Error logging plastic batch:", error)
      throw error
    }
  }

  /**
   * Links a consumer to a batch
   * @param batchId Batch ID
   * @param consumerId Consumer ID
   * @returns Transaction hash
   */
  async linkConsumerToBatch(batchId: string, consumerId: string): Promise<string> {
    try {
      const contract = new this.kit.web3.eth.Contract(traceabilityAbi, this.contractAddress)

      // Get user address from private key
      const accounts = await this.kit.web3.eth.getAccounts()
      const from = accounts[0]

      if (!from) {
        throw new Error("No account available for transaction")
      }

      // Call contract method
      const tx = await contract.methods.linkConsumerToBatch(batchId).send({ from })

      return tx.transactionHash
    } catch (error) {
      console.error("Error linking consumer to batch:", error)
      throw error
    }
  }

  /**
   * Gets information about a batch
   * @param batchId Batch ID
   * @returns Batch information
   */
  async getBatchInfo(batchId: string): Promise<any> {
    try {
      const contract = new this.kit.web3.eth.Contract(traceabilityAbi, this.contractAddress)

      // Call contract method
      const result = await contract.methods.getBatchInfo(batchId).call()

      return {
        batchId: result[0],
        weight: result[1],
        plasticType: result[2],
        producer: result[3],
        timestamp: result[4],
        consumers: result[5],
        recyclers: result[6],
        status: result[7],
      }
    } catch (error) {
      console.error("Error getting batch info:", error)
      throw error
    }
  }

  /**
   * Updates the status of a batch
   * @param batchId Batch ID
   * @param status New status
   * @returns Transaction hash
   */
  async updateBatchStatus(batchId: string, status: string): Promise<string> {
    try {
      const contract = new this.kit.web3.eth.Contract(traceabilityAbi, this.contractAddress)

      // Get user address from private key
      const accounts = await this.kit.web3.eth.getAccounts()
      const from = accounts[0]

      if (!from) {
        throw new Error("No account available for transaction")
      }

      // Call contract method
      const tx = await contract.methods.updateBatchStatus(batchId, status).send({ from })

      return tx.transactionHash
    } catch (error) {
      console.error("Error updating batch status:", error)
      throw error
    }
  }
}
