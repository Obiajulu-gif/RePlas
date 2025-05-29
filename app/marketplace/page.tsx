"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, XCircle, Coins, Package, Zap, TreePine } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  stock: number
  category?: string
}

interface UserData {
  tokenBalance: number
  redeemedItems: number[]
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("eco-products")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    tokenBalance: 1250, // Mock user token balance
    redeemedItems: [],
  })
  const { toast } = useToast()

  const ecoProducts = [
    {
      id: 1,
      name: "Eco-Friendly Water Bottle",
      description: "Reusable water bottle made from recycled plastic",
      price: 150,
      image: "/products/eco-water-bottle.png",
      stock: 45,
      category: "eco-products",
    },
    {
      id: 2,
      name: "Reusable Shopping Bag",
      description: "Durable shopping bag made from recycled materials",
      price: 100,
      image: "/products/reusable-shopping-bag.png",
      stock: 78,
      category: "eco-products",
    },
    {
      id: 3,
      name: "Bamboo Utensil Set",
      description: "Portable bamboo utensils for eco-conscious dining",
      price: 120,
      image: "/products/bamboo-utensil-set.png",
      stock: 32,
      category: "eco-products",
    },
    {
      id: 4,
      name: "Eco-Friendly Tote Bag",
      description: "Stylish tote bag made from recycled plastic bottles",
      price: 130,
      image: "/products/eco-friendly-tote.png",
      stock: 15,
      category: "eco-products",
    },
    {
      id: 5,
      name: "Bamboo Toothbrush Set",
      description: "Biodegradable toothbrushes with bamboo handles",
      price: 80,
      image: "/products/bamboo-toothbrush.png",
      stock: 50,
      category: "eco-products",
    },
    {
      id: 6,
      name: "Recycled Paper Notebook",
      description: "Notebook made from 100% recycled paper",
      price: 90,
      image: "/products/recycled-notebook.png",
      stock: 65,
      category: "eco-products",
    },
  ]

  const digitalRewards = [
    {
      id: 7,
      name: "Mobile Data Bundle",
      description: "500MB data bundle for your mobile device",
      price: 200,
      image: "/products/mobile-data-bundle.png",
      stock: 999,
      category: "digital-rewards",
    },
    {
      id: 8,
      name: "Airtime Voucher",
      description: "Airtime voucher for any mobile network",
      price: 150,
      image: "/products/airtime-voucher.png",
      stock: 999,
      category: "digital-rewards",
    },
    {
      id: 9,
      name: "Recycling Champion Badge",
      description: "Digital badge for your profile to showcase your commitment",
      price: 50,
      image: "/products/recycling-badge.png",
      stock: 999,
      category: "digital-rewards",
    },
    {
      id: 10,
      name: "Digital Gift Card",
      description: "Gift card for popular online stores",
      price: 250,
      image: "/products/digital-gift-card.png",
      stock: 999,
      category: "digital-rewards",
    },
  ]

  const impactRewards = [
    {
      id: 11,
      name: "Tree Planting Certificate",
      description: "Fund the planting of a tree and receive a digital certificate",
      price: 300,
      image: "/products/tree-planting-certificate.png",
      stock: 150,
      category: "impact-rewards",
    },
    {
      id: 12,
      name: "Carbon Offset NFT",
      description: "NFT representing 1 ton of carbon offset through verified projects",
      price: 500,
      image: "/products/carbon-offset-nft.png",
      stock: 75,
      category: "impact-rewards",
    },
  ]

  const handleRedeemClick = (product: Product) => {
    setSelectedProduct(product)
    setIsRedeemModalOpen(true)
  }

  const handleConfirmRedeem = async () => {
    if (!selectedProduct) return

    // Check if user has enough tokens
    if (userData.tokenBalance < selectedProduct.price) {
      toast({
        title: "Insufficient Tokens",
        description: `You need ${selectedProduct.price} RPL tokens but only have ${userData.tokenBalance} RPL.`,
        variant: "destructive",
      })
      return
    }

    // Check if item is in stock
    if (selectedProduct.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call for redemption
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user data
      setUserData((prev) => ({
        tokenBalance: prev.tokenBalance - selectedProduct.price,
        redeemedItems: [...prev.redeemedItems, selectedProduct.id],
      }))

      // Update product stock (in a real app, this would be handled by the backend)
      const updateProductStock = (products: Product[]) =>
        products.map((p) => (p.id === selectedProduct.id ? { ...p, stock: p.stock - 1 } : p))

      // Update stock in all product arrays
      if (selectedProduct.category === "eco-products") {
        ecoProducts.forEach((product, index) => {
          if (product.id === selectedProduct.id) {
            ecoProducts[index].stock -= 1
          }
        })
      }

      toast({
        title: "Redemption Successful! 🎉",
        description: `You've successfully redeemed ${selectedProduct.name} for ${selectedProduct.price} RPL tokens.`,
      })

      setIsRedeemModalOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "eco-products":
        return <Package className="h-4 w-4" />
      case "digital-rewards":
        return <Zap className="h-4 w-4" />
      case "impact-rewards":
        return <TreePine className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <ErrorBoundary>
      <div className="container py-12">
        {/* Header with Token Balance */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <Coins className="h-5 w-5 text-emerald-600" />
            <span className="text-lg font-semibold text-emerald-700">{userData.tokenBalance} RPL Tokens</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">RePlas Marketplace</h1>
          <p className="text-muted-foreground max-w-2xl">
            Redeem your RePlas tokens for eco-friendly products, digital rewards, or make a positive environmental
            impact.
          </p>
        </div>

        <Tabs defaultValue="eco-products" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="eco-products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Eco Products
              </TabsTrigger>
              <TabsTrigger value="digital-rewards" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Digital Rewards
              </TabsTrigger>
              <TabsTrigger value="impact-rewards" className="flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                Impact Rewards
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="eco-products" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecoProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRedeem={handleRedeemClick}
                  userTokens={userData.tokenBalance}
                  isRedeemed={userData.redeemedItems.includes(product.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="digital-rewards" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalRewards.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRedeem={handleRedeemClick}
                  userTokens={userData.tokenBalance}
                  isRedeemed={userData.redeemedItems.includes(product.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="impact-rewards" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {impactRewards.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRedeem={handleRedeemClick}
                  userTokens={userData.tokenBalance}
                  isRedeemed={userData.redeemedItems.includes(product.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Redemption Confirmation Modal */}
        <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getCategoryIcon(selectedProduct?.category || "")}
                Confirm Redemption
              </DialogTitle>
              <DialogDescription>Please review your redemption details before confirming.</DialogDescription>
            </DialogHeader>

            {selectedProduct && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 relative overflow-hidden rounded-md bg-muted">
                    <SafeImage
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      fallbackSrc="/eco-friendly-product.png"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-semibold text-emerald-600">{selectedProduct.price} RPL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Balance:</span>
                    <span
                      className={userData.tokenBalance >= selectedProduct.price ? "text-green-600" : "text-red-600"}
                    >
                      {userData.tokenBalance} RPL
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Balance After:</span>
                    <span className="font-semibold">{userData.tokenBalance - selectedProduct.price} RPL</span>
                  </div>
                </div>

                {userData.tokenBalance < selectedProduct.price && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">Insufficient tokens for this redemption</span>
                  </div>
                )}

                {selectedProduct.stock <= 0 && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <XCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-orange-700">This item is currently out of stock</span>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsRedeemModalOpen(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRedeem}
                disabled={
                  isProcessing ||
                  !selectedProduct ||
                  userData.tokenBalance < selectedProduct.price ||
                  selectedProduct.stock <= 0
                }
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Redemption
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  )
}

interface ProductCardProps {
  product: Product
  onRedeem: (product: Product) => void
  userTokens: number
  isRedeemed: boolean
}

function ProductCard({ product, onRedeem, userTokens, isRedeemed }: ProductCardProps) {
  const canAfford = userTokens >= product.price
  const inStock = product.stock > 0

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden bg-muted">
        <SafeImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform hover:scale-105 duration-500"
          fallbackSrc="/eco-friendly-product.png"
        />
        {product.stock < 20 && product.stock > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Limited Stock
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
        {isRedeemed && (
          <Badge variant="default" className="absolute top-2 left-2 bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Redeemed
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {product.name}
          {!canAfford && (
            <Badge variant="outline" className="text-xs">
              Need {product.price - userTokens} more RPL
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-emerald-600">{product.price}</span>
            <span className="text-sm text-muted-foreground">RPL</span>
          </div>
          <div className="text-sm text-muted-foreground">{product.stock} available</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          onClick={() => onRedeem(product)}
          disabled={!canAfford || !inStock || isRedeemed}
        >
          {isRedeemed ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Already Redeemed
            </>
          ) : !inStock ? (
            "Out of Stock"
          ) : !canAfford ? (
            "Insufficient Tokens"
          ) : (
            "Redeem Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
