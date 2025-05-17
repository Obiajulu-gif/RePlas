"use client"

import type React from "react"
import { useWallet } from "@/components/wallet-provider"
import { Home, QrCode, ShoppingBag, BarChart3, Upload, MessageSquare, Award, Users, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export default function AppSidebar() {
  const pathname = usePathname()
  const { isConnected } = useWallet()

  const consumerLinks = [
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

  const recyclerLinks = [
    {
      title: "Dashboard",
      href: "/recycler",
      icon: Home,
    },
    {
      title: "Collection Log",
      href: "/recycler/collections",
      icon: Upload,
    },
    {
      title: "Material Tracker",
      href: "/recycler/materials",
      icon: BarChart3,
    },
    {
      title: "Marketplace",
      href: "/marketplace",
      icon: ShoppingBag,
    },
  ]

  const producerLinks = [
    {
      title: "Dashboard",
      href: "/producer",
      icon: Home,
    },
    {
      title: "QR Generator",
      href: "/producer/qr-generator",
      icon: QrCode,
    },
    {
      title: "Batch Tracking",
      href: "/producer/batches",
      icon: BarChart3,
    },
    {
      title: "Marketplace",
      href: "/marketplace",
      icon: ShoppingBag,
    },
  ]

  // For demo purposes, we'll show consumer links
  const links = consumerLinks

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <Recycle className="h-6 w-6 text-green-500" />
          <span className="text-xl font-bold">RePlas</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton asChild isActive={pathname === link.href} tooltip={link.title}>
                <Link href={link.href}>
                  <link.icon className="h-5 w-5" />
                  <span>{link.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {isConnected && (
          <>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Community</h2>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Chat Assistant">
                    <Link href="/chat">
                      <MessageSquare className="h-5 w-5" />
                      <span>Chat Assistant</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Leaderboard">
                    <Link href="/leaderboard">
                      <Award className="h-5 w-5" />
                      <span>Leaderboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Community">
                    <Link href="/community">
                      <Users className="h-5 w-5" />
                      <span>Community</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function Recycle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  )
}
