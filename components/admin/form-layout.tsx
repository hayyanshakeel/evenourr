"use client"

import { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FormLayoutProps {
  title: string
  subtitle?: string
  onBack?: () => void
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function FormLayout({
  title,
  subtitle,
  onBack,
  children,
  actions,
  className
}: FormLayoutProps) {
  return (
    <div className={cn("flex flex-col h-full w-full animate-in fade-in-0 duration-500", className)}>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm mb-6 rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-col space-y-4">
            {/* Back Button & Title */}
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            {/* Actions */}
            {actions && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="space-y-6 lg:space-y-8">
          <Card className="admin-card">
            <CardContent className="p-6 lg:p-8">
              {children}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
