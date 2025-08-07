import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { securityHeaders } from '@/lib/security';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  // Remove sensitive logging in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('GET /api/admin/orders - Request received');
    console.log('Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');
  }
  
  // Verify authentication
  const verification = await verifyFirebaseUser(request);
  
  if (!verification.user) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Authentication failed:', verification.error);
    }
    return NextResponse.json(
      { 
        error: verification.error || 'Unauthorized',
        details: 'Please ensure you are logged in and have a valid authentication token'
      },
      { status: verification.status || 401 }
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('User authenticated:', verification.user.email);
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const pageNum = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limitVal = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const statusVal = searchParams.get('status');
    const searchVal = searchParams.get('search');
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Query params:', { page: pageNum, limit: limitVal, status: statusVal, search: searchVal });
    }

    // Manual validation instead of zod schema to avoid validation issues
    const validatedLimit = Math.max(1, Math.min(100, limitVal));
    const validatedOffset = Math.max(0, (pageNum - 1) * validatedLimit);
    // Validate status
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'];
    const validatedStatus = statusVal && validStatuses.includes(statusVal) ? statusVal : undefined;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Validated params:', {
        limit: validatedLimit,
        offset: validatedOffset,
        status: validatedStatus,
        search: searchVal
      });
    }
    // Fetch orders with pagination
    const orders = await prisma.order.findMany({
      skip: validatedOffset,
      take: validatedLimit,
      where: validatedStatus ? { status: validatedStatus } : undefined,
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        },
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, price: true, imageUrl: true }
            },
            variant: {
              select: { id: true, title: true, price: true, sku: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.order.count({
      where: validatedStatus ? { status: validatedStatus } : undefined
    });
    const response = NextResponse.json({
      orders,
      pagination: {
        limit: validatedLimit,
        offset: validatedOffset,
        total,
        hasMore: validatedOffset + validatedLimit < total
      }
    });

    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error fetching orders:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
}
