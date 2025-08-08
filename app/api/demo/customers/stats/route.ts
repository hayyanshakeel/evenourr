import { NextRequest, NextResponse } from 'next/server';

// Demo customer stats
const demoStats = {
  totalCustomers: 1250,
  activeCustomers: 845,
  newThisMonth: 127,
  totalOrders: 3240,
  totalRevenue: 245670.50,
  averageOrderValue: 142.35,
  customerLifetimeValue: 456.78,
  churnRate: 12.5,
  retentionRate: 87.5,
  segments: {
    new: 420,
    developing: 280,
    loyal: 350,
    VIP: 140,
    inactive: 60
  },
  monthlyGrowth: {
    customers: 8.3,
    revenue: 12.7,
    orders: 15.2
  },
  topMetrics: [
    {
      label: 'Customer Acquisition Cost',
      value: '$45.20',
      change: -5.2,
      trend: 'down'
    },
    {
      label: 'Customer Satisfaction',
      value: '4.7/5',
      change: 3.1,
      trend: 'up'
    },
    {
      label: 'Repeat Purchase Rate',
      value: '68%',
      change: 2.8,
      trend: 'up'
    },
    {
      label: 'Average Time to Purchase',
      value: '3.2 days',
      change: -1.5,
      trend: 'down'
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(demoStats);
  } catch (error) {
    console.error('Failed to fetch demo customer stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer stats' },
      { status: 500 }
    );
  }
}
