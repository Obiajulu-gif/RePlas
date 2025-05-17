"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-background border rounded-lg shadow-sm p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              We encountered an error while loading this page. This could be due to a temporary issue.
            </p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-6 text-left">
                <details className="bg-muted p-4 rounded-md">
                  <summary className="font-medium cursor-pointer">Error Details</summary>
                  <pre className="mt-2 text-xs overflow-auto p-2 bg-background rounded">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
