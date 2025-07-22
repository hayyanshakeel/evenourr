import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { coupons, couponUsage } from '@/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/coupons/[code] - Fetch a single coupon by code
 */
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.toUpperCase();

    // Fetch coupon
    const couponResult = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1);

    if (couponResult.length === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    const coupon = couponResult[0]!;

    // Get usage statistics
    const usageStats = await db
      .select()
      .from(couponUsage)
      .where(eq(couponUsage.couponId, coupon.id));

    return NextResponse.json({
      ...coupon,
      totalUsage: usageStats.length,
      totalDiscountGiven: usageStats.reduce((sum, usage) => sum + usage.discountAmount, 0),
      remainingUses: coupon.usageLimit ? coupon.usageLimit - (coupon.usageCount || 0) : null,
      isExpired: coupon.endsAt ? new Date(coupon.endsAt) < new Date() : false,
      isActive: coupon.status === 'active' && 
               (!coupon.endsAt || new Date(coupon.endsAt) >= new Date()) &&
               (!coupon.startsAt || new Date(coupon.startsAt) <= new Date())
    });
  } catch (error) {
    console.error('Failed to fetch coupon:', error);
    return NextResponse.json({ error: 'Failed to fetch coupon' }, { status: 500 });
  }
}

/**
 * PATCH /api/coupons/[code] - Update a coupon
 */
export async function PATCH(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.toUpperCase();
    const body = await request.json();

    // Check if coupon exists
    const existingCoupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1);

    if (existingCoupon.length === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    const couponId = existingCoupon[0]!.id;

    // Update coupon
    const updatedFields: any = {
      updatedAt: new Date().toISOString()
    };

    // Only update provided fields
    const allowedFields = [
      'description', 'discountType', 'discountValue', 'minimumPurchase',
      'usageLimit', 'usageLimitPerCustomer', 'status',
      'appliesToProducts', 'appliesToCategories', 'excludeProducts',
      'customerEligibility', 'eligibleCustomers', 'startsAt', 'endsAt'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (['appliesToProducts', 'appliesToCategories', 'excludeProducts', 'eligibleCustomers'].includes(field)) {
          updatedFields[field] = body[field] ? JSON.stringify(body[field]) : null;
        } else {
          updatedFields[field] = body[field];
        }
      }
    }

    // Validate discount value if being updated
    if (body.discountType === 'percentage' && body.discountValue !== undefined) {
      if (body.discountValue < 0 || body.discountValue > 100) {
        return NextResponse.json(
          { error: 'Percentage discount must be between 0 and 100' },
          { status: 400 }
        );
      }
    }

    // Check if new code is being set and ensure it's unique
    if (body.code && body.code.toUpperCase() !== code) {
      const codeExists = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, body.code.toUpperCase()))
        .limit(1);

      if (codeExists.length > 0) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
      }

      updatedFields.code = body.code.toUpperCase();
    }

    const updatedCoupon = await db
      .update(coupons)
      .set(updatedFields)
      .where(eq(coupons.id, couponId))
      .returning();

    return NextResponse.json(updatedCoupon[0]);
  } catch (error) {
    console.error('Failed to update coupon:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

/**
 * DELETE /api/coupons/[code] - Delete a coupon
 */
export async function DELETE(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.toUpperCase();

    // Check if coupon exists
    const existingCoupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1);

    if (existingCoupon.length === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    const couponId = existingCoupon[0]!.id;

    // Check if coupon has been used
    const usageCount = await db
      .select()
      .from(couponUsage)
      .where(eq(couponUsage.couponId, couponId))
      .limit(1);

    if (usageCount.length > 0) {
      // Instead of deleting, disable the coupon
      await db
        .update(coupons)
        .set({ 
          status: 'disabled',
          updatedAt: new Date().toISOString()
        })
        .where(eq(coupons.id, couponId));

      return NextResponse.json({ 
        message: 'Coupon has been disabled (has usage history)',
        status: 'disabled'
      });
    }

    // Delete coupon if it has never been used
    await db.delete(coupons).where(eq(coupons.id, couponId));

    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Failed to delete coupon:', error);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
