export type TimeSeriesPoint = {
  date: string; // YYYY-MM-DD
  revenue: number; // raw number (cents)
  orders: number;
  aov: number; // raw number (cents)
  conversionRate?: number; // 0-100
};

export function calcPercentGrowth(current: number, prev: number): number {
  if (prev === 0) return current > 0 ? 100 : 0;
  return ((current - prev) / prev) * 100;
}

export function mergeTimeSeries(base: TimeSeriesPoint[], compare?: TimeSeriesPoint[]): Array<TimeSeriesPoint & { compare?: TimeSeriesPoint }> {
  if (!compare || compare.length === 0) return base.map(b => ({ ...b }));
  const map = new Map<string, TimeSeriesPoint>();
  for (const c of compare) map.set(c.date, c);
  return base.map(b => ({ ...b, compare: map.get(b.date) }));
}

export function computeFunnelStats(views: number, adds: number, checkouts: number, purchases: number) {
  const safe = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0);
  return {
    views,
    adds,
    checkouts,
    purchases,
    addRate: safe(adds, views),
    checkoutRate: safe(checkouts, adds),
    purchaseRate: safe(purchases, checkouts),
    overallConversion: safe(purchases, views)
  };
}

export function formatCurrency(amount: number, currencyCode: string): string {
  // amount in cents → convert using decimals assumption 2; callers can pass exact cents
  const value = amount / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}


