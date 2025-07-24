import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
        try {
            const coupon = await prisma.coupons.findFirst({ where: { code } });
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
            const allCoupons = await prisma.coupons.findMany();
            return NextResponse.json(allCoupons);
        } catch (error) {
            console.error('Error fetching all coupons:', error);
            return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
        }
    }
}