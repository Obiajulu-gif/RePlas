"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart } from "@/components/ui/chart"
import { useWallet } from "@/components/wallet-provider"
import { ArrowUpRight } from "lucide-react"

export default function TokenBalance() {
  const { balance } = useWallet()

  return (
    <Card>
      <CardHeader>
        <CardTitle>RePlas Token Balance</CardTitle>
        <CardDescription>Your token earnings and usage</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-bold">{balance} RPL</p>
            <p className="text-xs text-muted-foreground">≈ $32.00 USD</p>
          </div>
          <Button variant="outline" size="sm">
            View History
          </Button>
        </div>

        <div className="h-[180px]">
          <BarChart
            data={[
              { name: "Week 1", Earned: 45, Spent: 10 },
              { name: "Week 2", Earned: 60, Spent: 25 },
              { name: "Week 3", Earned: 35, Spent: 15 },
              { name: "Week 4", Earned: 75, Spent: 30 },
            ]}
            categories={["Earned", "Spent"]}
            index="name"
            colors={["#16a34a", "#ef4444"]}
            valueFormatter={(value) => `${value} RPL`}
            yAxisWidth={30}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Transfer</Button>
        <Button>
          Redeem Tokens
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
