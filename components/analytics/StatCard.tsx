"use client";

import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: ReactNode;
  rightAddon?: ReactNode;
  className?: string;
};

export function StatCard({ title, value, rightAddon, className = "" }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="p-4">
        <div className="text-[13px] text-gray-600 tracking-tight flex items-center justify-between">
          <span>{title}</span>
          {rightAddon ? <span className="ml-2">{rightAddon}</span> : null}
        </div>
        <div className="h-px w-full border-b border-dotted border-gray-300 mt-1 mb-2" />
        <div className="text-[22px] font-semibold leading-tight">{value}</div>
      </div>
    </div>
  );
}


