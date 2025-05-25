import { type ContractKit, newKitFromWeb3 } from "@celo/contractkit"
import Web3 from "web3"
import { config } from "dotenv"

config()

let kit: ContractKit | null = null

// Initialize ContractKit with provider
export const getContractKit = (): ContractKit => {
  if (kit) {
    return kit
  }

  // Get provider URL from environment variables
  const providerUrl = process.env.CELO_PROVIDER_URL || "https://alfajores-forno.celo-testnet.org"

  // Create Web3 instance
  const web3 = new Web3(providerUrl)

  // Create ContractKit instance
  kit = newKitFromWeb3(web3)

  // Add admin account if private key is available
  const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY
  if (adminPrivateKey) {
    kit.addAccount(adminPrivateKey)
  }

  return kit
}

// Get network ID
export const getNetworkId = async (): Promise<number> => {
  const kit = getContractKit()
  return kit.web3.eth.net.getId()
}

// Get gas price
export const getGasPrice = async (): Promise<string> => {
  const kit = getContractKit()
  return kit.web3.eth.getGasPrice()
}

// Check if address is valid
export const isValidAddress = (address: string): boolean => {
  const kit = getContractKit()
  return kit.web3.utils.isAddress(address)
}
