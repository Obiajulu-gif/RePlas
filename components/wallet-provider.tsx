"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

type WalletContextType = {
  address: string | null
  balance: string
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  balance: "0",
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // In a real implementation, we would check if the user has a Celo wallet connected
        const savedAddress = localStorage.getItem("walletAddress")
        if (savedAddress) {
          setAddress(savedAddress)
          setBalance("320") // Mock balance
          setIsConnected(true)
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error)
      }
    }

    checkConnection()
  }, [])

  const connect = async () => {
    try {
      setIsConnecting(true)

      // Mock wallet connection
      // In a real implementation, we would use ContractKit or another Celo wallet connector
      setTimeout(() => {
        const mockAddress = "0x1234...5678"
        setAddress(mockAddress)
        setBalance("320")
        setIsConnected(true)
        localStorage.setItem("walletAddress", mockAddress)

        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Celo wallet",
        })

        setIsConnecting(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Could not connect to Celo wallet",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setBalance("0")
    setIsConnected(false)
    localStorage.removeItem("walletAddress")

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
        isConnected,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
