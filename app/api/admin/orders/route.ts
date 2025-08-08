import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { ok, fail } from '@/lib/api-error';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard.response) return guard.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const status = searchParams.get('status');
    const validStatuses = ['pending','paid','shipped','delivered','cancelled','refunded'];
    const statusFilter = status && validStatuses.includes(status) ? status : undefined;

    const skip = (page - 1) * limit;
    const where = statusFilter ? { status: statusFilter } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          orderItems: { include: { product: { select: { id: true, name: true, price: true, imageUrl: true } }, variant: { select: { id: true, title: true, price: true, sku: true } } } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    return ok({ orders, pagination: { page, limit, total, hasMore: skip + limit < total } });
  } catch (e:any) {
    console.error('orders.list error', e);
    return fail('INTERNAL_ERROR', 'Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard.response) return guard.response;

  try {
    const body = await request.json();
    const {
      customer,
      status = 'pending',
      totalPrice,
      items = [],
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod,
      taxRate,
      notes,
    } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return fail('VALIDATION_ERROR', 'Order must include at least one item', 400);
    }
    if (typeof totalPrice !== 'number' || Number.isNaN(totalPrice)) {
      return fail('VALIDATION_ERROR', 'totalPrice must be a number', 400);
    }

    // Sanitize items
    const sanitizedItems = items
      .map((i: any) => ({
        isManual: Boolean(i?.isManual),
        productId: i?.productId ? Number(i.productId) : null,
        productName: typeof i?.productName === 'string' && i.productName.trim() ? i.productName.trim() : 'Manual Item',
        variantId: i?.variantId ? Number(i.variantId) : null,
        quantity: Math.max(1, Number(i?.quantity) || 1),
        price: Number(i?.price) || 0,
      }))
      .filter((i: any) => Number.isFinite(i.price));

    if (sanitizedItems.length === 0) {
      return fail('VALIDATION_ERROR', 'At least one item must have a valid price', 400);
    }

    // Ensure customer exists if provided
    let customerRecord = null as any;
    if (customer?.email) {
      customerRecord = await prisma.customer.upsert({
        where: { email: customer.email },
        update: { name: customer.name ?? customer.email },
        create: { email: customer.email, name: customer.name ?? customer.email },
      });
    }

    // Ensure each item has a productId; create a lightweight product if missing
    const preparedItems = [] as Array<{ productId: number; variantId: number | null; quantity: number; price: number }>;
    for (const i of sanitizedItems) {
      let productId = i.productId as number | undefined;
      // If item is not manual and productId is missing -> validation error
      if (!i.isManual && !productId) {
        return fail('VALIDATION_ERROR', 'Please select a product for each non-manual item', 400);
      }
      if (!productId && i.isManual) {
        const name: string = i.productName || 'Manual Item';
        const slugBase = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 40) || 'manual-item';
        let lastErr: any = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const slug = `${slugBase}-${Date.now()}-${Math.floor(Math.random()*100000)}`;
          try {
            const product = await prisma.product.create({
              data: {
                name,
                slug,
                price: Number(i.price) || 0,
                inventory: 0,
                status: 'manual', // mark manual so it won't appear in catalog
              },
            });
            productId = product.id;
            break;
          } catch (e: any) {
            lastErr = e;
            if (e?.code !== 'P2002') { // not unique constraint
              throw e;
            }
          }
        }
        if (!productId) {
          console.error('orders.create error: product create failed after retries');
          throw lastErr || new Error('Failed to create product for order item');
        }
      }
      
      // Ensure productId is defined before using it
      if (!productId) {
        return fail('VALIDATION_ERROR', 'Product ID could not be determined', 400);
      }
      
      preparedItems.push({
        productId,
        variantId: i.variantId ?? null,
        quantity: Math.max(1, Number(i.quantity) || 1),
        price: Number(i.price) || 0,
      });
    }

    const order = await prisma.order.create({
      data: {
        customerId: customerRecord?.id ?? null,
        status,
        totalPrice,
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : null,
        billingAddress: typeof billingAddress === 'string' ? billingAddress : null,
        paymentMethod: typeof paymentMethod === 'string' ? paymentMethod : null,
        shippingMethod: typeof shippingMethod === 'string' ? shippingMethod : null,
        taxRate: typeof taxRate === 'number' ? taxRate : null,
        notes: typeof notes === 'string' ? notes : null,
        orderItems: { create: preparedItems },
      },
      include: { orderItems: true, customer: true },
    });

    return ok(order, { status: 201 });
  } catch (e: any) {
    console.error('orders.create error', e?.code || e?.name || 'ERR', e?.message);
    const message = e?.message || 'Failed to create order';
    return fail('INTERNAL_ERROR', message, 500);
  }
}
