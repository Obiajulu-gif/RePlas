"use client"

import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SafeImage } from "@/components/ui/safe-image"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ResourcePage() {
  const params = useParams()

  return (
    <div className="container py-12">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/learn">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Link>
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="prose prose-emerald dark:prose-invert max-w-none">
            <h1>Resource Content Coming Soon</h1>
            <p>The content for {params.type}/{params.slug} is being prepared.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
