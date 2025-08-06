import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'primary' | 'secondary' | 'muted';
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  variant = 'primary' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const variantClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    muted: 'text-gray-400'
  };

  return (
    <Loader2 
      className={clsx(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )} 
    />
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 rounded animate-pulse flex-1"
          />
        ))}
      </div>
      
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b border-gray-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={clsx(
                "bg-gray-100 rounded animate-pulse",
                colIndex === 0 ? "h-6 w-24" : "h-4 flex-1"
              )}
              style={{
                animationDelay: `${(rowIndex * 50) + (colIndex * 20)}ms`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface StatsCardSkeletonProps {
  count?: number;
}

export function StatsCardSkeleton({ count = 4 }: StatsCardSkeletonProps) {
  return (
    <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface PageSkeletonProps {
  showStats?: boolean;
  showTable?: boolean;
  tableRows?: number;
}

export function PageSkeleton({ 
  showStats = true, 
  showTable = true, 
  tableRows = 5 
}: PageSkeletonProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-96 animate-pulse" />
      </div>

      {/* Stats cards skeleton */}
      {showStats && <StatsCardSkeleton />}

      {/* Content skeleton */}
      {showTable && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="p-6">
            <TableSkeleton rows={tableRows} />
          </div>
        </div>
      )}
    </div>
  );
}

interface InlineLoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function InlineLoading({ text = "Loading...", size = 'sm' }: InlineLoadingProps) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <LoadingSpinner size={size} variant="muted" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

interface ButtonLoadingProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ButtonLoading({ 
  children, 
  loading = false, 
  disabled = false,
  className,
  onClick 
}: ButtonLoadingProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
        "bg-blue-600 text-white hover:bg-blue-700",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <LoadingSpinner size="sm" variant="secondary" />}
      {children}
    </button>
  );
}
