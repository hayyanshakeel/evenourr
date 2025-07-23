// lib/types.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  inventory: number;
  status: 'draft' | 'active' | 'archived';
  imageUrl?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}