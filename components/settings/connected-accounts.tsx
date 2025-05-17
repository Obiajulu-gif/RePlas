"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, Check, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ConnectedAccounts() {
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState({
    wallet: true,
    google: true,
    twitter: false,
    github: false,
    facebook: false,
  })

  function connectAccount(account: string) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setAccounts((prev) => ({ ...prev, [account]: true }))
      toast({
        title: "Account connected",
        description: `Your ${account} account has been connected successfully.`,
      })
    }, 1000)
  }

  function disconnectAccount(account: string) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setAccounts((prev) => ({ ...prev, [account]: false }))
      toast({
        title: "Account disconnected",
        description: `Your ${account} account has been disconnected.`,
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Connect your accounts to enable single sign-on and additional features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Blockchain Wallet</h3>
                <p className="text-sm text-muted-foreground">Connect your blockchain wallet for token transactions.</p>
              </div>
            </div>
            <div className="flex items-center">
              {accounts.wallet ? (
                <>
                  <span className="text-sm text-green-600 font-medium flex items-center mr-4">
                    <Check className="h-4 w-4 mr-1" /> Connected
                  </span>
                  <Button variant="outline" size="sm" onClick={() => disconnectAccount("wallet")} disabled={isLoading}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={() => connectAccount("wallet")} disabled={isLoading}>
                  Connect
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Twitter</h3>
                <p className="text-sm text-muted-foreground">Share your recycling achievements on Twitter.</p>
              </div>
            </div>
            <div className="flex items-center">
              {accounts.twitter ? (
                <>
                  <span className="text-sm text-green-600 font-medium flex items-center mr-4">
                    <Check className="h-4 w-4 mr-1" /> Connected
                  </span>
                  <Button variant="outline" size="sm" onClick={() => disconnectAccount("twitter")} disabled={isLoading}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={() => connectAccount("twitter")} disabled={isLoading}>
                  Connect
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-600"
                >
                  <path d="M12 19c.828 0 1.5-.672 1.5-1.5S12.828 16 12 16s-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"></path>
                  <path d="M5 7h14c1.103 0 2 .897 2 2v9c0 1.103-.897 2-2 2H5c-1.103 0-2-.897-2-2V9c0-1.103.897-2 2-2z"></path>
                  <path d="M3.5 7l8.5-4 8.5 4"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Google</h3>
                <p className="text-sm text-muted-foreground">
                  Use your Google account for login and calendar integration.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {accounts.google ? (
                <>
                  <span className="text-sm text-green-600 font-medium flex items-center mr-4">
                    <Check className="h-4 w-4 mr-1" /> Connected
                  </span>
                  <Button variant="outline" size="sm" onClick={() => disconnectAccount("google")} disabled={isLoading}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={() => connectAccount("google")} disabled={isLoading}>
                  Connect
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">GitHub</h3>
                <p className="text-sm text-muted-foreground">Connect to GitHub for open-source contributions.</p>
              </div>
            </div>
            <div className="flex items-center">
              {accounts.github ? (
                <>
                  <span className="text-sm text-green-600 font-medium flex items-center mr-4">
                    <Check className="h-4 w-4 mr-1" /> Connected
                  </span>
                  <Button variant="outline" size="sm" onClick={() => disconnectAccount("github")} disabled={isLoading}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={() => connectAccount("github")} disabled={isLoading}>
                  Connect
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Facebook</h3>
                <p className="text-sm text-muted-foreground">Share your recycling journey on Facebook.</p>
              </div>
            </div>
            <div className="flex items-center">
              {accounts.facebook ? (
                <>
                  <span className="text-sm text-green-600 font-medium flex items-center mr-4">
                    <Check className="h-4 w-4 mr-1" /> Connected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectAccount("facebook")}
                    disabled={isLoading}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={() => connectAccount("facebook")} disabled={isLoading}>
                  Connect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>Manage API keys and access for developers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Developer Feature</AlertTitle>
            <AlertDescription>
              API access is intended for developers who want to build applications on top of our platform.
            </AlertDescription>
          </Alert>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">API Documentation</h3>
              <p className="text-sm text-muted-foreground">View our API documentation to get started.</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              View Docs <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Generate API Key</h3>
              <p className="text-sm text-muted-foreground">Create a new API key for your application.</p>
            </div>
            <Button size="sm">Generate Key</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
