import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id }
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json(coupon, { status: 200 });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json({ error: 'Failed to fetch coupon' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
    }

    const body = await request.json();
    const { code, discount, validFrom, validUntil, maxUses, isActive } = body;

    if (!code || !discount || !validFrom || !validUntil) {
      return NextResponse.json({ 
        error: 'Code, discount, validFrom, and validUntil are required fields' 
      }, { status: 400 });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        code,
        discount,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        maxUses: maxUses || 0,
        isActive: isActive !== false
      }
    });

    return NextResponse.json(updatedCoupon, { status: 200 });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
    }

    await prisma.coupon.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
