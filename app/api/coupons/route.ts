import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema'; // Corrected import
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
        // Logic to fetch a single coupon by code
        try {
            const coupon = await db.query.coupons.findFirst({
                where: eq(coupons.code, code),
            });

            if (!coupon) {
                return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
            }

            return NextResponse.json(coupon);
        } catch (error) {
            console.error('Error fetching coupon:', error);
            return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
        }
    } else {
        // Logic to fetch all coupons
        try {
            const allCoupons = await db.query.coupons.findMany();
            return NextResponse.json(allCoupons);
        } catch (error) {
            console.error('Error fetching all coupons:', error);
            return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
        }
    }
}