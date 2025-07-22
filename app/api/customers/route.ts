import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { customers, customerAddresses, orders } from '@/lib/schema';
import { eq, desc, or, like, and } from 'drizzle-orm';

/**
 * GET /api/customers - Fetch all customers with filters
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const state = searchParams.get('state');
    const acceptsMarketing = searchParams.get('acceptsMarketing');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(customers.email, `%${search}%`),
          like(customers.firstName, `%${search}%`),
          like(customers.lastName, `%${search}%`),
          like(customers.phone, `%${search}%`)
        )
      );
    }
    
    if (state) {
      conditions.push(eq(customers.state, state));
    }
    
    if (acceptsMarketing !== null) {
      conditions.push(eq(customers.acceptsMarketing, acceptsMarketing === 'true' ? 1 : 0));
    }

    // Fetch customers
    const allCustomers = await db
      .select()
      .from(customers)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(customers.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: customers.id })
      .from(customers)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    const totalCount = totalCountResult.length;

    // Fetch addresses for each customer
    const customersWithAddresses = await Promise.all(
      allCustomers.map(async (customer) => {
        const addresses = await db
          .select()
          .from(customerAddresses)
          .where(eq(customerAddresses.customerId, customer.id));
        
        return {
          ...customer,
          addresses
        };
      })
    );

    return NextResponse.json({
      customers: customersWithAddresses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

/**
 * POST /api/customers - Create a new customer
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      phone,
      password,
      acceptsMarketing,
      taxExempt,
      tags,
      note,
      addresses
    } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if customer already exists
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    if (existingCustomer.length > 0) {
      return NextResponse.json({ error: 'Customer with this email already exists' }, { status: 400 });
    }

    // Create customer
    const newCustomerResult = await db
      .insert(customers)
      .values({
        email,
        firstName,
        lastName,
        phone,
        password, // Should be hashed in production
        acceptsMarketing: acceptsMarketing ? 1 : 0,
        taxExempt: taxExempt ? 1 : 0,
        tags: tags ? JSON.stringify(tags) : null,
        note,
        verifiedEmail: 0,
        state: 'enabled'
      })
      .returning();

    if (!newCustomerResult || newCustomerResult.length === 0) {
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }

    const newCustomer = newCustomerResult[0]!;

    // Create addresses if provided
    if (addresses && addresses.length > 0) {
      const addressData = addresses.map((address: any, index: number) => ({
        customerId: newCustomer.id,
        firstName: address.firstName || firstName,
        lastName: address.lastName || lastName,
        company: address.company,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
        phone: address.phone || phone,
        isDefault: index === 0 ? 1 : 0
      }));

      await db.insert(customerAddresses).values(addressData);
    }

    // Fetch the complete customer with addresses
    const customerAddressesList = await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.customerId, newCustomer.id));

    return NextResponse.json(
      {
        ...newCustomer,
        addresses: customerAddressesList
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
