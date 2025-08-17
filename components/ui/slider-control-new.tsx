"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type SliderControlProps = {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
  ariaLabel?: string
}

/**
 * SliderControl - Ultra smooth native HTML5 range slider
 * No complex state management - just direct native performance
 */
export function SliderControl({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  disabled = false,
  ariaLabel,
  className,
  ...props 
}: SliderControlProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      onChange(newValue)
    }
  }

  return (
    <input
      type="range"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "native-slider-smooth w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        // Custom thumb styles
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
        "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500",
        "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm",
        // Firefox thumb styles  
        "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full",
        "[&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:cursor-pointer",
        "[&::-moz-range-thumb]:border-0 [&::-moz-range-track]:bg-slate-200",
        // Dark mode
        "dark:bg-slate-700 dark:[&::-webkit-slider-thumb]:bg-blue-400 dark:[&::-moz-range-thumb]:bg-blue-400",
        className
      )}
      {...props}
    />
  )
}
