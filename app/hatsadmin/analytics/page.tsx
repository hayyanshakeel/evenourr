"use client";

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency as formatCurrencyLib } from '@/lib/currencies';
import RevenueOverTimeChart from '@/components/charts/RevenueOverTimeChart';
import PaymentMixDonut from '@/components/charts/PaymentMixDonut';
import TopProductsBar from '@/components/charts/TopProductsBar';

type TF = '24h' | '7d' | '30d' | '90d';

export default function AnalyticsPage() {
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth();
  const [timeframe, setTimeframe] = useState<TF>('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);

  const { currency } = useSettings();

  const formatCurrency = (amount: number) => formatCurrencyLib(amount, currency);

  async function fetchData() {
    if (!isReady || !isAuthenticated) return;
    setLoading(true);
    try {
      const res = await makeAuthenticatedRequest(`/api/admin/analytics?timeframe=${timeframe}`);
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      setData(json.data);
    } catch (e) {
      console.error('analytics fetch failed', e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [timeframe, isReady, isAuthenticated]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600">Enterprise metrics powered by Turso</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={(v: TF) => setTimeframe(v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {loading || !data ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Loading skeleton for left side */}
          <div className="xl:col-span-2 space-y-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          {/* Loading skeleton for right side */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
            <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Main Layout: Left side content, Right side overview cards + globe */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Side - Charts and Analytics */}
            <div className="xl:col-span-2 space-y-6">

              {/* Live */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Live (last 30m)
                    <Badge variant="outline" className="ml-2">{timeframe}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(data.live.last30mRevenue)}</p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{data.live.last30mOrders}</p>
                      <p className="text-sm text-gray-600">Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Series (Chart) */}
              <RevenueOverTimeChart
                data={data.timeseries?.map((p: any) => ({ date: p.date, revenue: p.revenue })) || []}
                compare={data.compareTimeseries?.map((p: any) => ({ date: p.date, revenue: p.revenue })) || undefined}
              />

              {/* Hourly Heatmap */}
              <Card>
                <CardHeader><CardTitle>Hourly Performance</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                    {data.hourlyHeatmap.map((h: any) => (
                      <div key={h.hour} className="p-2 rounded border text-center">
                        <div className="text-xs text-gray-500">{h.hour}:00</div>
                        <div className="text-sm font-semibold text-blue-600">{h.orders}</div>
                        <div className="text-xs text-gray-600">{formatCurrency(h.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

          {/* Top Products */}
          <Card>
            <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topProducts.length === 0 && (
                  <p className="text-sm text-gray-500">No sales in this period</p>
                )}
                {data.topProducts.map((p: any, i: number) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-sm">#{i+1}</div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500">Qty {p.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right font-semibold">{formatCurrency(p.revenue)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader><CardTitle>Top Customers</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topCustomers.length === 0 && (<p className="text-sm text-gray-500">No customers in this period</p>)}
                {data.topCustomers.map((c: any, i: number) => (
                  <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(c.revenue)}</div>
                      <div className="text-xs text-gray-500">{c.orders} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PaymentMixDonut data={data.paymentMix || []} />
                <TopProductsBar data={(data.topProducts || []).map((p: any)=>({ name: p.name, revenue: p.revenue, quantity: p.quantity }))} />
              </div>
            </div>

            {/* Right Side - Overview Cards + Live Orders Globe */}
            <div className="space-y-4">
              {/* Overview Cards - Stacked Vertically */}
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold">{formatCurrency(data.overview.revenue.current)}</p>
                  <p className="text-xs text-gray-500">Prev: {formatCurrency(data.overview.revenue.previous)}
                    <span className={`ml-2 ${data.overview.revenue.growth>=0?'text-green-600':'text-red-600'}`}>
                      {data.overview.revenue.growth>=0?'+':''}{data.overview.revenue.growth.toFixed(1)}%
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-3xl font-bold">{data.overview.orders.current.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Prev: {data.overview.orders.previous.toLocaleString()}
                    <span className={`ml-2 ${data.overview.orders.growth>=0?'text-green-600':'text-red-600'}`}>
                      {data.overview.orders.growth>=0?'+':''}{data.overview.orders.growth.toFixed(1)}%
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Customers</p>
                  <p className="text-3xl font-bold">{data.overview.customers.current.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">New {data.overview.customers.new ?? 0} • Returning {data.overview.customers.returning ?? 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-3xl font-bold">{formatCurrency(data.overview.avgOrderValue)}</p>
                  <p className="text-xs text-gray-500">Products: {data.overview.products.total} • Low stock: <span className="text-red-600">{data.overview.products.lowStock}</span></p>
                </CardContent>
              </Card>


            </div>
          </div>

          {/* Inventory Velocity */}
          <Card>
            <CardHeader><CardTitle>Inventory Velocity</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(Array.isArray(data?.inventoryVelocity) ? data.inventoryVelocity : []).map((v: any) => (
                  <div key={v.productId} className="p-3 border rounded">
                    <p className="text-sm text-gray-600">Product #{v.productId}</p>
                    <p className="text-lg font-semibold">{v.qtyPerDay.toFixed(2)} / day</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader><CardTitle>Conversion Funnel</CardTitle></CardHeader>
            <CardContent>
              {(() => {
                const funnelRows = Array.isArray(data?.funnel)
                  ? (data?.funnel as any[])
                  : ([
                      { key: 'sessions', label: 'Sessions', value: data?.funnel?.sessions ?? data?.overview?.sessions?.current ?? 0 },
                      { key: 'pdp', label: 'Product views', value: data?.funnel?.pdp ?? 0 },
                      { key: 'atc', label: 'Add to carts', value: data?.funnel?.atc ?? 0 },
                      { key: 'checkout', label: 'Checkouts', value: data?.funnel?.checkout ?? 0 },
                      { key: 'orders', label: 'Purchases', value: data?.funnel?.orders ?? data?.overview?.orders?.current ?? 0 },
                    ]);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {funnelRows.map((s: any) => (
                  <div key={s.key} className="p-3 rounded border">
                    <p className="text-sm text-gray-600">{s.label}</p>
                    <p className="text-xl font-semibold">{(s.value ?? 0).toLocaleString()}</p>
                    {s.rate !== undefined && (
                      <p className="text-xs text-gray-500">{(s.rate * 100).toFixed(1)}%</p>
                    )}
                  </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Marketing Attribution */}
          <Card>
            <CardHeader><CardTitle>Marketing Attribution</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-600">
                    <tr>
                      <th className="py-2 pr-4">Channel</th>
                      <th className="py-2 pr-4">Revenue</th>
                      <th className="py-2 pr-4">CAC</th>
                      <th className="py-2 pr-4">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(data?.attribution) ? data.attribution : []).map((row: any) => (
                      <tr key={row.channel} className="border-t">
                        <td className="py-2 pr-4 font-medium">{row.channel}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.revenue)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.cac)}</td>
                        <td className="py-2 pr-4">{(row.roas ?? 0).toFixed(2)}x</td>
                      </tr>
                    ))}
                    {(!data?.attribution || data.attribution.length === 0) && (
                      <tr><td className="py-3 text-gray-500" colSpan={4}>No attribution data in this period</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Customer Cohorts */}
          <Card>
            <CardHeader><CardTitle>Customer Cohorts (Retention)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                {(Array.isArray(data?.cohorts) ? data.cohorts : []).map((c: any) => (
                  <div key={c.cohort} className="p-2 rounded border text-center">
                    <p className="text-xs text-gray-500">{c.cohort}</p>
                    <p className="text-sm font-semibold">{(c.retention * 100).toFixed(1)}%</p>
                  </div>
                ))}
                {(!data?.cohorts || data.cohorts.length === 0) && (
                  <p className="text-sm text-gray-500">No cohort data</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Returns & Exchanges */}
          <Card>
            <CardHeader><CardTitle>Returns & Exchanges</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded border">
                  <p className="text-sm text-gray-600">Return Rate</p>
                  <p className="text-xl font-semibold">{((data?.returns?.rate ?? 0) * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded border">
                  <p className="text-sm text-gray-600">Exchange Save Rate</p>
                  <p className="text-xl font-semibold">{((data?.returns?.saveRate ?? 0) * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded border">
                  <p className="text-sm text-gray-600">Avg Refund Time</p>
                  <p className="text-xl font-semibold">{(data?.returns?.avgDays ?? 0).toFixed(1)} days</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Top Reasons</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(Array.isArray(data?.returns?.reasons) ? data.returns.reasons : []).map((r: any) => (
                    <div key={r.reason} className="p-2 border rounded text-sm flex items-center justify-between">
                      <span className="text-gray-600">{r.reason}</span>
                      <span className="font-medium">{((r.share ?? 0) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                  {(!data?.returns?.reasons || data.returns.reasons.length === 0) && (
                    <p className="text-sm text-gray-500">No return reasons available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Radar */}
          <Card>
            <CardHeader><CardTitle>Anomaly Radar</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(Array.isArray(data?.anomalies) ? data.anomalies : []).map((a: any, i: number) => (
                  <div key={i} className="p-3 rounded border flex items-center justify-between">
                    <div>
                      <p className="font-medium">{a.metric}</p>
                      <p className="text-xs text-gray-500">{a.context}</p>
                    </div>
                    <div className={`text-sm font-semibold ${a.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {a.delta >= 0 ? '+' : ''}{(a.delta * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
                {(!data?.anomalies || data.anomalies.length === 0) && (
                  <p className="text-sm text-gray-500">No anomalies detected</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Executive Scorecard */}
          <Card>
            <CardHeader><CardTitle>Executive Scorecard</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded border"><p className="text-sm text-gray-600">Revenue</p><p className="text-xl font-semibold">{formatCurrency(data?.scorecard?.revenue ?? data?.overview?.revenue?.current ?? 0)}</p></div>
                <div className="p-3 rounded border"><p className="text-sm text-gray-600">Contribution Margin</p><p className="text-xl font-semibold">{formatCurrency(data?.scorecard?.cm ?? 0)}</p></div>
                <div className="p-3 rounded border"><p className="text-sm text-gray-600">AOV</p><p className="text-xl font-semibold">{formatCurrency(data?.scorecard?.aov ?? data?.overview?.avgOrderValue ?? 0)}</p></div>
                <div className="p-3 rounded border"><p className="text-sm text-gray-600">Conversion</p><p className="text-xl font-semibold">{((data?.scorecard?.conv ?? 0) * 100).toFixed(2)}%</p></div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

