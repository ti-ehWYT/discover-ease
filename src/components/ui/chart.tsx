// components/ui/chart.tsx
"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  CartesianGrid,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

export const ChartContainer = ({
  children,
  className,
  config,
}: {
  children: React.ReactNode
  className?: string
  config?: ChartConfig
}) => {
  return (
    <div
      className={cn("recharts-wrapper", className)}
      style={{
        ["--chart-1" as any]: config?.desktop?.color ?? "#8884d8",
        ["--chart-2" as any]: config?.mobile?.color ?? "#82ca9d",
      }}
    >
      {children}
    </div>
  )
}

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

export const ChartTooltip = Tooltip

export const ChartTooltipContent = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any
  label?: string
}) => {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-md border bg-background p-2 shadow-sm text-sm">
      <div className="font-medium text-muted-foreground">{label}</div>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="text-muted-foreground">
          <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  )
}
