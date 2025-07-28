import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';

export async function GET(request: NextRequest) {
  try {
    const allCustomers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error('API Error /api/customers:', error);
    return NextResponse.json({ message: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating new customer:', body);

    const {
      name,
      email,
      phone,
      notes,
      tags,
      addresses,
      marketingEmails,
      marketingSms,
      language,
      taxExempt,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email }
    });

    if (existingCustomer) {
      return NextResponse.json({ error: 'Customer with this email already exists' }, { status: 400 });
    }

    // Create the customer
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        // Note: The current schema only has name and email
        // Additional fields like phone, notes, etc. would need schema updates
      }
    });

    console.log('Customer created successfully:', customer.id);
    return NextResponse.json({ 
      id: customer.id, 
      message: 'Customer created successfully',
      customer 
    });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}