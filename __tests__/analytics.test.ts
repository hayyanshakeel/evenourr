import { calcPercentGrowth, mergeTimeSeries, computeFunnelStats } from '@/lib/helpers/analytics';

describe('analytics helpers', () => {
  test('calcPercentGrowth', () => {
    expect(calcPercentGrowth(200, 100)).toBe(100);
    expect(calcPercentGrowth(100, 0)).toBe(100);
    expect(calcPercentGrowth(0, 0)).toBe(0);
  });

  test('mergeTimeSeries', () => {
    const base = [{ date: '2025-01-01', revenue: 100, orders: 1, aov: 100 }];
    const comp = [{ date: '2025-01-01', revenue: 50, orders: 1, aov: 50 }];
    const merged = mergeTimeSeries(base, comp);
    expect(merged[0].compare?.revenue).toBe(50);
  });

  test('computeFunnelStats', () => {
    const f = computeFunnelStats(100, 50, 25, 10);
    expect(Math.round(f.overallConversion)).toBe(10);
    expect(Math.round(f.addRate)).toBe(50);
  });
});


