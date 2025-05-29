"use client"

import { QRCodeSVG } from "qrcode.react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WalletQRModalProps {
  isOpen: boolean
  onClose: () => void
  walletType: "valora" | "celowallet"
}

export function WalletQRModal({ isOpen, onClose, walletType }: WalletQRModalProps) {
  const getWalletData = () => {
    const currentUrl = window.location.href
    if (walletType === "valora") {
      return {
        title: "Connect with Valora",
        description: "Scan with your Valora mobile wallet to connect",
        uri: `celo://wallet/connect?uri=${currentUrl}`,
      }
    }
    return {
      title: "Connect with Celo Wallet",
      description: "Scan with your Celo mobile wallet to connect",
      uri: `celowallet://connect?uri=${currentUrl}`,
    }
  }

  const { title, description, uri } = getWalletData()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG value={uri} size={256} includeMargin />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have {walletType === "valora" ? "Valora" : "Celo Wallet"}?
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.open(
                  walletType === "valora"
                    ? "https://valoraapp.com"
                    : "https://celowallet.app",
                  "_blank"
                )
              }}
            >
              Download {walletType === "valora" ? "Valora" : "Celo Wallet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
