import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import type { Product } from '@/lib/types';

// --- Firebase Admin Initialization ---
if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON env variable is not set');
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        console.warn("No Authorization header found.");
        return null;
    }
    
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
        console.warn("Bearer token is missing.");
        return null;
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error("Error verifying auth token:", error);
        return null;
    }
}

export async function GET(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid or missing token' }, { status: 401 });
    }

    const cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
        return NextResponse.json({ items: [] });
    }

    const items = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
        include: { product: true }
    });

    const responseItems = items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        name: (item.product as Product | undefined)?.name ?? null,
        price: (item.product as Product | undefined)?.price ?? null,
        imageUrl: (item.product as Product | undefined)?.imageUrl ?? null,
    }));

    return NextResponse.json({ items: responseItems });
}

export async function POST(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid or missing token' }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
        if (!cart) {
            return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
        }
    }

    const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId }
    });

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity }
        });
    } else {
        await prisma.cartItem.create({
            data: { cartId: cart.id, productId, quantity }
        });
    }

    return NextResponse.json({ success: true, message: 'Cart updated' });
}