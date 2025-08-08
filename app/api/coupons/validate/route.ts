import { NextRequest, NextResponse } from "next/server";
import { IntelligentCouponService } from "@/lib/intelligent-coupon-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponCode, customerId, cartData, context } = body;

    if (!couponCode || !customerId || !cartData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get eligible coupons for this customer and cart
    const eligibleCoupons = await IntelligentCouponService.getEligibleCoupons(
      customerId,
      cartData,
      {
        ...context,
        timestamp: new Date()
      }
    );

    // Find the requested coupon in eligible list
    const requestedCoupon = eligibleCoupons.find(
      ec => ec.coupon.code === couponCode.toUpperCase()
    );

    if (!requestedCoupon) {
      return NextResponse.json({
        valid: false,
        reason: "Coupon is not eligible for your cart or profile",
        suggestions: eligibleCoupons.slice(0, 3).map(ec => ({
          code: ec.coupon.code,
          discount: ec.coupon.discount,
          message: ec.personalizedMessage
        }))
      });
    }

    // Validate the specific coupon with advanced rules
    const validation = await IntelligentCouponService.validateCouponRules(
      requestedCoupon.coupon.id,
      customerId,
      cartData,
      {
        ...context,
        timestamp: new Date()
      }
    );

    if (validation.fraudRisk) {
      // Log fraud attempt
      console.warn(`Fraud risk detected for coupon ${couponCode} by customer ${customerId}`);
      
      return NextResponse.json({
        valid: false,
        reason: "Unable to apply coupon at this time",
        fraudRisk: true
      });
    }

    return NextResponse.json({
      valid: validation.valid,
      reason: validation.reason,
      coupon: requestedCoupon.coupon,
      personalizedMessage: requestedCoupon.personalizedMessage,
      autoApply: requestedCoupon.autoApply,
      discountAmount: IntelligentCouponService.calculateCouponValue(
        requestedCoupon.coupon, 
        cartData.total
      )
    });

  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}

// GET /api/coupons/validate - Get all eligible coupons for customer/cart
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const cartTotal = parseFloat(searchParams.get('cartTotal') || '0');
    const cartQuantity = parseInt(searchParams.get('cartQuantity') || '0');
    const categories = searchParams.get('categories')?.split(',') || [];

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const cartData = {
      items: [], // Would be populated from actual cart
      total: cartTotal,
      quantity: cartQuantity,
      categories
    };

    const context = {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date()
    };

    // Get all eligible coupons
    const eligibleCoupons = await IntelligentCouponService.getEligibleCoupons(
      customerId,
      cartData,
      context
    );

    // Get customer segments for additional context
    const customerSegments = await IntelligentCouponService.getCustomerSegment(customerId);

    return NextResponse.json({
      success: true,
      eligibleCoupons: eligibleCoupons.map(ec => ({
        ...ec.coupon,
        personalizedMessage: ec.personalizedMessage,
        autoApply: ec.autoApply,
        estimatedSavings: IntelligentCouponService.calculateCouponValue(ec.coupon, cartTotal)
      })),
      customerSegments,
      recommendations: {
        bestValue: eligibleCoupons[0] || null,
        autoApply: eligibleCoupons.find(ec => ec.autoApply) || null
      }
    });

  } catch (error) {
    console.error("Error getting eligible coupons:", error);
    return NextResponse.json(
      { error: "Failed to get eligible coupons" },
      { status: 500 }
    );
  }
}
