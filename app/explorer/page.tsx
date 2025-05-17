import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BlockchainExplorer } from "@/components/blockchain-explorer"
import { Search, Filter, ArrowUpDown } from "lucide-react"

export default function ExplorerPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Blockchain Explorer</h1>

      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by transaction hash, address, or batch ID" className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">12,458</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Plastic Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">3,245</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tokens Circulating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">1,245,780</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="batches">Plastic Batches</TabsTrigger>
          <TabsTrigger value="tokens">Token Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest transactions on the Celo blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainExplorer type="transactions" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <CardTitle>Plastic Batches</CardTitle>
              <CardDescription>Tracked plastic batches on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainExplorer type="batches" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Token Transfers</CardTitle>
              <CardDescription>Recent RePlas token transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainExplorer type="tokens" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
