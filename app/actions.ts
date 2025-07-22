'use server';

import { products } from '@/db/schema';
import { db } from '@/lib/turso';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  description: z.string().optional(),
  imagePublicId: z.string(),
  imageUrl: z.string().url(),
});

export async function addProduct(formData: FormData) {
  const parsed = schema.parse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
    description: formData.get('description') || undefined,
    imagePublicId: formData.get('imagePublicId'),
    imageUrl: formData.get('imageUrl'),
  });

  await db.insert(products).values(parsed);
  revalidatePath('/');
}

export async function getProducts() {
  return db.select().from(products).orderBy(products.createdAt);
}