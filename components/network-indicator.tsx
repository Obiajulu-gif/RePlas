"use client"

import { useWallet } from "./wallet-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export function NetworkIndicator() {
  const { chainId, switchNetwork } = useWallet()
  const [isSwitching, setIsSwitching] = useState(false)

  const getNetworkInfo = () => {
    switch (chainId) {
      case 42220:
        return {
          name: "Celo",
          color: "bg-green-500",
          textColor: "text-green-500",
          icon: "🌟",
        }
      case 44787:
        return {
          name: "Alfajores",
          color: "bg-blue-500",
          textColor: "text-blue-500",
          icon: "🔧",
        }
      default:
        return {
          name: "Wrong Network",
          color: "bg-red-500",
          textColor: "text-red-500",
          icon: "⚠️",
        }
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      setIsSwitching(true)
      await switchNetwork()
    } catch (error) {
      console.error("Failed to switch network:", error)
    } finally {
      setIsSwitching(false)
    }
  }

  const networkInfo = getNetworkInfo()

  if (!chainId) return null

  if (chainId !== 42220 && chainId !== 44787) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleSwitchNetwork}
        disabled={isSwitching}
        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
      >
        {isSwitching ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Switching...
          </>
        ) : (
          <>
            ⚠️ Switch to Celo
          </>
        )}
      </Button>
    )
  }

  return (
    <Badge
      variant="outline"
      className={`border-${networkInfo.color} ${networkInfo.textColor}`}
    >
      {networkInfo.icon} {networkInfo.name}
    </Badge>
  )
}
