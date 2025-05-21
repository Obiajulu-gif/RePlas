"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart } from "@/components/ui/chart"
import { AnimatedElement } from "@/components/animation-provider"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"
import Image from "next/image"

// Dynamically import the 3D components with loading fallbacks
const PlasticToken = dynamic(() => import("@/components/3d-plastic-token"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[300px]">
      <Skeleton className="w-[300px] h-[300px] rounded-full" />
    </div>
  ),
})

const EconomicEngine3D = dynamic(() => import("@/components/economic-engine-3d"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px] rounded-lg" />,
})

export default function Tokenomics() {
  const [mounted, setMounted] = useState(false)

  // Ensure components only render on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  const tokenDistribution = [
    { name: "Recycling Rewards", value: 40 },
    { name: "Ecosystem Growth", value: 25 },
    { name: "Team & Advisors", value: 15 },
    { name: "Community Incentives", value: 10 },
    { name: "Reserve", value: 10 },
  ]

  const tokenUtility = [
    {
      title: "Rewards",
      description: "Earn tokens for recycling plastic waste and participating in sustainable practices.",
    },
    {
      title: "Governance",
      description: "Vote on platform upgrades, reward rates, and other important decisions.",
    },
    {
      title: "Access",
      description: "Unlock premium features, analytics, and services on the platform.",
    },
    {
      title: "Marketplace",
      description: "Use tokens to purchase recycled products, services, and carbon offsets.",
    },
  ]

  return (
    <section className="py-20 md:py-24 lg:py-32" id="tokenomics">
      <div className="container">
        <AnimatedElement id="tokenomics-heading" animation="fade-in-up" className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The Economic Engine of Sustainability</h2>
          <p className="text-xl text-muted-foreground">
            Our token system creates economic incentives for sustainable plastic management
          </p>
        </AnimatedElement>

        {/* Economic Engine 3D Animation */}
        <AnimatedElement id="economic-engine-3d" animation="fade-in" className="mb-16">
          <div className="bg-card rounded-lg shadow-lg p-6 overflow-hidden">
            {mounted && <EconomicEngine3D height={300} />}
          </div>
        </AnimatedElement>

        <div className="grid md:grid-cols-5 gap-8 mb-16">
          <div className="md:col-span-2 flex items-center justify-center">
            <AnimatedElement id="token-3d-model" animation="fade-in-left">
              {mounted ? (
                <PlasticToken size={300} />
              ) : (
                <div className="relative w-[300px] h-[300px]">
                  <Image
                    src="/digital-token.png"
                    alt="RePlas Token"
                    width={300}
                    height={300}
                    className="rounded-full object-cover"
                  />
                </div>
              )}
            </AnimatedElement>
          </div>

          <div className="md:col-span-3">
            <AnimatedElement id="token-description" animation="fade-in-right">
              <h3 className="text-2xl font-bold mb-4">RePlas Token (RPL)</h3>
              <p className="text-muted-foreground mb-6">
                The RePlas Token (RPL) is the native utility token that powers our ecosystem. It incentivizes
                sustainable behavior, enables transparent tracking of recycled materials, and creates a circular economy
                for plastic waste management.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Supply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-emerald-600">1,000,000,000</p>
                    <p className="text-xs text-muted-foreground">Fixed supply, no inflation</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Blockchain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-emerald-600">Celo</p>
                    <p className="text-xs text-muted-foreground">Carbon-negative blockchain</p>
                  </CardContent>
                </Card>
              </div>
            </AnimatedElement>
          </div>
        </div>

        <AnimatedElement id="tokenomics-tabs" animation="fade-in-up" delay={200}>
          <Tabs defaultValue="distribution" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="distribution" className="transition-all data-[state=active]:animate-pulse-subtle">
                Token Distribution
              </TabsTrigger>
              <TabsTrigger value="utility" className="transition-all data-[state=active]:animate-pulse-subtle">
                Token Utility
              </TabsTrigger>
              <TabsTrigger value="benefits" className="transition-all data-[state=active]:animate-pulse-subtle">
                Benefits
              </TabsTrigger>
            </TabsList>

            <TabsContent value="distribution" className="mt-8 animate-in fade-in duration-500">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="transition-all hover:shadow-lg duration-300">
                  <CardHeader>
                    <CardTitle>RePlas Token Distribution</CardTitle>
                    <CardDescription>Total Supply: 1,000,000,000 RPL</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] animate-in spin-in-3 duration-1000">
                      <PieChart
                        data={tokenDistribution}
                        index="name"
                        categories={["value"]}
                        colors={["#16a34a", "#0ea5e9", "#f59e0b", "#8b5cf6", "#64748b"]}
                        valueFormatter={(value) => `${value}%`}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-xl font-bold mb-4">Token Allocation</h3>
                  <ul className="space-y-4">
                    {tokenDistribution.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 transform transition-all hover:translate-x-1 duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`h-4 w-4 rounded-full bg-${getColor(index)}-500`}></div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{item.name}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`bg-${getColor(index)}-500 h-2 rounded-full animate-grow-width`}
                              style={{
                                width: `${item.value}%`,
                                animationDelay: `${index * 100}ms`,
                                animationDuration: "1s",
                              }}
                            ></div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="utility" className="mt-8 animate-in fade-in duration-500">
              <div className="grid md:grid-cols-2 gap-8">
                {tokenUtility.map((item, index) => (
                  <Card
                    key={index}
                    className="transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="mt-8 animate-in fade-in duration-500">
              <Card className="transition-all hover:shadow-lg duration-300">
                <CardHeader>
                  <CardTitle>Benefits of Holding RePlas Tokens</CardTitle>
                  <CardDescription>Unlock value and impact with our token ecosystem</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex gap-3 transform transition-all hover:translate-x-1 duration-300">
                      <div className="h-8 w-8 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 animate-pulse-subtle">
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
                          className="h-4 w-4 text-emerald-600"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Staking Rewards</h4>
                        <p className="text-sm text-muted-foreground">
                          Stake your tokens to earn passive income while supporting the platform's security.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 transform transition-all hover:translate-x-1 duration-300">
                      <div
                        className="h-8 w-8 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 animate-pulse-subtle"
                        style={{ animationDelay: "0.2s" }}
                      >
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
                          className="h-4 w-4 text-emerald-600"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Governance Rights</h4>
                        <p className="text-sm text-muted-foreground">
                          Participate in platform governance and help shape the future of plastic waste management.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 transform transition-all hover:translate-x-1 duration-300">
                      <div
                        className="h-8 w-8 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 animate-pulse-subtle"
                        style={{ animationDelay: "0.4s" }}
                      >
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
                          className="h-4 w-4 text-emerald-600"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Fee Discounts</h4>
                        <p className="text-sm text-muted-foreground">
                          Enjoy reduced fees for platform services based on your token holdings.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 transform transition-all hover:translate-x-1 duration-300">
                      <div
                        className="h-8 w-8 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 animate-pulse-subtle"
                        style={{ animationDelay: "0.6s" }}
                      >
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
                          className="h-4 w-4 text-emerald-600"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Premium Features</h4>
                        <p className="text-sm text-muted-foreground">
                          Access advanced analytics, reporting, and features exclusive to token holders.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 transform transition-all hover:translate-x-1 duration-300">
                      <div
                        className="h-8 w-8 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 animate-pulse-subtle"
                        style={{ animationDelay: "0.8s" }}
                      >
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
                          className="h-4 w-4 text-emerald-600"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Community Membership</h4>
                        <p className="text-sm text-muted-foreground">
                          Join a community of environmentally conscious individuals and organizations.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </AnimatedElement>
      </div>
    </section>
  )
}

function getColor(index: number) {
  const colors = ["green", "blue", "amber", "purple", "slate"]
  return colors[index % colors.length]
}
