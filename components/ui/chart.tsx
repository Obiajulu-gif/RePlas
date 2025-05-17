"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  // Create CSS variables for chart colors
  const style = React.useMemo(() => {
    return Object.entries(config).reduce(
      (acc, [key, value]) => {
        acc[`--color-${key}`] = value.color
        return acc
      },
      {} as Record<string, string>,
    )
  }, [config])

  return (
    <div className={cn("", className)} style={style} {...props}>
      {children}
    </div>
  )
}

interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  payload?: any[]
  label?: string
  formatter?: (value: number, name: string, props: any) => React.ReactNode
  labelFormatter?: (label: string) => React.ReactNode
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  className,
  children,
  ...props
}: ChartTooltipProps) {
  if (active && payload?.length) {
    return (
      <div className={cn("rounded-lg border bg-background p-2 shadow-sm", className)} {...props}>
        {children}
      </div>
    )
  }

  return null
}

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: any[]
  label?: string
  formatter?: (value: number, name: string, props: any) => React.ReactNode
  labelFormatter?: (label: string) => React.ReactNode
}

export function ChartTooltipContent({
  payload,
  label,
  formatter,
  labelFormatter,
  className,
  ...props
}: ChartTooltipContentProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {label && <p className="text-sm font-medium">{labelFormatter ? labelFormatter(label) : label}</p>}
      <div className="space-y-0.5">
        {payload?.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <p className="text-xs text-muted-foreground">
              {item.name}: {formatter ? formatter(item.value, item.name, item) : item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Export PieChart, LineChart, and BarChart from recharts
export { PieChart, LineChart, BarChart } from "recharts"
