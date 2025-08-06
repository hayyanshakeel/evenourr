"use client"

import { ArrowLeft, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  action?: React.ReactNode
}

export default function Header({ 
  title, 
  description, 
  backHref, 
  backLabel = "Back",
  action 
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {backHref && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Button>
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
    </header>
  )
}
