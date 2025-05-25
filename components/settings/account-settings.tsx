"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  function updateEmail() {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify this change.",
      })
    }, 1000)
  }

  function updatePassword() {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsChangingPassword(false)
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>Update your email address. You will need to verify any new email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-email">Current Email</Label>
            <Input id="current-email" value="alex.johnson@example.com" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">New Email</Label>
            <Input id="new-email" placeholder="Enter new email address" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={updateEmail} disabled={isLoading}>
            {isLoading ? "Sending verification..." : "Update email"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password. We recommend using a strong, unique password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isChangingPassword ? (
            <Button onClick={() => setIsChangingPassword(true)}>Change password</Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex gap-2">
                <Button onClick={updatePassword} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update password"}
                </Button>
                <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
          <CardDescription>Set your preferred language and regional settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select defaultValue="za">
              <SelectTrigger id="region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="za">South Africa</SelectItem>
                <SelectItem value="ng">Nigeria</SelectItem>
                <SelectItem value="ke">Kenya</SelectItem>
                <SelectItem value="gh">Ghana</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save regional settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>These actions are irreversible. Please proceed with caution.</AlertDescription>
          </Alert>
          <div className="space-y-4">
            <div>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Deactivate Account
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Temporarily disable your account. You can reactivate it later.
              </p>
            </div>
            <div>
              <Button variant="destructive">Delete Account</Button>
              <p className="text-sm text-muted-foreground mt-2">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
