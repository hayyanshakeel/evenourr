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
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm",
        borderColor,
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg flex-shrink-0", bgColor)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
