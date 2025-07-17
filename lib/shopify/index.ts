const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export interface Product {
  id: string;
  title: string;
  description: string;
  featuredImage?: {
    url: string;
  };
}

interface ProductResponse {
  productByHandle: Product | null;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        featuredImage {
          url
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables: { handle } }),
    cache: 'no-store',
  });

  const json = (await res.json()) as { data: ProductResponse };
  return json.data.productByHandle ?? undefined;
}

// FILE: lib/shopify/cart.ts

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
}

export async function getCart(): Promise<Cart | undefined> {
  return {
    id: 'dummy-cart-id',
    checkoutUrl: 'https://yourshop.myshopify.com/checkout',
    totalQuantity: 0,
  };
}