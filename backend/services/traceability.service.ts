import { getContractKit } from "../config/blockchain"
import { TraceabilityContract } from "../contracts/traceability"

/**
 * Logs a plastic batch on the blockchain
 * @param batchId Batch ID
 * @param weight Weight in grams
 * @param type Type of plastic
 * @param producerId Producer ID
 * @returns Transaction hash
 */
export const logPlasticBatch = async (
  batchId: string,
  weight: string,
  type: string,
  producerId: string,
): Promise<string> => {
  try {
    // Get contract kit
    const kit = getContractKit()

    // Get traceability contract instance
    const traceabilityContract = new TraceabilityContract(kit)

    // Call contract method
    const txHash = await traceabilityContract.logPlasticBatch(batchId, weight, type, producerId)

    return txHash
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
export const linkConsumerToBatch = async (batchId: string, consumerId: string): Promise<string> => {
  try {
    // Get contract kit
    const kit = getContractKit()

    // Get traceability contract instance
    const traceabilityContract = new TraceabilityContract(kit)

    // Call contract method
    const txHash = await traceabilityContract.linkConsumerToBatch(batchId, consumerId)

    return txHash
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
export const getBatchInfo = async (batchId: string): Promise<any> => {
  try {
    // Get contract kit
    const kit = getContractKit()

    // Get traceability contract instance
    const traceabilityContract = new TraceabilityContract(kit)

    // Call contract method
    const batchInfo = await traceabilityContract.getBatchInfo(batchId)

    return batchInfo
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
export const updateBatchStatus = async (batchId: string, status: string): Promise<string> => {
  try {
    // Get contract kit
    const kit = getContractKit()

    // Get traceability contract instance
    const traceabilityContract = new TraceabilityContract(kit)

    // Call contract method
    const txHash = await traceabilityContract.updateBatchStatus(batchId, status)

    return txHash
  } catch (error) {
    console.error("Error updating batch status:", error)
    throw error
  }
}
