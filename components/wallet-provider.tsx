"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { newKitFromWeb3 } from "@celo/contractkit"
import { ethers } from "ethers"

declare global {
  interface Window {
    ethereum?: any
    celo?: any
  }
}

type WalletType = "metamask" | "valora" | "celowallet"

type WalletContextType = {
  address: string | null
  balance: string
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  walletType: WalletType | null
  connect: (type: WalletType) => Promise<void>
  disconnect: () => void
  switchNetwork: () => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  balance: "0",
  chainId: null,
  isConnected: false,
  isConnecting: false,
  walletType: null,
  connect: async () => {},
  disconnect: () => {},
  switchNetwork: async () => {},
})

export const useWallet = () => useContext(WalletContext)

// Network configurations
const SUPPORTED_NETWORKS = {
  mainnet: {
    chainId: "0xa4ec",
    chainName: "Celo",
    nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://explorer.celo.org"],
  },
  testnet: {
    chainId: "0xaef3",
    chainName: "Alfajores Testnet",
    nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
    rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
    blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org"],
  },
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletType, setWalletType] = useState<WalletType | null>(null)
  const { toast } = useToast()

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const savedWalletType = localStorage.getItem("walletType") as WalletType
        if (savedWalletType) {
          const provider = await getProvider(savedWalletType)
          if (provider) {
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            const balance = await provider.getBalance(address)
            const network = await provider.getNetwork()
            
            setAddress(address)
            setBalance(ethers.utils.formatEther(balance))
            setChainId(network.chainId)
            setIsConnected(true)
            setWalletType(savedWalletType)
          }
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error)
      }
    }

    checkConnection()

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0])
        updateBalance(accounts[0])
      } else {
        disconnect()
      }
    }

    // Listen for network changes
    const handleChainChanged = (newChainId: string) => {
      setChainId(parseInt(newChainId))
      window.location.reload()
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  // Helper to get wallet provider
  const getProvider = async (type: WalletType) => {
    try {
      let provider
      
      switch (type) {
        case "metamask":
          if (!window.ethereum) {
            throw new Error("MetaMask is not installed")
          }
          provider = new ethers.providers.Web3Provider(window.ethereum)
          break
          
        case "valora":
          if (!window.celo) {
            throw new Error("Valora is not installed")
          }
          provider = new ethers.providers.Web3Provider(window.celo)
          break
          
        case "celowallet":
          const celoProvider = "https://forno.celo.org" // Use testnet URL for development
          provider = new ethers.providers.JsonRpcProvider(celoProvider)
          break
          
        default:
          throw new Error("Unsupported wallet type")
      }
      
      return provider
    } catch (error) {
      console.error("Failed to get provider:", error)
      return null
    }
  }

  // Helper to update balance
  const updateBalance = async (address: string) => {
    if (!walletType) return
    
    const provider = await getProvider(walletType)
    if (provider) {
      const balance = await provider.getBalance(address)
      setBalance(ethers.utils.formatEther(balance))
    }
  }

  // Connect wallet
  const connect = async (type: WalletType) => {
    try {
      setIsConnecting(true)

      const provider = await getProvider(type)
      if (!provider) {
        throw new Error("Failed to get provider")
      }

      // Request account access
      let accounts: string[]
      if (type === "metamask") {
        accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      } else if (type === "valora") {
        accounts = await window.celo.request({ method: "eth_requestAccounts" })
      } else {
        throw new Error("Unsupported wallet type")
      }

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const network = await provider.getNetwork()
      const balance = await provider.getBalance(accounts[0])

      setAddress(accounts[0])
      setBalance(ethers.utils.formatEther(balance))
      setChainId(network.chainId)
      setIsConnected(true)
      setWalletType(type)
      localStorage.setItem("walletType", type)

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${type}`,
      })
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Could not connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Switch network if not on Celo
  const switchNetwork = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [SUPPORTED_NETWORKS.testnet], // Use mainnet for production
      })
    } catch (error) {
      console.error("Failed to switch network:", error)
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to Celo network",
        variant: "destructive",
      })
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    setAddress(null)
    setBalance("0")
    setChainId(null)
    setIsConnected(false)
    setWalletType(null)
    localStorage.removeItem("walletType")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        chainId,
        isConnected,
        isConnecting,
        walletType,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
