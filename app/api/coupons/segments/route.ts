import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/coupons/segments - Get customer segments for coupon targeting
export async function GET(request: NextRequest) {
  try {
    // Get real user data to calculate segments
    const users = await prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalPrice: true,
            createdAt: true
          }
        }
      }
    });

    const now = new Date();
    
    // Calculate real segments
    const newUsers = users.filter(user => {
      const daysSinceSignup = (now.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceSignup <= 30 && user.orders.length <= 1;
    });

    const returningUsers = users.filter(user => {
      const daysSinceSignup = (now.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceSignup > 30 && user.orders.length >= 2;
    });

    const highValueCustomers = users.filter(user => {
      const totalSpent = user.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      return totalSpent > 1000; // High value threshold: $1000+
    });

    const loyalCustomers = users.filter(user => {
      return user.orders.length >= 2; // Customers with 2+ orders
    });

    const cartAbandoners = users.filter(user => {
      const lastOrderDate = user.orders.length > 0 
        ? new Date(Math.max(...user.orders.map(o => new Date(o.createdAt).getTime())))
        : null;
      const daysSinceLastOrder = lastOrderDate 
        ? (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
        : Infinity;
      return daysSinceLastOrder > 7 && user.orders.length > 0;
    });

    const dormantCustomers = users.filter(user => {
      const lastOrderDate = user.orders.length > 0 
        ? new Date(Math.max(...user.orders.map(o => new Date(o.createdAt).getTime())))
        : null;
      const daysSinceLastOrder = lastOrderDate 
        ? (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
        : Infinity;
      return daysSinceLastOrder > 30;
    });

    const segments = [
      { 
        id: 'new_user', 
        name: 'New Users', 
        count: newUsers.length, 
        description: 'First-time customers (≤30 days, ≤1 order)' 
      },
      { 
        id: 'returning_user', 
        name: 'Returning Users', 
        count: returningUsers.length, 
        description: 'Established customers (>30 days, 2+ orders)' 
      },
      { 
        id: 'high_value_customer', 
        name: 'High Value', 
        count: highValueCustomers.length, 
        description: 'Customers with $1000+ lifetime value' 
      },
      { 
        id: 'loyal_customer', 
        name: 'Loyal Customers', 
        count: loyalCustomers.length, 
        description: 'Customers with 2+ successful orders' 
      },
      { 
        id: 'cart_abandoner', 
        name: 'Cart Abandoners', 
        count: cartAbandoners.length, 
        description: 'Last order >7 days ago' 
      },
      { 
        id: 'dormant_customer', 
        name: 'Dormant Users', 
        count: dormantCustomers.length, 
        description: 'No orders in 30+ days' 
      }
    ];

    return NextResponse.json(segments);
  } catch (error) {
    console.error("Error fetching customer segments:", error);
    
    // Return empty segments as fallback
    const fallbackSegments = [
      { id: 'new_user', name: 'New Users', count: 0, description: 'First-time customers' },
      { id: 'returning_user', name: 'Returning Users', count: 0, description: 'Customers with 1+ orders' },
      { id: 'high_value_customer', name: 'High Value', count: 0, description: 'Customers with high lifetime value' },
      { id: 'loyal_customer', name: 'Loyal Customers', count: 0, description: 'Customers with 2+ successful orders' },
      { id: 'cart_abandoner', name: 'Cart Abandoners', count: 0, description: 'Added items but no order in 7 days' },
      { id: 'dormant_customer', name: 'Dormant Users', count: 0, description: 'No orders in 30+ days' }
    ];
    
    return NextResponse.json(fallbackSegments);
  }
}
