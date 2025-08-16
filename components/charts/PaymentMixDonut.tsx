"use client";

import { memo, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBrandColors } from './ChartColors';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/helpers/analytics';

type Entry = { method: string; count: number; revenue: number };

export const PaymentMixDonut = memo(function PaymentMixDonut({ data }: { data: Entry[] }) {
  const colors = getBrandColors();
  const palette = [colors.primary, colors.secondary, colors.accent, colors.muted];
  const { currency } = useSettings();
  const total = useMemo(() => data.reduce((s,d)=>s+d.count,0), [data]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method Mix</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="method" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={palette[idx % palette.length]} />
              ))}
            </Pie>
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0 || !payload[0]) return null;
              const p = payload[0]!;
              const e = (p as any).payload as Entry;
              return (
                <div className="rounded-md bg-white/90 dark:bg-black/80 px-3 py-2 text-xs shadow border border-neutral-200 dark:border-neutral-800">
                  <div className="font-medium mb-1 capitalize">{e.method}</div>
                  <div>Orders: {e.count} ({total? Math.round((e.count/total)*100):0}%)</div>
                  <div>Revenue: {formatCurrency(e.revenue, currency)}</div>
                </div>
              );
            }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

export default PaymentMixDonut;


