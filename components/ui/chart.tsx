"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"

// ChartContainer component
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Record<string, { label: string; color: string }>
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, ...props }, ref) => {
    // Create CSS variables for the chart colors
    const style = config
      ? Object.entries(config).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [`--color-${key}`]: value.color,
          }),
          {},
        )
      : {}

    return (
      <div
        ref={ref}
        className={cn("rounded-md border bg-card text-card-foreground shadow-sm", className)}
        style={style}
        {...props}
      />
    )
  },
)
ChartContainer.displayName = "ChartContainer"

// ChartTooltip component
interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  formatter?: (value: number) => string
}

export const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ active, payload, label, formatter }, ref) => {
    if (!active || !payload?.length) {
      return null
    }

    return (
      <div ref={ref} className="rounded-md border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          <div className="font-semibold">{label}</div>
          <div className="grid gap-1">
            {payload.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <div>{item.name}</div>
                <div className="font-medium">{formatter ? formatter(item.value) : item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
)
ChartTooltip.displayName = "ChartTooltip"

// ChartTooltipContent component
export const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-md border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="font-semibold">{label}</div>
        <div className="grid gap-1">
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.stroke }} />
              <div>{item.name}</div>
              <div className="font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// LineChart component
interface LineChartProps {
  data: any[]
  categories: string[]
  index: string
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  className?: string
}

export function LineChart({
  data,
  categories,
  index,
  colors,
  valueFormatter,
  yAxisWidth = 30,
  className,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: yAxisWidth, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

// BarChart component
interface BarChartProps {
  data: any[]
  categories: string[]
  index: string
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

export function BarChart({ data, categories, index, colors, valueFormatter, yAxisWidth = 30 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: yAxisWidth, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        {categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill={colors[i % colors.length]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

// PieChart component
interface PieChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
}

export function PieChart({ data, index, categories, colors, valueFormatter }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          dataKey={categories[0]}
          isAnimationActive={true}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
