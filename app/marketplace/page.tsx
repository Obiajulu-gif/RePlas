"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { ErrorBoundary } from "@/components/error-boundary"

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("eco-products")

  const ecoProducts = [
    {
      id: 1,
      name: "Eco-Friendly Water Bottle",
      description: "Reusable water bottle made from recycled plastic",
      price: 150,
      image: "/products/eco-water-bottle.png",
      stock: 45,
    },
    {
      id: 2,
      name: "Reusable Shopping Bag",
      description: "Durable shopping bag made from recycled materials",
      price: 100,
      image: "/products/reusable-shopping-bag.png",
      stock: 78,
    },
    {
      id: 3,
      name: "Bamboo Utensil Set",
      description: "Portable bamboo utensils for eco-conscious dining",
      price: 120,
      image: "/products/bamboo-utensil-set.png",
      stock: 32,
    },
    {
      id: 4,
      name: "Eco-Friendly Tote Bag",
      description: "Stylish tote bag made from recycled plastic bottles",
      price: 130,
      image: "/products/eco-friendly-tote.png",
      stock: 15,
    },
    {
      id: 5,
      name: "Bamboo Toothbrush Set",
      description: "Biodegradable toothbrushes with bamboo handles",
      price: 80,
      image: "/products/bamboo-toothbrush.png",
      stock: 50,
    },
    {
      id: 6,
      name: "Recycled Paper Notebook",
      description: "Notebook made from 100% recycled paper",
      price: 90,
      image: "/products/recycled-notebook.png",
      stock: 65,
    },
  ]

  const digitalRewards = [
    {
      id: 1,
      name: "Mobile Data Bundle",
      description: "500MB data bundle for your mobile device",
      price: 200,
      image: "/products/mobile-data-bundle.png",
      stock: 999,
    },
    {
      id: 2,
      name: "Airtime Voucher",
      description: "Airtime voucher for any mobile network",
      price: 150,
      image: "/products/airtime-voucher.png",
      stock: 999,
    },
    {
      id: 3,
      name: "Recycling Champion Badge",
      description: "Digital badge for your profile to showcase your commitment",
      price: 50,
      image: "/products/recycling-badge.png",
      stock: 999,
    },
    {
      id: 4,
      name: "Digital Gift Card",
      description: "Gift card for popular online stores",
      price: 250,
      image: "/products/digital-gift-card.png",
      stock: 999,
    },
  ]

  const impactRewards = [
    {
      id: 1,
      name: "Tree Planting Certificate",
      description: "Fund the planting of a tree and receive a digital certificate",
      price: 300,
      image: "/products/tree-planting-certificate.png",
      stock: 150,
    },
    {
      id: 2,
      name: "Carbon Offset NFT",
      description: "NFT representing 1 ton of carbon offset through verified projects",
      price: 500,
      image: "/products/carbon-offset-nft.png",
      stock: 75,
    },
  ]

  return (
    <ErrorBoundary>
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">RePlas Marketplace</h1>
          <p className="text-muted-foreground max-w-2xl">
            Redeem your RePlas tokens for eco-friendly products, digital rewards, or make a positive environmental
            impact.
          </p>
        </div>

        <Tabs defaultValue="eco-products" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="eco-products">Eco Products</TabsTrigger>
              <TabsTrigger value="digital-rewards">Digital Rewards</TabsTrigger>
              <TabsTrigger value="impact-rewards">Impact Rewards</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="eco-products" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="digital-rewards" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalRewards.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="impact-rewards" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {impactRewards.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}

function ProductCard({ product }) {
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
        {product.stock < 20 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Limited Stock
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">{product.price}</span>
            <span className="text-sm text-muted-foreground">RPL</span>
          </div>
          <div className="text-sm text-muted-foreground">{product.stock} available</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Redeem Now</Button>
      </CardFooter>
    </Card>
  )
}
