"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  onMenuToggle?: () => void
}

export function MobileHeader({ 
  title, 
  subtitle, 
  actions,
  onMenuToggle 
}: MobileHeaderProps) {
  return (
    <header className="lg:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
