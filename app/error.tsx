"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center p-4">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="text-3xl font-bold tracking-tighter">Something went wrong</h1>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. The application encountered an error.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" className="gap-1">
              <Home className="h-4 w-4" />
              Return home
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 rounded-lg bg-muted p-4 text-left">
            <details>
              <summary className="cursor-pointer font-medium">Error details</summary>
              <p className="mt-2 break-words text-sm text-muted-foreground">{error.message}</p>
              <pre className="mt-2 max-h-96 overflow-auto rounded bg-background p-2 text-xs">
                {error.stack || "No stack trace available"}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
