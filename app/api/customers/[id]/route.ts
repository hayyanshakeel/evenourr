import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { customers, customerAddresses, orders } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/customers/[id] - Fetch a single customer by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);

    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    // Fetch customer
    const customerResult = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    if (customerResult.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customer = customerResult[0];

    // Fetch customer addresses
    const addresses = await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.customerId, customerId));

    // Fetch customer orders
    const customerOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt))
      .limit(10); // Last 10 orders

    return NextResponse.json({
      ...customer,
      addresses,
      recentOrders: customerOrders
    });
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

/**
 * PATCH /api/customers/[id] - Update a customer
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    // Check if customer exists
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    if (existingCustomer.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Update customer
    const updatedFields: any = {
      updatedAt: new Date().toISOString()
    };

    // Only update provided fields
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'acceptsMarketing',
      'taxExempt', 'tags', 'note', 'state', 'verifiedEmail'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'acceptsMarketing' || field === 'taxExempt' || field === 'verifiedEmail') {
          updatedFields[field] = body[field] ? 1 : 0;
        } else if (field === 'tags') {
          updatedFields[field] = JSON.stringify(body[field]);
        } else {
          updatedFields[field] = body[field];
        }
      }
    }

    // Check if email is being updated and ensure it's unique
    if (body.email && body.email !== existingCustomer[0]!.email) {
      const emailExists = await db
        .select()
        .from(customers)
        .where(eq(customers.email, body.email))
        .limit(1);

      if (emailExists.length > 0) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }

      updatedFields.email = body.email;
    }

    const updatedCustomer = await db
      .update(customers)
      .set(updatedFields)
      .where(eq(customers.id, customerId))
      .returning();

    // Handle address updates if provided
    if (body.addresses) {
      // Delete existing addresses
      await db.delete(customerAddresses).where(eq(customerAddresses.customerId, customerId));

      // Insert new addresses
      if (body.addresses.length > 0) {
        const addressData = body.addresses.map((address: any, index: number) => ({
          customerId,
          firstName: address.firstName || updatedCustomer[0]!.firstName,
          lastName: address.lastName || updatedCustomer[0]!.lastName,
          company: address.company,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          province: address.province,
          country: address.country,
          zip: address.zip,
          phone: address.phone || updatedCustomer[0]!.phone,
          isDefault: index === 0 ? 1 : 0
        }));

        await db.insert(customerAddresses).values(addressData);
      }
    }

    // Fetch updated addresses
    const addresses = await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.customerId, customerId));

    return NextResponse.json({
      ...updatedCustomer[0],
      addresses
    });
  } catch (error) {
    console.error('Failed to update customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

/**
 * DELETE /api/customers/[id] - Delete a customer
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);

    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    // Check if customer exists
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    if (existingCustomer.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check if customer has orders
    const customerOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .limit(1);

    if (customerOrders.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete customer with existing orders' },
        { status: 400 }
      );
    }

    // Delete customer addresses first
    await db.delete(customerAddresses).where(eq(customerAddresses.customerId, customerId));

    // Delete customer
    await db.delete(customers).where(eq(customers.id, customerId));

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Failed to delete customer:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
