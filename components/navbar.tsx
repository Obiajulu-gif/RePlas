"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { useWallet } from "@/components/wallet-provider"
import {
  Wallet,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Menu,
  Home,
  QrCode,
  ShoppingBag,
  BarChart3,
  Upload,
  MessageSquare,
  Award,
  Users,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Navbar() {
  const { address, balance, isConnected, isConnecting, connect, disconnect } = useWallet()
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  const mainNavItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Scan & Ask",
      href: "/scan",
      icon: QrCode,
    },
    {
      title: "Marketplace",
      href: "/marketplace",
      icon: ShoppingBag,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Submit Plastic",
      href: "/submit",
      icon: Upload,
    },
  ]

  const communityNavItems = [
    {
      title: "Chat Assistant",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      title: "Leaderboard",
      href: "/leaderboard",
      icon: Award,
    },
    {
      title: "Community",
      href: "/community",
      icon: Users,
    },
  ]

  return (
    <ErrorBoundary>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <span className="text-xl font-bold">RePlas</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>{item.title}</span>
              </Link>
            ))}

            {isConnected && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 px-2">
                    <Users className="h-4 w-4" />
                    <span>Community</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {communityNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />

            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-300"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="hidden md:inline-block">{balance} RPL</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>Wallet</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">{address}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnect} className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={connect}
                disabled={isConnecting}
                className="animate-in fade-in slide-in-from-right-5 duration-300"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">RePlas</span>
                    </div>
                  </div>

                  <nav className="flex-1 overflow-auto py-6">
                    <div className="space-y-1">
                      <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2">Main Navigation</h3>
                      {mainNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>

                    {isConnected && (
                      <div className="mt-6 space-y-1">
                        <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2">Community</h3>
                        {communityNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </nav>

                  <div className="border-t py-4">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>

                    {isConnected && (
                      <button
                        onClick={disconnect}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Disconnect</span>
                      </button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </ErrorBoundary>
  )
}
