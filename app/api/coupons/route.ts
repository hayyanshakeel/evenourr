import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
        try {
            const coupon = await prisma.coupon.findFirst({ where: { code } });
            if (!coupon) {
                return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
            }
            return NextResponse.json(coupon);
        } catch (error) {
            console.error('Error fetching coupon:', error);
            return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
        }
    } else {
        try {
            const allCoupons = await prisma.coupon.findMany();
            return NextResponse.json(allCoupons);
        } catch (error) {
            console.error('Error fetching all coupons:', error);
            return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, discount, validFrom, validUntil, maxUses, isActive } = body;

        if (!code || !discount || !validFrom || !validUntil) {
            return NextResponse.json({ 
                error: 'Code, discount, validFrom, and validUntil are required fields' 
            }, { status: 400 });
        }

        const newCoupon = await prisma.coupon.create({
            data: {
                code,
                discount,
                validFrom: new Date(validFrom),
                validUntil: new Date(validUntil),
                maxUses: maxUses || 0,
                isActive: isActive !== false
            }
        });

        return NextResponse.json(newCoupon, { status: 201 });
    } catch (error: any) {
        console.error('Error creating coupon:', error);
        
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 });
        }
        
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}