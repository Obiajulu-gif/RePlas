"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
              <h1 className="text-3xl font-bold tracking-tighter">Application Error</h1>
              <p className="text-gray-500">
                We apologize for the inconvenience. The application encountered a critical error.
              </p>
            </div>

            <Button onClick={() => reset()} className="gap-1">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>

            <p className="text-sm text-gray-500">
              If the problem persists, please try refreshing the page or coming back later.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
