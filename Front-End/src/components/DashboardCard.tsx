
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function DashboardCard({ title, value, icon: Icon, description, trend }: DashboardCardProps) {
  return (
    <Card className="bg-white border-coffee-200 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-coffee-700">{title}</CardTitle>
        <Icon className="h-5 w-5 text-coffee-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-coffee-800 mb-1">{value}</div>
        {description && (
          <p className="text-xs text-coffee-600">{description}</p>
        )}
        {trend && (
          <div className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}% vs mes anterior
          </div>
        )}
      </CardContent>
    </Card>
  )
}
