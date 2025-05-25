"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  PieChart as ReChartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart as ReChartsLine,
  BarChart as ReChartsBar,
} from "recharts"

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

// Custom PieChart component that wraps Recharts PieChart
interface PieChartProps {
  data: Array<{
    name: string
    value: number
    [key: string]: any
  }>
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export function PieChart({
  data,
  index,
  categories,
  colors = ["#0ea5e9", "#16a34a", "#f59e0b", "#8b5cf6", "#64748b"],
  valueFormatter = (value) => `${value}`,
  className,
}: PieChartProps) {
  const RADIAN = Math.PI / 180

  // Custom label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-muted-foreground">{valueFormatter(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <ReChartsPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey={index}
          animationDuration={750}
          animationBegin={0}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          formatter={(value) => <span className="text-sm">{value}</span>}
        />
      </ReChartsPie>
    </ResponsiveContainer>
  )
}

// LineChart component
export function LineChart({ ...props }) {
  return <ReChartsLine {...props} />
}

// BarChart component
export function BarChart({ ...props }) {
  return <ReChartsBar {...props} />
}
