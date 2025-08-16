"use client";

import { memo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBrandColors } from './ChartColors';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/helpers/analytics';

type Item = { name: string; revenue: number; quantity: number };

export const TopProductsBar = memo(function TopProductsBar({ data }: { data: Item[] }) {
  const colors = getBrandColors();
  const { currency } = useSettings();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products by Revenue</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 16, right: 16, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
            <XAxis type="number" tickFormatter={(v)=>formatCurrency(v, currency)} hide />
            <YAxis type="category" dataKey="name" width={180} tick={{ fill: colors.foreground }} />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0 || !payload[0]) return null;
              const rev = (payload[0]!.value as number) || 0;
              return (
                <div className="rounded-md bg-white/90 dark:bg-black/80 px-3 py-2 text-xs shadow border border-neutral-200 dark:border-neutral-800">
                  <div className="font-medium mb-1">{label}</div>
                  <div>Revenue: {formatCurrency(rev, currency)}</div>
                </div>
              );
            }} />
            <Bar dataKey="revenue" fill={colors.primary} radius={[4,4,4,4]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

export default TopProductsBar;


