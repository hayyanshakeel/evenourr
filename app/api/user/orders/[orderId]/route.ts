import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const result = await verifyFirebaseUser(request);
    if (result.error) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status || 401 }
      );
    }
    const user = result.user;

    const { orderId } = await context.params;
    const orderIdNum = parseInt(orderId);
    if (isNaN(orderIdNum)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderIdNum,
        customerId: user.uid,
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
