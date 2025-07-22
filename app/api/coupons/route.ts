import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { coupons, couponUsage } from '@/lib/schema';
import { eq, desc, and, or, like, gte, lte } from 'drizzle-orm';

/**
 * GET /api/coupons - Fetch all coupons with filters
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const discountType = searchParams.get('discountType');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    
    if (status) {
      conditions.push(eq(coupons.status, status));
    }
    
    if (discountType) {
      conditions.push(eq(coupons.discountType, discountType));
    }
    
    if (search) {
      conditions.push(
        or(
          like(coupons.code, `%${search}%`),
          like(coupons.description, `%${search}%`)
        )
      );
    }

    // For active coupons, exclude expired ones
    if (status === 'active') {
      const now = new Date().toISOString();
      // We'll filter expired coupons in the post-processing step
      // since SQLite doesn't handle NULL comparisons well with OR
    }

    // Fetch coupons
    const allCoupons = await db
      .select()
      .from(coupons)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(coupons.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: coupons.id })
      .from(coupons)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    const totalCount = totalCountResult.length;

    // Calculate usage statistics for each coupon
    const couponsWithStats = await Promise.all(
      allCoupons.map(async (coupon) => {
        const usageStats = await db
          .select({ count: couponUsage.id })
          .from(couponUsage)
          .where(eq(couponUsage.couponId, coupon.id));

        return {
          ...coupon,
          remainingUses: coupon.usageLimit ? coupon.usageLimit - (coupon.usageCount || 0) : null,
          isExpired: coupon.endsAt ? new Date(coupon.endsAt) < new Date() : false,
          isActive: coupon.status === 'active' && 
                   (!coupon.endsAt || new Date(coupon.endsAt) >= new Date()) &&
                   (!coupon.startsAt || new Date(coupon.startsAt) <= new Date())
        };
      })
    );

    return NextResponse.json({
      coupons: couponsWithStats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch coupons:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

/**
 * POST /api/coupons - Create a new coupon
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumPurchase,
      usageLimit,
      usageLimitPerCustomer,
      appliesToProducts,
      appliesToCategories,
      excludeProducts,
      customerEligibility,
      eligibleCustomers,
      startsAt,
      endsAt
    } = body;

    // Validate required fields
    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: 'Code, discount type, and discount value are required' },
        { status: 400 }
      );
    }

    // Validate discount type
    if (!['percentage', 'fixed_amount', 'free_shipping'].includes(discountType)) {
      return NextResponse.json(
        { error: 'Invalid discount type' },
        { status: 400 }
      );
    }

    // Validate discount value
    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existingCoupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code.toUpperCase()))
      .limit(1);

    if (existingCoupon.length > 0) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    // Create coupon
    const [newCoupon] = await db
      .insert(coupons)
      .values({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minimumPurchase: minimumPurchase || null,
        usageLimit: usageLimit || null,
        usageLimitPerCustomer: usageLimitPerCustomer || null,
        status: 'active',
        appliesToProducts: appliesToProducts ? JSON.stringify(appliesToProducts) : null,
        appliesToCategories: appliesToCategories ? JSON.stringify(appliesToCategories) : null,
        excludeProducts: excludeProducts ? JSON.stringify(excludeProducts) : null,
        customerEligibility: customerEligibility || 'all',
        eligibleCustomers: eligibleCustomers ? JSON.stringify(eligibleCustomers) : null,
        startsAt: startsAt || null,
        endsAt: endsAt || null
      })
      .returning();

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error) {
    console.error('Failed to create coupon:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}

/**
 * POST /api/coupons/validate - Validate a coupon code
 */
export async function validateCoupon(request: Request) {
  try {
    const body = await request.json();
    const { code, customerId, cartTotal, productIds } = body;

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    // Fetch coupon
    const couponResult = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code.toUpperCase()))
      .limit(1);

    if (couponResult.length === 0) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    }

    const coupon = couponResult[0]!;
    const now = new Date();

    // Check if coupon is active
    if (coupon.status !== 'active') {
      return NextResponse.json({ error: 'Coupon is not active' }, { status: 400 });
    }

    // Check date validity
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return NextResponse.json({ error: 'Coupon is not yet valid' }, { status: 400 });
    }

    if (coupon.endsAt && new Date(coupon.endsAt) < now) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }

    // Check customer-specific usage limit
    if (customerId && coupon.usageLimitPerCustomer) {
      const customerUsage = await db
        .select({ count: couponUsage.id })
        .from(couponUsage)
        .where(
          and(
            eq(couponUsage.couponId, coupon.id),
            eq(couponUsage.customerId, customerId)
          )
        );

      if (customerUsage.length >= coupon.usageLimitPerCustomer) {
        return NextResponse.json(
          { error: 'Customer usage limit reached for this coupon' },
          { status: 400 }
        );
      }
    }

    // Check minimum purchase requirement
    if (coupon.minimumPurchase && cartTotal < coupon.minimumPurchase) {
      return NextResponse.json(
        { error: `Minimum purchase of $${coupon.minimumPurchase / 100} required` },
        { status: 400 }
      );
    }

    // Check customer eligibility
    if (coupon.customerEligibility === 'specific_customers' && coupon.eligibleCustomers) {
      const eligibleCustomerIds = JSON.parse(coupon.eligibleCustomers);
      if (!customerId || !eligibleCustomerIds.includes(customerId)) {
        return NextResponse.json(
          { error: 'Customer not eligible for this coupon' },
          { status: 400 }
        );
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.floor(cartTotal * (coupon.discountValue / 100));
    } else if (coupon.discountType === 'fixed_amount') {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    } else if (coupon.discountType === 'free_shipping') {
      // Handle free shipping logic separately
      discountAmount = 0;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        freeShipping: coupon.discountType === 'free_shipping'
      }
    });
  } catch (error) {
    console.error('Failed to validate coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
