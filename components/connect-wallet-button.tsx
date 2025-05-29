"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWallet } from "./wallet-provider"
import { Loader2, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { WalletQRModal } from "./wallet-qr-modal"

export function ConnectWalletButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<"valora" | "celowallet" | null>(null)
  const isMobile = /Android|iPhone/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '')
  const { 
    address, 
    isConnected, 
    isConnecting, 
    walletType, 
    connect, 
    disconnect 
  } = useWallet()

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Handle wallet connection
  const { toast } = useToast()

  const handleConnect = async (type: "metamask" | "valora" | "celowallet") => {
    try {
      setIsOpen(false)

      // Handle mobile wallet connections
      if ((type === "valora" || type === "celowallet")) {
        if (isMobile) {
          const walletUrl = type === "valora"
            ? `celo://wallet/connect?uri=${window.location.href}`
            : `celowallet://connect?uri=${window.location.href}`;
          window.location.href = walletUrl;
        } else {
          setSelectedWallet(type);
          setQrModalOpen(true);
        }
        return;
      }

      await connect(type)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const handleQrModalClose = () => {
    setQrModalOpen(false)
    setSelectedWallet(null)
  }

  // Handle wallet disconnection
  const handleDisconnect = () => {
    setIsOpen(false)
    disconnect()
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {isConnected && address ? (
            <Button
              variant="outline"
              className={cn(
                "h-9",
                walletType === "metamask" && "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
                walletType === "valora" && "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
                walletType === "celowallet" && "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              {walletType === "metamask" && "🦊 "}
              {walletType === "valora" && "💎 "}
              {walletType === "celowallet" && "🌟 "}
              {shortenAddress(address)}
            </Button>
          ) : (
            <Button disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {isConnected ? (
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem 
                onClick={() => handleConnect("metamask")}
                className="flex items-center"
              >
                🦊 MetaMask
                <span className="ml-auto text-xs text-muted-foreground">Desktop</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleConnect("valora")}
                className="flex items-center"
              >
                💎 Valora
                <span className="ml-auto text-xs text-muted-foreground">Mobile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleConnect("celowallet")}
                className="flex items-center"
              >
                🌟 Celo Wallet
                <span className="ml-auto text-xs text-muted-foreground">Desktop</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedWallet && (
        <WalletQRModal
          isOpen={qrModalOpen}
          onClose={handleQrModalClose}
          walletType={selectedWallet}
        />
      )}
    </>
  )
  
}
