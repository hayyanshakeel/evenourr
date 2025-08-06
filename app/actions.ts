'use server';

import prisma from '@/lib/db';

export async function getProductById(productId: number) {
  try {
    const product = await prisma.product.findFirst({ where: { id: productId } });
    return product;
  } catch (error) {
    // handle error
    return null;
  }
}