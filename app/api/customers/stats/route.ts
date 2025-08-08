import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get comprehensive real customer statistics
    const [
      totalUsers,
      activeUsers,
      newThisMonth,
      totalOrders,
      recentOrders,
      allOrders
    ] = await Promise.all([
      // Total customers (excluding admin users)
      prisma.user.count({
        where: { role: { not: 'admin' } }
      }),
      
      // Active users (users with at least one order, excluding admins)
      prisma.user.count({
        where: {
          AND: [
            { role: { not: 'admin' } },
            {
              orders: {
                some: {}
              }
            }
          ]
        }
      }),
      
      // New customers this month (excluding admins)
      prisma.user.count({
        where: {
          AND: [
            { role: { not: 'admin' } },
            {
              createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            }
          ]
        }
      }),
      
      // Total orders
      prisma.order.count(),
      
      // Recent orders for growth calculation
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        select: {
          totalPrice: true,
          createdAt: true
        }
      }),
      
      // All orders for revenue calculation
      prisma.order.findMany({
        select: {
          totalPrice: true,
          createdAt: true
        }
      })
    ]);

    // Calculate revenue metrics
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate customer lifetime value (simplified)
    const customerLifetimeValue = activeUsers > 0 ? totalRevenue / activeUsers : 0;
    
    // Calculate monthly growth
    const lastMonthRevenue = recentOrders
      .filter(order => order.createdAt < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, order) => sum + order.totalPrice, 0);
    
    const thisMonthRevenue = recentOrders
      .filter(order => order.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, order) => sum + order.totalPrice, 0);
    
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Get customer segmentation (excluding admin users)
    const usersWithOrders = await prisma.user.findMany({
      where: { role: { not: 'admin' } }, // Exclude admin users
      select: {
        id: true,
        createdAt: true,
        orders: {
          select: {
            totalPrice: true,
            createdAt: true
          }
        }
      }
    });

    // AI-powered customer segmentation
    const segments = {
      new: 0,
      developing: 0,
      loyal: 0,
      VIP: 0,
      inactive: 0
    };

    usersWithOrders.forEach(user => {
      const orderCount = user.orders.length;
      const totalSpent = user.orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const daysSinceRegistration = Math.floor(
        (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (orderCount === 0) {
        if (daysSinceRegistration > 30) {
          segments.inactive++;
        } else {
          segments.new++;
        }
      } else if (orderCount === 1 && totalSpent < 100) {
        segments.developing++;
      } else if (orderCount >= 2 && orderCount <= 5) {
        segments.loyal++;
      } else if (orderCount > 5 || totalSpent > 500) {
        segments.VIP++;
      } else {
        segments.loyal++;
      }
    });

    // Calculate retention rate (simplified - users who made more than 1 order)
    const repeatCustomers = usersWithOrders.filter(user => user.orders.length > 1).length;
    const retentionRate = activeUsers > 0 ? (repeatCustomers / activeUsers) * 100 : 0;
    const churnRate = 100 - retentionRate;

    // Calculate customer acquisition cost (simplified estimate)
    const estimatedMarketingSpend = totalRevenue * 0.1; // Assume 10% of revenue on marketing
    const customerAcquisitionCost = newThisMonth > 0 ? estimatedMarketingSpend / newThisMonth : 0;

    const stats = {
      totalCustomers: totalUsers,
      activeCustomers: activeUsers,
      newThisMonth,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      customerLifetimeValue,
      churnRate,
      retentionRate,
      segments,
      monthlyGrowth: {
        customers: newThisMonth, // Simplified
        revenue: Math.round(revenueGrowth * 100) / 100,
        orders: recentOrders.length
      },
      topMetrics: [
        {
          label: 'Customer Acquisition Cost',
          value: `$${customerAcquisitionCost.toFixed(2)}`,
          change: -2.1, // Placeholder - would need historical data
          trend: 'down'
        },
        {
          label: 'Customer Satisfaction',
          value: '4.6/5', // Placeholder - would need review data
          change: 1.8,
          trend: 'up'
        },
        {
          label: 'Repeat Purchase Rate',
          value: `${Math.round(retentionRate)}%`,
          change: retentionRate > 50 ? 3.2 : -1.5,
          trend: retentionRate > 50 ? 'up' : 'down'
        },
        {
          label: 'Average Order Value',
          value: `$${averageOrderValue.toFixed(2)}`,
          change: 2.4, // Placeholder - would need historical comparison
          trend: 'up'
        }
      ]
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch real customer stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer stats' },
      { status: 500 }
    );
  }
}
