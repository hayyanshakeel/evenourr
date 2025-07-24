import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import {
  products,
  collections,
  productsToCollections,
  carts,
  cartItems,
  customers,
  orders,
  orderItems,
  coupons
} from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, {
  schema: {
    products,
    collections,
    productsToCollections,
    carts,
    cartItems,
    customers,
    orders,
    orderItems,
    coupons
  },
});