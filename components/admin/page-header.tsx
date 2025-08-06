"use client"

import { Button } from "@/components/ui/button"
import { HiPlus, HiAdjustmentsHorizontal, HiMagnifyingGlass } from "react-icons/hi2"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  showFilters?: boolean
  showAddButton?: boolean
  addButtonText?: string
  onAdd?: () => void
  children?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  showSearch = false,
  showFilters = false,
  showAddButton = false,
  addButtonText = "Add New",
  onAdd,
  children
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm mb-6">
      <div className="px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm lg:text-base text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3 lg:gap-4">
            {showSearch && (
              <Button variant="outline" size="default" className="gap-2 min-w-[100px]">
                <HiMagnifyingGlass className="h-4 w-4 text-gray-600" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            )}
            
            {showFilters && (
              <Button variant="outline" size="default" className="gap-2 min-w-[100px]">
                <HiAdjustmentsHorizontal className="h-4 w-4 text-gray-600" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            )}
            
            {showAddButton && (
              <Button 
                onClick={onAdd} 
                size="default" 
                variant="black"
                className="gap-2 min-w-[120px] font-medium"
              >
                <HiPlus className="h-4 w-4" />
                <span>{addButtonText}</span>
              </Button>
            )}
            
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
