import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import prisma from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, just log the analytics data
    // In production, you might want to store this in a database or send to an analytics service
    console.log('Analytics behavior data:', {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      data: body
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing analytics behavior:', error);
    return NextResponse.json({ error: 'Failed to process analytics data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dateRange = parseInt(searchParams.get('dateRange') || '7');
    
    const now = new Date();
    const startDate = new Date(now.getTime() - dateRange * 24 * 60 * 60 * 1000);

    // Fetch real behavioral analytics data
    const [
      totalUsers,
      activeUsers,
      totalOrders,
      totalRevenue,
      allCustomers,
      allCarts,
      completedOrders
    ] = await Promise.all([
      // Total users
      prisma.customer.count(),
      
      // Active users (customers with recent orders)
      prisma.customer.count({
        where: {
          orders: {
            some: {
              createdAt: { gte: startDate }
            }
          }
        }
      }),
      
      // Total orders in period
      prisma.order.count({
        where: { 
          createdAt: { gte: startDate },
          status: { not: 'cancelled' }
        }
      }),
      
      // Total revenue in period
      prisma.order.aggregate({
        where: { 
          createdAt: { gte: startDate },
          status: { not: 'cancelled' }
        },
        _sum: { totalPrice: true }
      }),
      
      // All customers with order data for segmentation
      prisma.customer.findMany({
        include: {
          orders: {
            where: { status: { not: 'cancelled' } },
            select: {
              id: true,
              totalPrice: true,
              createdAt: true
            }
          }
        }
      }),
      
      // Cart data
      prisma.cart.count(),
      
      // Completed orders for conversion calculation
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
          status: 'delivered'
        }
      })
    ]);

    const revenue = totalRevenue._sum.totalPrice || 0;
    const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;
    const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;
    
    // Calculate cart abandonment (estimated)
    const estimatedAbandonedCarts = Math.max(0, allCarts - completedOrders);
    const cartAbandonmentRate = allCarts > 0 ? (estimatedAbandonedCarts / allCarts) * 100 : 0;

    // Customer segmentation based on order history
    const segments = {
      new: 0,
      developing: 0,
      loyal: 0,
      VIP: 0,
      inactive: 0
    };

    const customerLifecycle = allCustomers.map(customer => {
      const orderCount = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const daysSinceSignup = Math.floor((now.getTime() - customer.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const lastOrderDate = customer.orders.length > 0 
        ? Math.max(...customer.orders.map(o => new Date(o.createdAt).getTime()))
        : customer.createdAt.getTime();
      const daysSinceLastOrder = Math.floor((now.getTime() - lastOrderDate) / (1000 * 60 * 60 * 24));

      // Determine segment
      let stage = 'new';
      if (daysSinceLastOrder > 90) {
        stage = 'inactive';
        segments.inactive++;
      } else if (totalSpent > 500000) { // $5000+
        stage = 'VIP';
        segments.VIP++;
      } else if (orderCount >= 5) {
        stage = 'loyal';
        segments.loyal++;
      } else if (orderCount >= 2) {
        stage = 'developing';
        segments.developing++;
      } else {
        segments.new++;
      }

      return {
        id: customer.id,
        firstName: customer.name?.split(' ')[0] || 'Guest',
        lastName: customer.name?.split(' ')[1] || '',
        email: customer.email,
        totalSpent: totalSpent / 100, // Convert cents to dollars
        daysSinceSignup,
        stage
      };
    });

    // AI-generated insights based on real data
    const aiInsights = [
      {
        type: totalOrders < 10 ? 'warning' : 'opportunity',
        title: 'Sales Performance',
        message: `You have ${totalOrders} orders in the last ${dateRange} days`,
        action: totalOrders < 10 ? 'Consider running a promotion to boost sales' : 'Maintain current momentum',
        priority: totalOrders < 10 ? 'high' : 'medium'
      },
      {
        type: cartAbandonmentRate > 70 ? 'alert' : 'opportunity',
        title: 'Cart Abandonment',
        message: `${cartAbandonmentRate.toFixed(1)}% cart abandonment rate`,
        action: cartAbandonmentRate > 70 ? 'Implement cart recovery emails' : 'Good cart conversion rate',
        priority: cartAbandonmentRate > 70 ? 'high' : 'low'
      },
      {
        type: 'opportunity',
        title: 'Customer Engagement',
        message: `${activeUsers} out of ${totalUsers} customers are active`,
        action: 'Focus on reactivating inactive customers',
        priority: 'medium'
      }
    ];

    // Recommendations based on data
    const recommendations = [
      {
        title: 'Increase Customer Retention',
        description: 'Focus on converting developing customers to loyal customers',
        tactics: [
          'Send personalized product recommendations',
          'Offer loyalty program benefits',
          'Create targeted email campaigns',
          'Implement customer feedback surveys'
        ]
      },
      {
        title: 'Reduce Cart Abandonment',
        description: 'Recover potentially lost sales from abandoned carts',
        tactics: [
          'Send cart abandonment emails within 1 hour',
          'Offer limited-time discounts',
          'Simplify checkout process',
          'Display shipping costs early'
        ]
      },
      {
        title: 'Boost Average Order Value',
        description: 'Encourage customers to spend more per transaction',
        tactics: [
          'Implement product bundling',
          'Add upsell suggestions',
          'Offer free shipping thresholds',
          'Create volume discounts'
        ]
      }
    ];

    const behaviorAnalytics = {
      summary: {
        totalUsers,
        activeUsers,
        totalOrders,
        totalRevenue: revenue / 100, // Convert to dollars
        avgOrderValue: avgOrderValue / 100,
        conversionRate,
        cartAbandonmentRate
      },
      segments,
      customerLifecycle: customerLifecycle.slice(0, 20), // Limit for performance
      cartAnalysis: {
        totalCarts: allCarts,
        abandonedCarts: estimatedAbandonedCarts,
        completedCarts: completedOrders,
        abandonmentRate: cartAbandonmentRate
      },
      aiInsights,
      recommendations
    };

    return NextResponse.json(behaviorAnalytics);

  } catch (error) {
    console.error('Error fetching behavioral analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
