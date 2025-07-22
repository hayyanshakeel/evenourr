import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { orders, orderItems, customers } from '@/lib/schema';
import { eq, desc, and, or, like, gte, lte } from 'drizzle-orm';

/**
 * GET /api/orders - Fetch all orders with filters
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const financialStatus = searchParams.get('financialStatus');
    const fulfillmentStatus = searchParams.get('fulfillmentStatus');
    const customerId = searchParams.get('customerId');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    
    if (status) {
      conditions.push(eq(orders.status, status));
    }
    
    if (financialStatus) {
      conditions.push(eq(orders.financialStatus, financialStatus));
    }
    
    if (fulfillmentStatus) {
      conditions.push(eq(orders.fulfillmentStatus, fulfillmentStatus));
    }
    
    if (customerId) {
      conditions.push(eq(orders.customerId, parseInt(customerId)));
    }
    
    if (search) {
      conditions.push(
        or(
          like(orders.orderNumber, `%${search}%`),
          like(orders.email, `%${search}%`),
          like(orders.shippingFirstName, `%${search}%`),
          like(orders.shippingLastName, `%${search}%`)
        )
      );
    }
    
    if (startDate) {
      conditions.push(gte(orders.createdAt, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(orders.createdAt, endDate));
    }

    // Fetch orders
    const allOrders = await db
      .select()
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: orders.id })
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    const totalCount = totalCountResult.length;

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        return {
          ...order,
          items
        };
      })
    );

    return NextResponse.json({
      orders: ordersWithItems,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

/**
 * POST /api/orders - Create a new order
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      email,
      phone,
      items,
      shippingAddress,
      billingAddress,
      note,
      tags
    } = body;

    // Validate required fields
    if (!email || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Email and items are required' },
        { status: 400 }
      );
    }

    // Calculate order totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const newOrderResult = await db
      .insert(orders)
      .values({
        orderNumber,
        customerId: customerId || null,
        email,
        phone,
        subtotal,
        total: subtotal, // Add tax, shipping, and discounts later
        note,
        tags: tags ? JSON.stringify(tags) : null,
        // Shipping address
        shippingFirstName: shippingAddress?.firstName,
        shippingLastName: shippingAddress?.lastName,
        shippingCompany: shippingAddress?.company,
        shippingAddress1: shippingAddress?.address1,
        shippingAddress2: shippingAddress?.address2,
        shippingCity: shippingAddress?.city,
        shippingProvince: shippingAddress?.province,
        shippingCountry: shippingAddress?.country,
        shippingZip: shippingAddress?.zip,
        // Billing address
        billingFirstName: billingAddress?.firstName || shippingAddress?.firstName,
        billingLastName: billingAddress?.lastName || shippingAddress?.lastName,
        billingCompany: billingAddress?.company || shippingAddress?.company,
        billingAddress1: billingAddress?.address1 || shippingAddress?.address1,
        billingAddress2: billingAddress?.address2 || shippingAddress?.address2,
        billingCity: billingAddress?.city || shippingAddress?.city,
        billingProvince: billingAddress?.province || shippingAddress?.province,
        billingCountry: billingAddress?.country || shippingAddress?.country,
        billingZip: billingAddress?.zip || shippingAddress?.zip
      })
      .returning();

    if (!newOrderResult || newOrderResult.length === 0) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const newOrder = newOrderResult[0]!;

    // Create order items
    const orderItemsData = items.map((item: any) => ({
      orderId: newOrder.id,
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      variantTitle: item.variantTitle,
      sku: item.sku,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      quantity: item.quantity,
      properties: item.properties ? JSON.stringify(item.properties) : null
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Update customer stats if customerId exists
    if (customerId) {
      const customerResult = await db
        .select()
        .from(customers)
        .where(eq(customers.id, customerId))
        .limit(1);

      if (customerResult.length > 0) {
        const customer = customerResult[0]!;
        await db
          .update(customers)
          .set({
            totalSpent: (customer.totalSpent || 0) + subtotal,
            ordersCount: (customer.ordersCount || 0) + 1,
            updatedAt: new Date().toISOString()
          })
          .where(eq(customers.id, customerId));
      }
    }

    // Fetch the complete order with items
    const completeOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, newOrder.id))
      .limit(1);

    const orderItemsList = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, newOrder.id));

    return NextResponse.json(
      {
        ...completeOrder[0],
        items: orderItemsList
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
