"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function AppearanceSettings() {
  const [isLoading, setIsLoading] = useState(false)

  function saveAppearanceSettings() {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Appearance settings updated",
        description: "Your appearance preferences have been saved.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred color theme for the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup defaultValue="system" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-3 rounded-md border border-border p-1 shadow-sm">
                  <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                    <div className="h-2 w-[80px] rounded-lg bg-[#d1d5db]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#d1d5db]" />
                  </div>
                </div>
                <span>Light</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-3 rounded-md border border-border p-1 shadow-sm">
                  <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                    <div className="h-2 w-[80px] rounded-lg bg-slate-800" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-800" />
                  </div>
                </div>
                <span>Dark</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-3 rounded-md border border-border p-1 shadow-sm">
                  <div className="flex flex-row space-x-1">
                    <div className="w-1/2 space-y-2 rounded-sm bg-[#ecedef] p-2">
                      <div className="h-2 w-[40px] rounded-lg bg-[#d1d5db]" />
                      <div className="h-2 w-[40px] rounded-lg bg-[#d1d5db]" />
                    </div>
                    <div className="w-1/2 space-y-2 rounded-sm bg-slate-950 p-2">
                      <div className="h-2 w-[40px] rounded-lg bg-slate-800" />
                      <div className="h-2 w-[40px] rounded-lg bg-slate-800" />
                    </div>
                  </div>
                </div>
                <span>System</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accent Color</CardTitle>
          <CardDescription>Choose the accent color for buttons, links, and highlights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup defaultValue="green" className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div>
              <RadioGroupItem value="green" id="color-green" className="peer sr-only" />
              <Label
                htmlFor="color-green"
                className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-green-600 text-white hover:bg-green-500 peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-black"
              >
                Green
              </Label>
            </div>
            <div>
              <RadioGroupItem value="blue" id="color-blue" className="peer sr-only" />
              <Label
                htmlFor="color-blue"
                className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-blue-600 text-white hover:bg-blue-500 peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-black"
              >
                Blue
              </Label>
            </div>
            <div>
              <RadioGroupItem value="purple" id="color-purple" className="peer sr-only" />
              <Label
                htmlFor="color-purple"
                className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-purple-600 text-white hover:bg-purple-500 peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-black"
              >
                Purple
              </Label>
            </div>
            <div>
              <RadioGroupItem value="orange" id="color-orange" className="peer sr-only" />
              <Label
                htmlFor="color-orange"
                className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-orange-600 text-white hover:bg-orange-500 peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-black"
              >
                Orange
              </Label>
            </div>
            <div>
              <RadioGroupItem value="pink" id="color-pink" className="peer sr-only" />
              <Label
                htmlFor="color-pink"
                className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-pink-600 text-white hover:bg-pink-500 peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-black"
              >
                Pink
              </Label>
            </div>
            <div>
              <RadioGroupItem value="red" id="color-red" className="peer sr-only" />
              <Label
                htmlFor="color-red"
                className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-red-600 text-white hover:bg-red-500 peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-black"
              >
                Red
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
          <CardDescription>Customize how content is displayed in the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="animations" className="flex flex-col space-y-1">
              <span>Animations</span>
              <span className="font-normal text-sm text-muted-foreground">
                Enable animations and transitions throughout the app.
              </span>
            </Label>
            <Switch id="animations" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion" className="flex flex-col space-y-1">
              <span>Reduced Motion</span>
              <span className="font-normal text-sm text-muted-foreground">
                Minimize animations for accessibility purposes.
              </span>
            </Label>
            <Switch id="reduced-motion" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="x-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="density">Interface Density</Label>
            <Select defaultValue="comfortable">
              <SelectTrigger id="density">
                <SelectValue placeholder="Select density" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={saveAppearanceSettings} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save appearance settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
