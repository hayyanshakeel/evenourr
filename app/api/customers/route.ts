import { NextRequest, NextResponse } from 'next/server';

// Mock customers data for now
const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0124',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1-555-0125',
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString()
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '+1-555-0126',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    phone: '+1-555-0127',
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    // Return mock customers sorted by creation date (newest first)
    const sortedCustomers = [...mockCustomers].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json(sortedCustomers, { status: 200 });
  } catch (error) {
    console.error('API Error /api/customers:', error);
    return NextResponse.json({ message: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating new customer:', body);

    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if customer already exists in mock data
    const existingCustomer = mockCustomers.find(customer => customer.email === email);

    if (existingCustomer) {
      return NextResponse.json({ error: 'Customer with this email already exists' }, { status: 400 });
    }

    // Create new customer with mock data
    const newCustomer = {
      id: Date.now(), // Simple ID generation for mock
      name,
      email,
      phone: body.phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock data (in a real app this would persist to database)
    mockCustomers.push(newCustomer);

    console.log('Customer created successfully:', newCustomer.id);
    return NextResponse.json({ 
      id: newCustomer.id, 
      message: 'Customer created successfully',
      customer: newCustomer 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}