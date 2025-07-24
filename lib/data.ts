// lib/data.ts
import { prisma } from '@/lib/db';

export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      include: {
        // if you have a Variant model, include it
        // variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    return [];
  }
}