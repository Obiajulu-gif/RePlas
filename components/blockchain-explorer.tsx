"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Clock, Database, FileText } from "lucide-react"
import BlockchainVisualization from "@/components/3d-blockchain-visualization"

export default function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock blockchain data
  const recentBlocks = [
    { id: 1, number: 12345678, timestamp: "2 mins ago", transactions: 42, size: "1.2 MB", validator: "0x1a2b...3c4d" },
    { id: 2, number: 12345677, timestamp: "5 mins ago", transactions: 36, size: "0.9 MB", validator: "0x5e6f...7g8h" },
    { id: 3, number: 12345676, timestamp: "8 mins ago", transactions: 51, size: "1.4 MB", validator: "0x9i0j...1k2l" },
    { id: 4, number: 12345675, timestamp: "12 mins ago", transactions: 28, size: "0.8 MB", validator: "0x3m4n...5o6p" },
  ]

  const recentTransactions = [
    {
      id: "0xabc...123",
      from: "0x1a2b...3c4d",
      to: "0x5e6f...7g8h",
      value: "320 RPL",
      timestamp: "1 min ago",
      type: "Token Transfer",
    },
    {
      id: "0xdef...456",
      from: "0x9i0j...1k2l",
      to: "0x3m4n...5o6p",
      value: "1.2 CELO",
      timestamp: "3 mins ago",
      type: "Transaction",
    },
    {
      id: "0xghi...789",
      from: "0x5e6f...7g8h",
      to: "0x1a2b...3c4d",
      value: "150 RPL",
      timestamp: "6 mins ago",
      type: "Token Transfer",
    },
    {
      id: "0xjkl...012",
      from: "0x3m4n...5o6p",
      to: "Contract",
      value: "0 CELO",
      timestamp: "10 mins ago",
      type: "Contract Call",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Blockchain Explorer</CardTitle>
              <CardDescription>Explore the RePlas blockchain and track plastic recycling transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by transaction, block, or address"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button>Search</Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Avg Block Time</p>
                    <p className="text-2xl font-bold">5.2s</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Database className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Total Blocks</p>
                    <p className="text-2xl font-bold">12.3M</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Transactions</p>
                    <p className="text-2xl font-bold">45.7M</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
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
                      className="h-8 w-8 text-primary mb-2"
                    >
                      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                      <path d="m14 16-3 3 3 3" />
                      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
                      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
                      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
                    </svg>
                    <p className="text-sm font-medium">RPL Transfers</p>
                    <p className="text-2xl font-bold">18.2M</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Live Visualization</CardTitle>
              <CardDescription>Real-time blockchain activity</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <BlockchainVisualization />
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="blocks">
        <TabsList>
          <TabsTrigger value="blocks">Recent Blocks</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Block</th>
                      <th className="text-left py-3 px-4">Age</th>
                      <th className="text-left py-3 px-4">Txns</th>
                      <th className="text-left py-3 px-4">Size</th>
                      <th className="text-left py-3 px-4">Validator</th>
                      <th className="text-right py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBlocks.map((block) => (
                      <tr key={block.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-primary">{block.number}</span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{block.timestamp}</td>
                        <td className="py-3 px-4">{block.transactions}</td>
                        <td className="py-3 px-4">{block.size}</td>
                        <td className="py-3 px-4 text-muted-foreground">{block.validator}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            View <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Tx Hash</th>
                      <th className="text-left py-3 px-4">From</th>
                      <th className="text-left py-3 px-4">To</th>
                      <th className="text-left py-3 px-4">Value</th>
                      <th className="text-left py-3 px-4">Age</th>
                      <th className="text-left py-3 px-4">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-primary">{tx.id}</span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{tx.from}</td>
                        <td className="py-3 px-4 text-muted-foreground">{tx.to}</td>
                        <td className="py-3 px-4">{tx.value}</td>
                        <td className="py-3 px-4 text-muted-foreground">{tx.timestamp}</td>
                        <td className="py-3 px-4">
                          <Badge variant={tx.type === "Token Transfer" ? "default" : "secondary"}>{tx.type}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
