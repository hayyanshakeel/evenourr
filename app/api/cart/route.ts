import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import type { Product } from '@/lib/types';

// --- Firebase Admin Initialization ---
// This code must run for the server to verify users.

// Parse the service account key from the environment variable
if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON env variable is not set');
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);

// Initialize the Firebase Admin SDK if it hasn't been already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

/**
 * Verifies the Firebase ID token from the request's Authorization header.
 * @returns The user's UID if the token is valid, otherwise null.
 */
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


// --- API Route Handlers ---

export async function GET(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid or missing token' }, { status: 401 });
    }

    const cart = await prisma.carts.findFirst({ where: { userId } });
    if (!cart) {
        return NextResponse.json({ items: [] });
    }

    const items = await prisma.cartItems.findMany({
        where: { cartId: cart.id },
        include: { product: true }
    });

    const responseItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        name: (item.product as Product | undefined)?.name ?? null,
        price: (item.product as Product | undefined)?.price ?? null,
        imageUrl: (item.product as Product | undefined)?.imageUrl ?? null,
    }));

    return NextResponse.json({ items: responseItems });
}

interface CartItemInput {
    productId: number;
    quantity: number;
}

export async function POST(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid or missing token' }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    let cart = await prisma.carts.findFirst({ where: { userId } });
    if (!cart) {
        cart = await prisma.carts.create({ data: { userId } });
        if (!cart) {
            return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
        }
    }

    const existingItem = await prisma.cartItems.findFirst({
        where: { cartId: cart.id, productId }
    });

    if (existingItem) {
        await prisma.cartItems.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity }
        });
    } else {
        await prisma.cartItems.create({
            data: { cartId: cart.id, productId, quantity }
        });
    }

    return NextResponse.json({ success: true, message: 'Cart updated' });
}