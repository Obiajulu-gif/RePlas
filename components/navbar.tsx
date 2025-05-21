"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SafeImage } from "@/components/ui/safe-image"
import { ModeToggle } from "@/components/mode-toggle"
import { useWallet } from "@/components/wallet-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Recycle,
  BarChart3,
  Search,
  ShoppingBag,
  Menu,
  Users,
  BookOpen,
  MapPin,
  Award,
  User,
  ChevronDown,
  Wallet,
  Loader2,
} from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { isConnected, isConnecting, connect, disconnect, address } = useWallet()

  const isActive = (path) => {
    return pathname === path
  }

  const routes = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
    },
    {
      name: "Scan",
      path: "/scan",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
    {
      name: "Marketplace",
      path: "/marketplace",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
    },
    {
      name: "Explorer",
      path: "/explorer",
      icon: <Recycle className="h-4 w-4 mr-2" />,
    },
  ]

  const communityRoutes = [
    {
      name: "Batch Tracking",
      path: "/batch-tracking",
      icon: <Recycle className="h-4 w-4 mr-2" />,
    },
    {
      name: "Recycling Centers",
      path: "/recycling-centers",
      icon: <MapPin className="h-4 w-4 mr-2" />,
    },
    {
      name: "Leaderboard",
      path: "/leaderboard",
      icon: <Award className="h-4 w-4 mr-2" />,
    },
    {
      name: "Community",
      path: "/community",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: "Learn",
      path: "/learn",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
  ]

  const handleWalletAction = async () => {
    if (isConnected) {
      disconnect()
    } else {
      await connect()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <SafeImage
              src="/logo.png"
              alt="RePlas Logo"
              width={32}
              height={32}
              className="h-8 w-8"
              fallbackSrc="/abstract-logo.png"
            />
            <span className="font-bold text-emerald-600 dark:text-emerald-400">RePlas</span>
          </Link>
        </div>
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:space-x-4">
          <nav className="flex items-center space-x-2">
            {routes.map((route) => (
              <Button
                key={route.path}
                asChild
                variant={isActive(route.path) ? "default" : "ghost"}
                size="sm"
                className={`h-9 ${isActive(route.path) ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
              >
                <Link href={route.path} className="flex items-center">
                  {route.icon}
                  {route.name}
                </Link>
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9">
                  Community
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {communityRoutes.map((route) => (
                  <DropdownMenuItem key={route.path} asChild>
                    <Link href={route.path} className="flex items-center">
                      {route.icon}
                      {route.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleWalletAction}
              variant="outline"
              size="sm"
              className={`h-9 ${isConnected ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400" : "border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400"}`}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "Connected"}
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            onClick={handleWalletAction}
            variant="outline"
            size="sm"
            className={`mr-2 ${isConnected ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"}`}
            disabled={isConnecting}
          >
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            <span className="sr-only">{isConnected ? "Disconnect Wallet" : "Connect Wallet"}</span>
          </Button>
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex items-center mb-6 mt-2">
                <SafeImage
                  src="/logo.png"
                  alt="RePlas Logo"
                  width={64}
                  height={64}
                  className="h-8 w-8 mr-2"
                  fallbackSrc="/abstract-logo.png"
                />
                <span className="font-bold text-emerald-600 dark:text-emerald-400">RePlas</span>
              </div>
              <nav className="grid gap-2 py-4">
                {routes.map((route) => (
                  <Button
                    key={route.path}
                    asChild
                    variant={isActive(route.path) ? "default" : "ghost"}
                    className={`justify-start ${isActive(route.path) ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={route.path} className="flex items-center">
                      {route.icon}
                      {route.name}
                    </Link>
                  </Button>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2 px-4">Community</h4>
                  {communityRoutes.map((route) => (
                    <Button
                      key={route.path}
                      asChild
                      variant={isActive(route.path) ? "default" : "ghost"}
                      className={`justify-start ${isActive(route.path) ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={route.path} className="flex items-center">
                        {route.icon}
                        {route.name}
                      </Link>
                    </Button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button asChild variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                    <Link href="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    onClick={() => {
                      handleWalletAction()
                      setIsOpen(false)
                    }}
                    variant="outline"
                    className={`w-full mt-2 justify-start ${isConnected ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"}`}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : isConnected ? (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Disconnect Wallet
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar
