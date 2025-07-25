// Placeholder Shopify types
// This will be replaced with actual Shopify types later

export interface Menu {
  title: string;
  path: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
}

export interface Cart {
  id: string;
  lines: CartLine[];
}

export interface CartLine {
  id: string;
  merchandise: {
    id: string;
  };
}
