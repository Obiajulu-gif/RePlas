"use client"

import { useEffect } from "react"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/components/ui/use-toast"

export function useWalletErrorHandler() {
  const { isConnected, chainId, switchNetwork } = useWallet()
  const { toast } = useToast()

  useEffect(() => {
    if (!isConnected) return

    // Handle wrong network
    if (chainId && chainId !== 42220 && chainId !== 44787) {
      toast({
        title: "Wrong Network",
        description: "Please switch to the Celo network to continue",
        variant: "destructive",
        action: {
          label: "Switch Network",
          onClick: switchNetwork,
          className: "px-3 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        },
      })
    }

    // Handle network change errors
    const handleNetworkError = (error: Event) => {
      console.error("Network error:", error)
      toast({
        title: "Network Error",
        description: "There was an error connecting to the network. Please check your internet connection and try again.",
        variant: "destructive",
      })
    }

    // Handle wallet disconnect
    const handleDisconnect = (error: { code: number; message: string }) => {
      if (error.code === 4001) {
        toast({
          title: "Wallet Disconnected",
          description: "You've disconnected your wallet",
        })
      } else {
        toast({
          title: "Connection Error",
          description: "Lost connection to your wallet. Please try reconnecting.",
          variant: "destructive",
        })
      }
    }

    // Handle account change
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        toast({
          title: "Wallet Disconnected",
          description: "Please reconnect your wallet to continue",
        })
      } else {
        toast({
          title: "Account Changed",
          description: "Your connected wallet account has changed",
        })
      }
    }

    // Add event listeners
    if (typeof window !== "undefined") {
      window.addEventListener("offline", handleNetworkError)
      if (window.ethereum) {
        window.ethereum.on("disconnect", handleDisconnect)
        window.ethereum.on("accountsChanged", handleAccountsChanged)
      }
    }

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("offline", handleNetworkError)
        if (window.ethereum) {
          window.ethereum.removeListener("disconnect", handleDisconnect)
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        }
      }
    }
  }, [isConnected, chainId, switchNetwork, toast])
}
