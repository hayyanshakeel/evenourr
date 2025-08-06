"use client"

import { ReactNode } from "react"
import { Search, Filter, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageSkeleton, InlineLoading } from "@/components/ui/loading"
import { cn } from "@/lib/utils"

interface AdminPageLayoutProps {
  title: string
  subtitle: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  showFilters?: boolean
  showExport?: boolean
  exportText?: string
  onExport?: () => void
  addButtonText?: string
  onAdd?: () => void
  statsCards?: ReactNode
  children: ReactNode
  loading?: boolean
  className?: string
}

export function AdminPageLayout({
  title,
  subtitle,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  showFilters = true,
  showExport = true,
  exportText = "Export",
  onExport,
  addButtonText,
  onAdd,
  statsCards,
  children,
  loading = false,
  className
}: AdminPageLayoutProps) {
  if (loading) {
    return (
      <div className={cn("flex flex-col h-full w-full", className)}>
        <PageSkeleton showStats={!!statsCards} showTable={true} />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full w-full animate-in fade-in-0 duration-500", className)}>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm mb-6 rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-w-0">
          <div className="flex flex-col space-y-4 min-w-0">
            {/* Title Section */}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            </div>
            
            {/* Actions Section */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center sm:justify-between overflow-visible min-w-0">
              {/* Search Bar */}
              {onSearchChange && (
                <div className="relative flex-1 max-w-md min-w-0">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 h-10"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
              
              {/* Action Buttons */}
              {/* Horizontally scrollable actions for mobile, inline for desktop */}
              <div className="admin-actions-container overflow-x-auto no-scrollbar py-1 -mx-2 px-2 sm:mx-0 sm:px-0 lg:overflow-visible lg:py-0 lg:mx-0 lg:px-0">
                <div className="admin-button-group">
                  {showFilters && (
                    <Button variant="outline" size="sm" className="h-10">
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Filters</span>
                    </Button>
                  )}
                  {showExport && onExport && (
                    <Button variant="outline" size="sm" onClick={onExport} className="h-10">
                      <Download className="h-4 w-4 mr-2" />
                      <span className="hidden xs:inline">{exportText}</span>
                    </Button>
                  )}
                  {addButtonText && onAdd && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={onAdd} 
                      className="h-10 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden xs:inline">{addButtonText}</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="space-y-6 lg:space-y-8">
          {/* Stats Cards */}
          {statsCards && (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-2">
              {statsCards}
            </div>
          )}
          
          {/* Page Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
