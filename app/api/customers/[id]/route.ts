import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }
    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        // Add addresses if you have a relation in your Prisma schema
      }
    });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

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
    // Check if email is being updated and ensure it's unique
    if (body.email) {
      const emailExists = await prisma.customers.findFirst({ where: { email: body.email } });
      if (emailExists && emailExists.id !== customerId) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }
    const updatedCustomer = await prisma.customers.update({
      where: { id: customerId },
      data: body
    });
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Failed to update customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }
    // Check if customer has orders
    const customerOrders = await prisma.orders.findFirst({ where: { customerId } });
    if (customerOrders) {
      return NextResponse.json(
        { error: 'Cannot delete customer with existing orders' },
        { status: 400 }
      );
    }
    await prisma.customers.delete({ where: { id: customerId } });
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Failed to delete customer:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
