"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("rounded-md border bg-card text-card-foreground shadow-sm", className)} {...props} />
    )
  },
)
ChartContainer.displayName = "ChartContainer"

export { ChartContainer }
