import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center p-4">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold tracking-tighter">Page not found</h1>
          <p className="text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
        </div>

        <Button asChild>
          <Link href="/" className="gap-1">
            <Home className="h-4 w-4" />
            Return home
          </Link>
        </Button>
      </div>
    </div>
  )
}
