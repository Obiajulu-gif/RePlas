import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Award, Gift, Leaf, ArrowUpRight } from "lucide-react"

export default function MarketplacePage() {
  const products = [
    {
      id: 1,
      name: "Eco-Friendly Water Bottle",
      description: "Made from recycled materials",
      price: 50,
      image: "/placeholder.svg?key=ujma6",
      category: "products",
      stock: 15,
    },
    {
      id: 2,
      name: "Reusable Shopping Bag",
      description: "Durable and washable",
      price: 30,
      image: "/placeholder.svg?key=nvi4l",
      category: "products",
      stock: 25,
    },
    {
      id: 3,
      name: "Bamboo Utensil Set",
      description: "Sustainable alternative to plastic",
      price: 45,
      image: "/placeholder.svg?key=jt24u",
      category: "products",
      stock: 10,
    },
    {
      id: 4,
      name: "Mobile Data Bundle",
      description: "1GB data for any network",
      price: 20,
      image: "/mobile-data-concept.png",
      category: "digital",
      stock: 999,
    },
    {
      id: 5,
      name: "Airtime Voucher",
      description: "Top up your mobile credit",
      price: 15,
      image: "/airtime-voucher.png",
      category: "digital",
      stock: 999,
    },
    {
      id: 6,
      name: "Tree Planting Certificate",
      description: "Plant a tree in your name",
      price: 100,
      image: "/placeholder-0rlsr.png",
      category: "impact",
      stock: 50,
    },
    {
      id: 7,
      name: "Carbon Offset NFT",
      description: "Offset 1 ton of carbon emissions",
      price: 200,
      image: "/placeholder.svg?height=200&width=200&query=carbon offset certificate",
      category: "impact",
      stock: 30,
    },
    {
      id: 8,
      name: "Recycling Champion Badge",
      description: "Digital badge for your profile",
      price: 75,
      image: "/placeholder.svg?height=200&width=200&query=recycling badge",
      category: "digital",
      stock: 100,
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Redeem your RePlas tokens for eco-friendly products and services</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted p-2 rounded-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-bold">320 RPL</span>
            <span className="text-xs text-muted-foreground">available</span>
          </div>
          <Button variant="outline" size="sm">
            Transaction History
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="products">Eco Products</TabsTrigger>
            <TabsTrigger value="digital">Digital Rewards</TabsTrigger>
            <TabsTrigger value="impact">Impact Rewards</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter((product) => product.category === "products")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="digital" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter((product) => product.category === "digital")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter((product) => product.category === "impact")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="object-cover w-full h-full" />
        <Badge
          className="absolute top-2 right-2"
          variant={
            product.category === "products" ? "default" : product.category === "digital" ? "secondary" : "outline"
          }
        >
          {product.category === "products" ? (
            <ShoppingBag className="h-3 w-3 mr-1" />
          ) : product.category === "impact" ? (
            <Leaf className="h-3 w-3 mr-1" />
          ) : (
            <Gift className="h-3 w-3 mr-1" />
          )}
          {product.category === "products" ? "Eco Product" : product.category === "digital" ? "Digital" : "Impact"}
        </Badge>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center">
          <Award className="h-4 w-4 text-primary mr-1" />
          <span className="font-bold">{product.price} RPL</span>
        </div>
        <Button size="sm">
          Redeem
          <ArrowUpRight className="ml-2 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
