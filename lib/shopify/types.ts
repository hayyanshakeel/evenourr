// Shopify types compatibility layer
// This file provides types for Shopify-like data structures used in the app

export type Menu = {
  title: string;
  path: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
  };
};