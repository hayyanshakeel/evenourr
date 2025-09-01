import { NextRequest, NextResponse } from 'next/server';
import { verifyEVRAuth } from '@/lib/enterprise-auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const verification = await verifyEVRAuth(request, {
      requiredSecurityLevel: 'standard',
      maxRiskScore: 50
    });
    
    if (!verification.isValid || !verification.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const user = verification.user;

    const { orderId } = await context.params;
    const orderIdNum = parseInt(orderId);
    if (isNaN(orderIdNum)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Convert user.id to number if needed (depending on your schema)
    const customerId = parseInt(user.id);
    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderIdNum,
        customerId: customerId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
            variant: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        returns: {
          select: {
            id: true,
            status: true,
            rmaNumber: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const formattedOrder = {
      id: order.id,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        productId: item.productId,
        variantId: item.variantId,
        product: {
          id: item.product.id,
          name: item.product.name,
          imageUrl: item.product.imageUrl,
        },
        variant: item.variant ? {
          id: item.variant.id,
          title: item.variant.title,
        } : null,
      })),
      returns: order.returns.map((ret: any) => ({
        id: ret.id,
        status: ret.status,
        rmaNumber: ret.rmaNumber,
      })),
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
