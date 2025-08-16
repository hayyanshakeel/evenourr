import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import prisma from '@/lib/db';
import { verifyFirebaseUser } from '@/lib/firebase-verify';

export const runtime = 'nodejs';

function createError(message: string, status = 500, details?: any) {
  const body = { error: message, status, timestamp: new Date().toISOString(), ...(details && { details }) };
  return NextResponse.json(body, { status });
}

function createOk(data: any, status = 200) {
  return NextResponse.json({ success: true, data, timestamp: new Date().toISOString() }, { status });
}

type Timeframe = '24h' | '7d' | '30d' | '90d';

function getRange(timeframe: Timeframe) {
  const now = new Date();
  const end = now;
  const start = new Date(now);
  switch (timeframe) {
    case '24h': start.setDate(start.getDate() - 1); break;
    case '7d': start.setDate(start.getDate() - 7); break;
    case '90d': start.setDate(start.getDate() - 90); break;
    case '30d':
    default: start.setDate(start.getDate() - 30); break;
  }
  // previous period of equal length
  const prevEnd = new Date(start);
  const prevStart = new Date(prevEnd);
  prevStart.setTime(prevStart.getTime() - (end.getTime() - start.getTime()));
  return { start, end, prevStart, prevEnd };
}

export async function GET(req: NextRequest) {
  noStore();
  try {
    const auth = await verifyFirebaseUser(req);
    if ('error' in auth) return createError(auth.error || 'Unauthorized', auth.status);
    if (auth.user.role !== 'admin') return createError('Forbidden - Admin access required', 403);

    const { searchParams } = new URL(req.url);
    const tf = (searchParams.get('timeframe') as Timeframe) || '30d';
    const compare = searchParams.get('compare') === 'true';
    const filterPayment = searchParams.get('paymentMethod') || undefined;
    const filterCountry = searchParams.get('country') || undefined; // best-effort, may be unused
    const filterCollectionId = searchParams.get('collectionId') ? Number(searchParams.get('collectionId')) : undefined;
    const { start, end, prevStart, prevEnd } = getRange(tf);

    // Revenue and orders - current period
    const ordersCurrent = await prisma.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: { notIn: ['cancelled'] },
        ...(filterPayment ? { paymentMethod: filterPayment } : {}),
      },
      select: { id: true, totalPrice: true, customerId: true, userId: true, createdAt: true }
    });
    const ordersPrevious = await prisma.order.findMany({
      where: {
        createdAt: { gte: prevStart, lte: prevEnd },
        status: { notIn: ['cancelled'] },
        ...(filterPayment ? { paymentMethod: filterPayment } : {}),
      },
      select: { id: true, totalPrice: true, customerId: true, userId: true, createdAt: true }
    });

    const revenueCurrent = ordersCurrent.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const revenuePrevious = ordersPrevious.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const ordersCountCurrent = ordersCurrent.length;
    const ordersCountPrevious = ordersPrevious.length;

    const growth = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    // Customers current/previous and new vs returning in current period
    const distinctCustomersCurrent = new Set<number | null>();
    const distinctCustomersPrev = new Set<number | null>();
    ordersCurrent.forEach(o => distinctCustomersCurrent.add(o.customerId ?? null));
    ordersPrevious.forEach(o => distinctCustomersPrev.add(o.customerId ?? null));

    // Returning customers = customers in current who had orders before start
    const currentCustomerIds = Array.from(distinctCustomersCurrent).filter((id): id is number => typeof id === 'number');
    const hadPrior = await prisma.order.findMany({
      where: { createdAt: { lt: start }, customerId: { in: currentCustomerIds.length ? currentCustomerIds : undefined } },
      select: { customerId: true }
    });
    const returningSet = new Set(hadPrior.map(o => o.customerId || 0));
    const returningCount = currentCustomerIds.filter(id => returningSet.has(id)).length;
    const newCount = Math.max(ordersCountCurrent === 0 ? 0 : distinctCustomersCurrent.size - returningCount, 0);

    // AOV
    const avgOrderValue = ordersCountCurrent > 0 ? revenueCurrent / ordersCountCurrent : 0;

    // Products summary
    const [productsTotal, productsLow] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { inventory: { lte: 10 } } })
    ]);

    // Top products by revenue in period
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: start, lte: end },
          status: { notIn: ['cancelled'] },
          ...(filterPayment ? { paymentMethod: filterPayment } as any : {}),
        },
      },
      select: { productId: true, quantity: true, price: true, product: { select: { name: true } } }
    });
    const productRevenueMap = new Map<number, { name: string; revenue: number; quantity: number }>();
    for (const item of orderItems) {
      const key = item.productId;
      const rec = productRevenueMap.get(key) || { name: item.product?.name || `#${key}`, revenue: 0, quantity: 0 };
      rec.revenue += (item.price || 0) * (item.quantity || 0);
      rec.quantity += item.quantity || 0;
      productRevenueMap.set(key, rec);
    }
    const topProducts = Array.from(productRevenueMap.entries())
      .map(([id, v]) => ({ id, name: v.name, revenue: v.revenue, quantity: v.quantity }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Live stats (last 30 min)
    const liveStart = new Date(Date.now() - 30 * 60 * 1000);
    const liveOrders = await prisma.order.findMany({ where: { createdAt: { gte: liveStart }, status: { notIn: ['cancelled'] } }, select: { totalPrice: true } });
    const liveRevenue = liveOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);

    // Time series per day (local aggregation)
    function formatDay(d: Date) { return d.toISOString().slice(0,10); }
    const dayMap: Record<string, { revenue: number; orders: number }> = {};
    for (const o of ordersCurrent as any[]) {
      const key = formatDay(new Date(o.createdAt));
      if (!dayMap[key]) dayMap[key] = { revenue: 0, orders: 0 };
      dayMap[key].revenue += o.totalPrice || 0;
      dayMap[key].orders += 1;
    }
    const timeseries = Object.entries(dayMap)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([date, val]) => ({ date, revenue: val.revenue, orders: val.orders, aov: val.orders ? val.revenue/val.orders : 0 }));

    // Hourly heatmap
    const hourBins = Array.from({ length: 24 }, (_, i) => ({ hour: i, revenue: 0, orders: 0 }));
    for (const o of ordersCurrent as any[]) {
      const created = o.createdAt ? new Date(o.createdAt) : null;
      const h = created ? created.getHours() : 0;
      const idx = Math.min(Math.max(h, 0), 23);
      const bin = hourBins[idx]!;
      bin.revenue += o.totalPrice || 0;
      bin.orders += 1;
    }

    // Payment method distribution
    const paymentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end }, status: { notIn: ['cancelled'] } },
      select: { paymentMethod: true, totalPrice: true }
    });
    const paymentMap = new Map<string, { count: number; revenue: number }>();
    for (const o of paymentOrders) {
      const key = (o.paymentMethod || 'unknown').toLowerCase();
      const rec = paymentMap.get(key) || { count: 0, revenue: 0 };
      rec.count += 1; rec.revenue += o.totalPrice || 0;
      paymentMap.set(key, rec);
    }
    const paymentMix = Array.from(paymentMap.entries()).map(([method, v]) => ({ method, count: v.count, revenue: v.revenue }));

    // Category performance via order items
    const catItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: start, lte: end },
          status: { notIn: ['cancelled'] },
          ...(filterPayment ? { paymentMethod: filterPayment } as any : {}),
        }
      },
      select: { quantity: true, price: true, product: { select: { categoryId: true, category: { select: { name: true, id: true } } } } }
    });
    const catMap = new Map<number, { name: string; revenue: number; quantity: number }>();
    for (const it of catItems) {
      const id = it.product?.categoryId;
      if (!id) continue;
      const name = it.product?.category?.name || `Category ${id}`;
      const rec = catMap.get(id) || { name, revenue: 0, quantity: 0 };
      rec.revenue += (it.price || 0) * (it.quantity || 0);
      rec.quantity += it.quantity || 0;
      catMap.set(id, rec);
    }
    const categoryPerformance = Array.from(catMap.entries()).map(([id, v]) => ({ id, name: v.name, revenue: v.revenue, quantity: v.quantity }))
      .sort((a,b)=>b.revenue-a.revenue).slice(0,10);

    // Top customers
    const custMap = new Map<number, { revenue: number; orders: number }>();
    for (const o of ordersCurrent) {
      if (typeof o.customerId !== 'number') continue;
      const rec = custMap.get(o.customerId) || { revenue: 0, orders: 0 };
      rec.revenue += o.totalPrice || 0; rec.orders += 1;
      custMap.set(o.customerId, rec);
    }
    const custIds = Array.from(custMap.keys());
    const custs = custIds.length ? await prisma.customer.findMany({ where: { id: { in: custIds } }, select: { id: true, name: true, email: true } }) : [];
    const topCustomers = custs.map(c => {
      const agg = custMap.get(c.id);
      return { id: c.id, name: c.name, email: c.email, revenue: agg ? agg.revenue : 0, orders: agg ? agg.orders : 0 };
    })
      .sort((a,b)=>b.revenue-a.revenue).slice(0,10);

    // Returns / refunds
    const returns = await prisma.returnRequest.findMany({ where: { createdAt: { gte: start, lte: end } }, select: { refundAmount: true, status: true } });
    const refundsTotal = returns.reduce((s,r)=>s+(r.refundAmount||0),0);

    // Repeat purchase rate
    const repeatCustomers = Array.from(custMap.values()).filter(v => v.orders >= 2).length;
    const repeatRate = distinctCustomersCurrent.size ? (repeatCustomers / distinctCustomersCurrent.size) * 100 : 0;

    // Inventory velocity (qty sold per day)
    const days = Math.max(1, Math.ceil((end.getTime()-start.getTime())/(1000*60*60*24)));
    const velocityMap = new Map<number, { quantity: number }>();
    for (const it of orderItems) {
      const key = (it as any).productId as number;
      const rec = velocityMap.get(key) || { quantity: 0 };
      rec.quantity += it.quantity || 0;
      velocityMap.set(key, rec);
    }
    const inventoryVelocity = Array.from(velocityMap.entries()).map(([productId, v]) => ({ productId, qtyPerDay: v.quantity/days }))
      .sort((a,b)=>b.qtyPerDay-a.qtyPerDay).slice(0,10);

    // Day-of-week heatmap
    const dowMap: Array<{ dow: number; revenue: number; orders: number }> = Array.from({ length: 7 }, (_, i) => ({ dow: i, revenue: 0, orders: 0 }));
    for (const o of ordersCurrent as any[]) {
      const created = o.createdAt ? new Date(o.createdAt) : null;
      const d = created ? created.getDay() : 0;
      const idx = Math.min(Math.max(d, 0), 6);
      const row = dowMap[idx]!;
      row.revenue += o.totalPrice || 0;
      row.orders += 1;
    }

    // Compare timeseries (previous period aligned), if requested
    let compareTimeseries: any[] | undefined;
    if (compare) {
      const prevDayMap: Record<string, { revenue: number; orders: number }> = {};
      for (const o of ordersPrevious as any[]) {
        const k = o.createdAt.toISOString().slice(0,10);
        if (!prevDayMap[k]) prevDayMap[k] = { revenue: 0, orders: 0 };
        prevDayMap[k].revenue += o.totalPrice || 0;
        prevDayMap[k].orders += 1;
      }
      compareTimeseries = Object.entries(prevDayMap)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([date, val]) => ({ date, revenue: val.revenue, orders: val.orders, aov: val.orders ? val.revenue/val.orders : 0 }));
    }

    // Recent orders for live feed (last 30m)
    const recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 30*60*1000) }, status: { notIn: ['cancelled'] } },
      select: { id: true, totalPrice: true, createdAt: true, customer: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const payload = {
      overview: {
        revenue: {
          current: revenueCurrent,
          previous: revenuePrevious,
          growth: growth(revenueCurrent, revenuePrevious),
        },
        orders: {
          current: ordersCountCurrent,
          previous: ordersCountPrevious,
          growth: growth(ordersCountCurrent, ordersCountPrevious),
        },
        customers: {
          current: distinctCustomersCurrent.size,
          previous: distinctCustomersPrev.size,
          growth: growth(distinctCustomersCurrent.size, distinctCustomersPrev.size),
          new: newCount,
          returning: returningCount,
          repeatRate,
        },
        avgOrderValue,
        products: { total: productsTotal, lowStock: productsLow },
        refunds: { total: refundsTotal, count: returns.length },
      },
      live: {
        last30mRevenue: liveRevenue,
        last30mOrders: liveOrders.length,
      },
      topProducts,
      topCustomers,
      categoryPerformance,
      paymentMix,
      timeseries,
      hourlyHeatmap: hourBins,
      dowHeatmap: dowMap,
      compareTimeseries,
      inventoryVelocity,
      timeframe: tf,
      range: { start, end },
      realtime: { last30mRevenue: liveRevenue, last30mOrders: liveOrders.length, recentOrders: recentOrders.map(r => ({ id: r.id, total: r.totalPrice, ts: r.createdAt, customer: r.customer?.name || 'Customer' })) },
      geo: { countries: [] },
      funnel: { view: 0, addToCart: 0, checkout: 0, purchase: ordersCountCurrent },
      cohorts: { periods: [], overallRetention: 0, cohorts: [] },
      filtersEcho: { timeframe: tf, compare, paymentMethod: filterPayment, country: filterCountry, collectionId: filterCollectionId },
    };

    return createOk(payload);
  } catch (e: any) {
    return createError('Failed to fetch analytics', 500, e?.message || 'Unknown error');
  }
}


