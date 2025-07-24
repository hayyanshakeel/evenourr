// Type definitions for Shopify integration
export interface Menu {
  title: string;
  path: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: any[];
  featuredImage: {
    url: string;
    altText?: string;
  };
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface Collection {
  handle: string;
  title: string;
}

export interface Page {
  handle: string;
  title: string;
}