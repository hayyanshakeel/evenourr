// lib/types.ts

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  inventory: number;
  imageUrl: string | null;
  status: 'draft' | 'active' | 'archived';
  
  // Add these new optional fields
  vendor?: string | null;
  collections?: string | null;
  tags?: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  customer_id: number | null;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: Date;
  items: OrderItem[];
  customer: Customer | null;
}

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: Product;
}

export interface Customer {
    id: number;
    name: string | null;
    email: string;
    createdAt: Date;
}