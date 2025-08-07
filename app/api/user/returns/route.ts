import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import prisma from '@/lib/db';

// GET /api/user/returns - Get user's returns
export async function GET(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if (result.error) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status || 401 }
      );
    }
    const user = result.user;

    const returns = await prisma.returnRequest.findMany({
      where: {
        OR: [
          { userId: parseInt(user.uid) },
          { customerId: parseInt(user.uid) }
        ]
      },
      include: {
        returnItems: {
          include: {
            product: true,
            variant: true,
          },
        },
        order: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedReturns = returns.map((returnItem: any) => ({
      id: returnItem.id,
      rmaNumber: returnItem.rmaNumber,
      orderId: returnItem.order.id,
      status: returnItem.status,
      reason: returnItem.reason,
      description: returnItem.description,
      refundAmount: returnItem.refundAmount,
      createdAt: returnItem.createdAt,
      updatedAt: returnItem.updatedAt,
      adminNotes: returnItem.adminNotes,
      returnItems: returnItem.returnItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        orderItem: {
          id: item.id,
          price: item.unitPrice,
          product: {
            id: item.product.id,
            name: item.product.name,
            imageUrl: item.product.imageUrl,
          },
          variant: item.variant ? {
            id: item.variant.id,
            title: item.variant.title,
          } : null,
        },
      })),
    }));

    return NextResponse.json({
      success: true,
      returns: formattedReturns,
    });
  } catch (error) {
    console.error('Error fetching user returns:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user/returns - Create new return request
export async function POST(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if (result.error) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status || 401 }
      );
    }
    const user = result.user;

    const { orderId, reason, description, returnItems } = await request.json();

    if (!orderId || !reason || !returnItems || returnItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the order belongs to the user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: user.uid,
      },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          }
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is eligible for return (delivered and within return window)
    if (order.status !== 'delivered') {
      return NextResponse.json(
        { success: false, message: 'Order must be delivered to request a return' },
        { status: 400 }
      );
    }

    const deliveryDate = new Date(order.updatedAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    if (deliveryDate < thirtyDaysAgo) {
      return NextResponse.json(
        { success: false, message: 'Return window has expired (30 days)' },
        { status: 400 }
      );
    }

    // Validate return items and prepare for creation
    const validatedReturnItems = [];
    let totalRefundAmount = 0;

    for (const returnItem of returnItems) {
      const orderItem = order.orderItems.find((oi: any) => oi.id === returnItem.orderItemId);
      if (!orderItem) {
        return NextResponse.json(
          { success: false, message: `Order item ${returnItem.orderItemId} not found` },
          { status: 400 }
        );
      }

      if (returnItem.quantity > orderItem.quantity) {
        return NextResponse.json(
          { success: false, message: `Cannot return more than ordered quantity` },
          { status: 400 }
        );
      }

      const itemRefund = orderItem.price * returnItem.quantity;
      totalRefundAmount += itemRefund;

      validatedReturnItems.push({
        productId: orderItem.productId,
        variantId: orderItem.variantId,
        quantity: returnItem.quantity,
        unitPrice: orderItem.price,
        totalPrice: itemRefund,
        productName: orderItem.product.name,
        variantTitle: orderItem.variant?.title,
      });
    }

    // Generate RMA number
    const rmaNumber = `RMA${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create the return
    const newReturn = await prisma.returnRequest.create({
      data: {
        rmaNumber,
        orderId,
        userId: parseInt(user.uid),
        status: 'requested',
        reason,
        reasonCategory: 'other', // You might want to categorize reasons
        description,
        refundAmount: totalRefundAmount,
        returnItems: {
          create: validatedReturnItems,
        },
      },
      include: {
        returnItems: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    const formattedReturn = {
      id: newReturn.id,
      rmaNumber: newReturn.rmaNumber,
      orderId: newReturn.orderId,
      status: newReturn.status,
      reason: newReturn.reason,
      description: newReturn.description,
      refundAmount: newReturn.refundAmount,
      createdAt: newReturn.createdAt,
      updatedAt: newReturn.updatedAt,
      returnItems: newReturn.returnItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        orderItem: {
          id: item.id,
          price: item.unitPrice,
          product: {
            id: item.product.id,
            name: item.product.name,
            imageUrl: item.product.imageUrl,
          },
          variant: item.variant ? {
            id: item.variant.id,
            title: item.variant.title,
          } : null,
        },
      })),
    };

    return NextResponse.json({
      success: true,
      message: 'Return request created successfully',
      return: formattedReturn,
    });
  } catch (error) {
    console.error('Error creating return:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
