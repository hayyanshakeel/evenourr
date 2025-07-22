import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable, real } from 'drizzle-orm/sqlite-core';

// Products table
export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  handle: text('handle').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  cost: integer('cost'),
  imageUrl: text('image_url'),
  images: text('images'), // JSON array of image URLs
  inventory: integer('inventory').notNull().default(0),
  sku: text('sku'),
  barcode: text('barcode'),
  weight: real('weight'),
  weightUnit: text('weight_unit').default('kg'),
  status: text('status').notNull().default('active'), // active, draft, archived
  categoryId: integer('category_id'),
  vendor: text('vendor'),
  tags: text('tags'), // JSON array of tags
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Product variants table
export const productVariants = sqliteTable('product_variants', {
  id: integer('id').primaryKey(),
  productId: integer('product_id').notNull(),
  title: text('title').notNull(),
  price: integer('price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  sku: text('sku'),
  barcode: text('barcode'),
  inventory: integer('inventory').notNull().default(0),
  weight: real('weight'),
  imageUrl: text('image_url'),
  options: text('options'), // JSON object like {size: 'M', color: 'Blue'}
  position: integer('position').default(1),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// Categories table
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  parentId: integer('parent_id'),
  position: integer('position').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// Customers table
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  password: text('password'), // Hashed password
  acceptsMarketing: integer('accepts_marketing').default(0), // 0 = false, 1 = true
  verifiedEmail: integer('verified_email').default(0),
  taxExempt: integer('tax_exempt').default(0),
  tags: text('tags'), // JSON array of tags
  note: text('note'),
  totalSpent: integer('total_spent').default(0),
  ordersCount: integer('orders_count').default(0),
  state: text('state').default('enabled'), // enabled, disabled, invited
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Customer addresses table
export const customerAddresses = sqliteTable('customer_addresses', {
  id: integer('id').primaryKey(),
  customerId: integer('customer_id').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  company: text('company'),
  address1: text('address1'),
  address2: text('address2'),
  city: text('city'),
  province: text('province'),
  country: text('country'),
  zip: text('zip'),
  phone: text('phone'),
  isDefault: integer('is_default').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// Orders table
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerId: integer('customer_id'),
  email: text('email').notNull(),
  phone: text('phone'),
  status: text('status').notNull().default('pending'), // pending, processing, shipped, delivered, cancelled, refunded
  financialStatus: text('financial_status').default('pending'), // pending, paid, partially_paid, refunded, voided
  fulfillmentStatus: text('fulfillment_status'), // fulfilled, partial, unfulfilled
  currency: text('currency').default('USD'),
  subtotal: integer('subtotal').notNull(),
  totalTax: integer('total_tax').default(0),
  totalDiscount: integer('total_discount').default(0),
  totalShipping: integer('total_shipping').default(0),
  total: integer('total').notNull(),
  note: text('note'),
  tags: text('tags'), // JSON array
  // Shipping address
  shippingFirstName: text('shipping_first_name'),
  shippingLastName: text('shipping_last_name'),
  shippingCompany: text('shipping_company'),
  shippingAddress1: text('shipping_address1'),
  shippingAddress2: text('shipping_address2'),
  shippingCity: text('shipping_city'),
  shippingProvince: text('shipping_province'),
  shippingCountry: text('shipping_country'),
  shippingZip: text('shipping_zip'),
  // Billing address
  billingFirstName: text('billing_first_name'),
  billingLastName: text('billing_last_name'),
  billingCompany: text('billing_company'),
  billingAddress1: text('billing_address1'),
  billingAddress2: text('billing_address2'),
  billingCity: text('billing_city'),
  billingProvince: text('billing_province'),
  billingCountry: text('billing_country'),
  billingZip: text('billing_zip'),
  // Tracking
  trackingNumber: text('tracking_number'),
  trackingUrl: text('tracking_url'),
  // Dates
  cancelledAt: text('cancelled_at'),
  closedAt: text('closed_at'),
  processedAt: text('processed_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Order items table
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id'),
  variantId: integer('variant_id'),
  title: text('title').notNull(),
  variantTitle: text('variant_title'),
  sku: text('sku'),
  price: integer('price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  quantity: integer('quantity').notNull(),
  totalDiscount: integer('total_discount').default(0),
  fulfillmentStatus: text('fulfillment_status'), // fulfilled, partial, unfulfilled
  fulfillmentService: text('fulfillment_service'),
  requiresShipping: integer('requires_shipping').default(1),
  taxable: integer('taxable').default(1),
  giftCard: integer('gift_card').default(0),
  properties: text('properties'), // JSON object for custom properties
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// Coupons table
export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description'),
  discountType: text('discount_type').notNull(), // percentage, fixed_amount, free_shipping
  discountValue: integer('discount_value').notNull(),
  minimumPurchase: integer('minimum_purchase'),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0),
  usageLimitPerCustomer: integer('usage_limit_per_customer'),
  status: text('status').notNull().default('active'), // active, disabled, expired
  appliesToProducts: text('applies_to_products'), // JSON array of product IDs
  appliesToCategories: text('applies_to_categories'), // JSON array of category IDs
  excludeProducts: text('exclude_products'), // JSON array of product IDs
  customerEligibility: text('customer_eligibility').default('all'), // all, specific_customers, customer_groups
  eligibleCustomers: text('eligible_customers'), // JSON array of customer IDs
  startsAt: text('starts_at'),
  endsAt: text('ends_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Coupon usage table
export const couponUsage = sqliteTable('coupon_usage', {
  id: integer('id').primaryKey(),
  couponId: integer('coupon_id').notNull(),
  orderId: integer('order_id').notNull(),
  customerId: integer('customer_id'),
  discountAmount: integer('discount_amount').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// Store settings table
export const storeSettings = sqliteTable('store_settings', {
  id: integer('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  type: text('type').default('string'), // string, number, boolean, json
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Carts table
export const carts = sqliteTable('carts', {
    id: integer('id').primaryKey(),
    userId: text('user_id'), // Can be customer ID or a session ID for guests
    status: text('status').default('active'), // active, completed, abandoned
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Cart items table
export const cartItems = sqliteTable('cart_items', {
    id: integer('id').primaryKey(),
    cartId: integer('cart_id').notNull(),
    productId: integer('product_id').notNull(),
    variantId: integer('variant_id'),
    quantity: integer('quantity').notNull(),
    price: integer('price').notNull(), // Price at the time of adding to cart
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
