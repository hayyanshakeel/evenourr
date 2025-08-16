"use client";

import { memo, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { getBrandColors } from './ChartColors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/helpers/analytics';

type Point = { date: string; revenue: number; revenueCompare?: number };

export const RevenueOverTimeChart = memo(function RevenueOverTimeChart({ data, compare }: { data: { date: string; revenue: number }[]; compare?: { date: string; revenue: number }[] }) {
  const colors = getBrandColors();
  const { currency } = useSettings();
  const merged = useMemo<Point[]>(() => {
    const map = new Map<string, Point>();
    data.forEach(d => map.set(d.date, { date: d.date, revenue: d.revenue }));
    (compare || []).forEach(c => {
      const existing = map.get(c.date);
      if (existing) existing.revenueCompare = c.revenue;
      else map.set(c.date, { date: c.date, revenue: 0, revenueCompare: c.revenue });
    });
    return Array.from(map.values()).sort((a,b)=>a.date.localeCompare(b.date));
  }, [data, compare]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
            <XAxis dataKey="date" tick={{ fill: colors.foreground }} />
            <YAxis tickFormatter={(v)=>formatCurrency(v, currency)} tick={{ fill: colors.foreground }} />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const curr = payload.find(p=>p.dataKey==='revenue')?.value as number | undefined;
              const prev = payload.find(p=>p.dataKey==='revenueCompare')?.value as number | undefined;
              return (
                <div className="rounded-md bg-white/90 dark:bg-black/80 px-3 py-2 text-xs shadow border border-neutral-200 dark:border-neutral-800">
                  <div className="font-medium mb-1">{label}</div>
                  <div>Current: {curr!=null? formatCurrency(curr, currency):'-'}</div>
                  {prev!=null && (<div>Previous: {formatCurrency(prev, currency)}</div>)}
                </div>
              );
            }} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke={colors.primary} strokeWidth={2} dot={false} name="Revenue" />
            {compare && <Line type="monotone" dataKey="revenueCompare" stroke={colors.muted} strokeWidth={2} dot={false} name="Previous" />}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

export default RevenueOverTimeChart;


