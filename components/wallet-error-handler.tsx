"use client"

import { useWalletErrorHandler } from "@/hooks/use-wallet-error-handler"

export function WalletErrorHandler() {
  // The hook handles everything, we just need to use it
  useWalletErrorHandler()
  return null
}
