# Turso Functions Guide - How to Create and Use Database Functions

## Overview
Turso (SQLite-based edge database) supports user-defined functions that you can create and use in your Next.js dashboard. Here's how to implement common database functions for your e-commerce platform.

## 1. Setting Up Turso Functions

### Install Required Dependencies
```bash
npm install @libsql/client drizzle-orm
```

### Basic Function Structure
```typescript
// lib/turso-functions.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

// Create a client with functions
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

// Register custom functions
client.execute(`
  CREATE FUNCTION IF NOT EXISTS calculate_discount(price REAL, discount_percent REAL) 
  RETURNS REAL AS $$
    RETURN price * (1 - discount_percent / 100);
  $$;
`);
```

## 2. Common E-commerce Functions

### A. Calculate Order Totals
```typescript
// lib/functions/order-calculations.ts
export const orderFunctions = {
  // Calculate order total with tax and discounts
  calculateOrderTotal: async (orderId: number) => {
    const result = await db.execute(`
      SELECT 
        SUM(oi.price * oi.quantity) as subtotal,
        SUM(oi.price * oi.quantity * 0.08) as tax,
        SUM(oi.total_discount) as discount,
        SUM(oi.price * oi.quantity) + SUM(oi.price * oi.quantity * 0.08) - SUM(oi.total_discount) as total
      FROM order_items oi
      WHERE oi.order_id = ${orderId}
    `);
    return result.rows[0];
  },

  // Update customer lifetime value
  updateCustomerLifetimeValue: async (customerId: number) => {
    await db.execute(`
      UPDATE customers 
      SET total_spent = (
        SELECT SUM(total) 
        FROM orders 
        WHERE customer_id = ${customerId} AND status = 'delivered'
      ),
      orders_count = (
        SELECT COUNT(*) 
        FROM orders 
        WHERE customer_id = ${customerId} AND status = 'delivered'
      )
      WHERE id = ${customerId}
    `);
  }
};
```

### B. Inventory Management Functions
```typescript
// lib/functions/inventory-functions.ts
export const inventoryFunctions = {
  // Check stock availability
  checkStock: async (productId: number, quantity: number) => {
    const result = await db.execute(`
      SELECT 
        inventory >= ${quantity} as available,
        inventory as current_stock
      FROM products
      WHERE id = ${productId}
    `);
    return result.rows[0];
  },

  // Update inventory after order
  updateInventory: async (productId: number, quantity: number) => {
    await db.execute(`
      UPDATE products 
      SET inventory = inventory - ${quantity}
      WHERE id = ${productId}
    `);
  },

  // Get low stock products
  getLowStockProducts: async (threshold: number = 10) => {
    const result = await db.execute(`
      SELECT id, title, inventory, sku
      FROM products
      WHERE inventory <= ${threshold} AND status = 'active'
      ORDER BY inventory ASC
    `);
    return result.rows;
  }
};
```

### C. Coupon Validation Functions
```typescript
// lib/functions/coupon-functions.ts
export const couponFunctions = {
  // Validate coupon code
  validateCoupon: async (code: string, customerId?: number) => {
    const result = await db.execute(`
      SELECT 
        c.*,
        CASE 
          WHEN c.ends_at < datetime('now') THEN 1
          ELSE 0
        END as is_expired,
        CASE 
          WHEN c.usage_limit IS NOT NULL AND c.usage_count >= c.usage_limit THEN 1
          ELSE 0
        END as usage_limit_reached,
        CASE 
          WHEN ${customerId} IS NOT NULL AND c.usage_limit_per_customer IS NOT NULL 
          AND (
            SELECT COUNT(*) 
            FROM coupon_usage 
            WHERE coupon_id = c.id AND customer_id = ${customerId}
          ) >= c.usage_limit_per_customer THEN 1
          ELSE 0
        END as customer_limit_reached
      FROM coupons c
      WHERE c.code = '${code}' AND c.status = 'active'
    `);
    return result.rows[0];
  },

  // Apply coupon discount
  applyCoupon: async (code: string, subtotal: number) => {
    const result = await db.execute(`
      SELECT 
        id,
        discount_type,
        discount_value,
        CASE 
          WHEN discount_type = 'percentage' THEN ${subtotal} * (discount_value / 100)
          WHEN discount_type = 'fixed_amount' THEN LEAST(discount_value, ${subtotal})
          ELSE 0
        END as discount_amount
      FROM coupons
      WHERE code = '${code}' AND status = 'active'
        AND (starts_at IS NULL OR starts_at <= datetime('now'))
        AND (ends_at IS NULL OR ends_at >= datetime('now'))
    `);
    return result.rows[0];
  }
};
```

## 3. Advanced Analytics Functions

### A. Sales Analytics
```typescript
// lib/functions/analytics-functions.ts
export const analyticsFunctions = {
  // Get daily sales
  getDailySales: async (startDate: string, endDate: string) => {
    const result = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue,
        AVG(total) as avg_order_value
      FROM orders
      WHERE created_at BETWEEN '${startDate}' AND '${endDate}'
        AND status = 'delivered'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    return result.rows;
  },

  // Get top selling products
  getTopProducts: async (limit: number = 10) => {
    const result = await db.execute(`
      SELECT 
        p.id,
        p.title,
        SUM(oi.quantity) as total_sold,
        SUM(oi.price * oi.quantity) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'delivered'
      GROUP BY p.id, p.title
      ORDER BY total_sold DESC
      LIMIT ${limit}
    `);
    return result.rows;
  },

  // Get customer retention metrics
  getCustomerRetention: async () => {
    const result = await db.execute(`
      SELECT 
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(DISTINCT CASE WHEN o.created_at >= datetime('now', '-30 days') THEN c.id END) as active_30_days,
        COUNT(DISTINCT CASE WHEN o.created_at >= datetime('now', '-7 days') THEN c.id END) as active_7_days,
        ROUND(
          COUNT(DISTINCT CASE WHEN o.created_at >= datetime('now', '-30 days') THEN c.id END) * 100.0 / 
          COUNT(DISTINCT c.id), 2
        ) as retention_rate_30_days
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      WHERE o.status = 'delivered'
    `);
    return result.rows[0];
  }
};
```

## 4. Using Functions in Your API Routes

### Example: Using Functions in API Routes
```typescript
// app/api/orders/route.ts (enhanced with functions)
import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { inventoryFunctions, couponFunctions } from '@/lib/functions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, couponCode } = body;
