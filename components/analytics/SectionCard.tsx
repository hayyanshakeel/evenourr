"use client";

import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({ title, subtitle, children, className = "" }: SectionCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="p-4">
        <div className="text-[13px] text-gray-600 tracking-tight">{title}</div>
        <div className="h-px w-full border-b border-dotted border-gray-300 mt-1 mb-3" />
        {subtitle ? <div className="text-[12px] text-gray-500 mb-2">{subtitle}</div> : null}
        {children}
      </div>
    </div>
  );
}


