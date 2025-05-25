"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState({
    recyclingUpdates: true,
    achievementUnlocks: true,
    communityActivity: false,
    marketplaceUpdates: true,
    systemAnnouncements: true,
  })

  const [pushNotifications, setPushNotifications] = useState({
    recyclingUpdates: true,
    achievementUnlocks: true,
    communityActivity: true,
    marketplaceUpdates: false,
    systemAnnouncements: true,
  })

  function saveNotificationSettings() {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      })
      console.log({ emailNotifications, pushNotifications })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose what types of email notifications you want to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-recycling" className="flex flex-col space-y-1">
              <span>Recycling Updates</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive updates about your recycling submissions and verifications.
              </span>
            </Label>
            <Switch
              id="email-recycling"
              checked={emailNotifications.recyclingUpdates}
              onCheckedChange={(checked) => setEmailNotifications((prev) => ({ ...prev, recyclingUpdates: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-achievements" className="flex flex-col space-y-1">
              <span>Achievement Unlocks</span>
              <span className="font-normal text-sm text-muted-foreground">
                Get notified when you earn new badges or achievements.
              </span>
            </Label>
            <Switch
              id="email-achievements"
              checked={emailNotifications.achievementUnlocks}
              onCheckedChange={(checked) => setEmailNotifications((prev) => ({ ...prev, achievementUnlocks: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-community" className="flex flex-col space-y-1">
              <span>Community Activity</span>
              <span className="font-normal text-sm text-muted-foreground">
                Notifications about replies to your posts, mentions, and forum activity.
              </span>
            </Label>
            <Switch
              id="email-community"
              checked={emailNotifications.communityActivity}
              onCheckedChange={(checked) => setEmailNotifications((prev) => ({ ...prev, communityActivity: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-marketplace" className="flex flex-col space-y-1">
              <span>Marketplace Updates</span>
              <span className="font-normal text-sm text-muted-foreground">
                Get notified about new products, discounts, and token rewards.
              </span>
            </Label>
            <Switch
              id="email-marketplace"
              checked={emailNotifications.marketplaceUpdates}
              onCheckedChange={(checked) => setEmailNotifications((prev) => ({ ...prev, marketplaceUpdates: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-system" className="flex flex-col space-y-1">
              <span>System Announcements</span>
              <span className="font-normal text-sm text-muted-foreground">
                Important updates about the platform, new features, and policy changes.
              </span>
            </Label>
            <Switch
              id="email-system"
              checked={emailNotifications.systemAnnouncements}
              onCheckedChange={(checked) =>
                setEmailNotifications((prev) => ({ ...prev, systemAnnouncements: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Configure push notifications for the mobile app and browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-recycling" className="flex flex-col space-y-1">
              <span>Recycling Updates</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive real-time updates about your recycling submissions.
              </span>
            </Label>
            <Switch
              id="push-recycling"
              checked={pushNotifications.recyclingUpdates}
              onCheckedChange={(checked) => setPushNotifications((prev) => ({ ...prev, recyclingUpdates: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-achievements" className="flex flex-col space-y-1">
              <span>Achievement Unlocks</span>
              <span className="font-normal text-sm text-muted-foreground">
                Get instant notifications when you earn new badges.
              </span>
            </Label>
            <Switch
              id="push-achievements"
              checked={pushNotifications.achievementUnlocks}
              onCheckedChange={(checked) => setPushNotifications((prev) => ({ ...prev, achievementUnlocks: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-community" className="flex flex-col space-y-1">
              <span>Community Activity</span>
              <span className="font-normal text-sm text-muted-foreground">
                Get notified about replies and mentions in real-time.
              </span>
            </Label>
            <Switch
              id="push-community"
              checked={pushNotifications.communityActivity}
              onCheckedChange={(checked) => setPushNotifications((prev) => ({ ...prev, communityActivity: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-marketplace" className="flex flex-col space-y-1">
              <span>Marketplace Updates</span>
              <span className="font-normal text-sm text-muted-foreground">
                Get alerts about new products and limited-time offers.
              </span>
            </Label>
            <Switch
              id="push-marketplace"
              checked={pushNotifications.marketplaceUpdates}
              onCheckedChange={(checked) => setPushNotifications((prev) => ({ ...prev, marketplaceUpdates: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-system" className="flex flex-col space-y-1">
              <span>System Announcements</span>
              <span className="font-normal text-sm text-muted-foreground">
                Important platform updates and announcements.
              </span>
            </Label>
            <Switch
              id="push-system"
              checked={pushNotifications.systemAnnouncements}
              onCheckedChange={(checked) => setPushNotifications((prev) => ({ ...prev, systemAnnouncements: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
          <CardDescription>Control how often you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-frequency">Email Digest Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="email-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time - As they happen</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiet-hours">Quiet Hours</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quiet-start" className="text-sm font-normal text-muted-foreground">
                  Start Time
                </Label>
                <Select defaultValue="22:00">
                  <SelectTrigger id="quiet-start">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                    <SelectItem value="22:00">10:00 PM</SelectItem>
                    <SelectItem value="23:00">11:00 PM</SelectItem>
                    <SelectItem value="00:00">12:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quiet-end" className="text-sm font-normal text-muted-foreground">
                  End Time
                </Label>
                <Select defaultValue="07:00">
                  <SelectTrigger id="quiet-end">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="05:00">5:00 AM</SelectItem>
                    <SelectItem value="06:00">6:00 AM</SelectItem>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={saveNotificationSettings} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save notification settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
