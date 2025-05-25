"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSettings from "@/components/settings/profile-settings"
import NotificationSettings from "@/components/settings/notification-settings"
import AccountSettings from "@/components/settings/account-settings"
import AppearanceSettings from "@/components/settings/appearance-settings"
import ConnectedAccounts from "@/components/settings/connected-accounts"

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="connected">Connected Accounts</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6 space-y-6">
        <ProfileSettings />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6 space-y-6">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="account" className="mt-6 space-y-6">
        <AccountSettings />
      </TabsContent>

      <TabsContent value="appearance" className="mt-6 space-y-6">
        <AppearanceSettings />
      </TabsContent>

      <TabsContent value="connected" className="mt-6 space-y-6">
        <ConnectedAccounts />
      </TabsContent>
    </Tabs>
  )
}
