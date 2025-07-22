// lib/definitions.ts

export type Product = {
  id: number;
  slug: string; // Changed from handle
  name: string; // Changed from title
  description: string | null;
  price: number;
  // This assumes your product has these relations. Adjust if necessary.
  images?: ProductImage[];
  variants?: ProductVariant[];
};

export type ProductImage = {
  id: number;
  productId: number;
  url: string;
  altText: string;
};

export type ProductVariant = {
  id: number;
  productId: number;
  title: string;
  price: number;
};

// This represents the actual shape of your product table from the schema
export type ProductFromDB = {
    id: number;
    price: number;
    name: string;
    status: "active" | "draft" | "archived" | null;
    description: string | null;
    createdAt: string;
    slug: string;
    updatedAt: string;
};