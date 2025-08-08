import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/coupons - Get all coupons with analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};
    
    if (status && status !== 'all') {
      where.isActive = status === 'active';
    }
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [coupons, totalCount] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset
      }),
      prisma.coupon.count({ where })
    ]);

    // Calculate analytics for each coupon
    const couponsWithAnalytics = coupons.map((coupon) => {
      return {
        ...coupon,
        usageCount: 0, // Would be calculated from orders
        revenueGenerated: 0, // Would be calculated from orders
        conversionRate: 0, // Would be calculated from analytics
        usageLimit: coupon.maxUses,
        perUserLimit: null,
        minimumOrderValue: 0,
        customerSegments: [],
        productIds: [],
        collectionIds: [],
        isStackable: false,
        channels: ['web'],
        createdBy: 'admin@evenour.co',
        discountValue: coupon.discount,
        startDate: coupon.validFrom?.toISOString().split('T')[0],
        endDate: coupon.validUntil?.toISOString().split('T')[0],
        status: coupon.isActive ? 'active' : 'inactive',
        type: 'percentage',
        name: coupon.code // Fallback if name doesn't exist
      };
    });

    return NextResponse.json({
      coupons: couponsWithAnalytics,
      totalCount,
      hasMore: totalCount > offset + limit
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// POST /api/coupons - Create a new coupon with enterprise features
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      code,
      name,
      type,
      discountValue,
      minimumOrderValue = 0,
      startDate,
      endDate,
      usageLimit,
      isStackable = false
    } = body;

    // Validate required fields
    if (!code || !name || !type || discountValue === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 409 }
      );
    }

    // Create the coupon
    const couponData: any = {
      code: code.toUpperCase(),
      discount: discountValue,
      maxUses: usageLimit,
      validFrom: startDate ? new Date(startDate) : new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (endDate) {
      couponData.validUntil = new Date(endDate);
    }

    const coupon = await prisma.coupon.create({
      data: couponData
    });

    return NextResponse.json({
      success: true,
      coupon: {
        ...coupon,
        name,
        type,
        minimumOrderValue,
        isStackable,
        usageCount: 0,
        revenueGenerated: 0,
        conversionRate: 0,
        status: 'active'
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}

// PATCH /api/coupons - Bulk operations
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, couponIds } = body;

    if (!action || !couponIds || !Array.isArray(couponIds)) {
      return NextResponse.json(
        { error: "Invalid bulk operation request" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'activate':
        result = await prisma.coupon.updateMany({
          where: { id: { in: couponIds } },
          data: { isActive: true, updatedAt: new Date() }
        });
        break;

      case 'deactivate':
        result = await prisma.coupon.updateMany({
          where: { id: { in: couponIds } },
          data: { isActive: false, updatedAt: new Date() }
        });
        break;

      case 'delete':
        result = await prisma.coupon.deleteMany({
          where: { id: { in: couponIds } }
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid bulk action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      affected: result.count,
      action
    });

  } catch (error) {
    console.error("Error performing bulk operation:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk operation" },
      { status: 500 }
    );
  }
}