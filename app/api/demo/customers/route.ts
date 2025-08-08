import { NextRequest, NextResponse } from 'next/server';

// Demo customer data
const demoCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date('2024-01-15'),
    totalOrders: 12,
    totalSpent: 1450.50,
    lastOrderDate: new Date('2024-07-20'),
    status: 'active',
    segment: 'VIP',
    lifetimeValue: 1450.50,
    averageOrderValue: 120.88,
    riskScore: 0.1,
    churnProbability: 15,
    engagement: 85
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    createdAt: new Date('2024-02-10'),
    totalOrders: 8,
    totalSpent: 890.25,
    lastOrderDate: new Date('2024-07-15'),
    status: 'active',
    segment: 'loyal',
    lifetimeValue: 890.25,
    averageOrderValue: 111.28,
    riskScore: 0.2,
    churnProbability: 25,
    engagement: 75
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    createdAt: new Date('2024-03-05'),
    totalOrders: 3,
    totalSpent: 245.80,
    lastOrderDate: new Date('2024-06-10'),
    status: 'at_risk',
    segment: 'developing',
    lifetimeValue: 245.80,
    averageOrderValue: 81.93,
    riskScore: 0.7,
    churnProbability: 65,
    engagement: 35
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    createdAt: new Date('2024-04-12'),
    totalOrders: 1,
    totalSpent: 75.99,
    lastOrderDate: new Date('2024-04-12'),
    status: 'inactive',
    segment: 'new',
    lifetimeValue: 75.99,
    averageOrderValue: 75.99,
    riskScore: 0.9,
    churnProbability: 85,
    engagement: 15
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@example.com',
    createdAt: new Date('2024-01-20'),
    totalOrders: 25,
    totalSpent: 3200.75,
    lastOrderDate: new Date('2024-07-25'),
    status: 'active',
    segment: 'VIP',
    lifetimeValue: 3200.75,
    averageOrderValue: 128.03,
    riskScore: 0.05,
    churnProbability: 8,
    engagement: 95
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filter customers based on search
    let filteredCustomers = demoCustomers;
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredCustomers = demoCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const paginatedCustomers = filteredCustomers.slice(offset, offset + limit);

    // Format response to match expected structure
    const response = {
      customers: paginatedCustomers,
      total: filteredCustomers.length,
      hasMore: (offset + limit) < filteredCustomers.length
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch demo customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
