import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AdminStatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
  subtitle?: string
  className?: string
}

export function AdminStatsCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  subtitle,
  className
}: AdminStatsCardProps) {
  return (
    <Card
      className={cn(
        "admin-card relative overflow-hidden transition-all duration-300 hover:border-slate-300",
        borderColor,
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", bgColor)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
