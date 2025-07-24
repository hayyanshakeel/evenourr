// Mock Prisma client types for development
export type PrismaClient = any;
export type Coupon = {
  id: number;
  code: string;
  discount: number;
  validFrom: Date;
  validUntil: Date;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  inventory: number;
  slug: string;
  imageUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Collection = {
  id: number;
  title: string;
  handle: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Order = {
  id: number;
  customerId: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Cart = {
  id: number;
  userId: string | null;
  sessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
};

export type ProductToCollection = {
  productId: number;
  collectionId: number;
};