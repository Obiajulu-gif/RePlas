import { type ContractKit, newKit } from "@celo/contractkit"
import { config } from "dotenv"

config()

let kit: ContractKit

export const setupCeloProvider = () => {
  try {
    const providerUrl = process.env.CELO_PROVIDER_URL || "https://alfajores-forno.celo-testnet.org"
    kit = newKit(providerUrl)

    // Set up account if private key is provided
    if (process.env.ADMIN_PRIVATE_KEY) {
      const account = kit.web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY)
      kit.addAccount(account.privateKey)
      kit.defaultAccount = account.address
      console.log("Celo account configured:", account.address)
    }

    console.log("Connected to Celo blockchain")
    return kit
  } catch (error) {
    console.error("Celo provider setup error:", error)
    process.exit(1)
  }
}

export const getContractKit = (): ContractKit => {
  if (!kit) {
    setupCeloProvider()
  }
  return kit
}
