// FILE: lib/shopify/index.ts

'use server';

import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from '@/lib/constants';
import { isShopifyError } from '@/lib/type-guards';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getLocalizationQuery } from './queries/localization';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product';
// No longer importing from './queries/shop'
import {
  Cart,
  Collection,
  Connection,
  Country,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyLocalizationOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyShopMetafieldOperation,
  ShopifyUpdateCartOperation
} from './types';
import { revalidateTag } from 'next/cache';

// Helper function to remove edges and nodes from a GraphQL connection
const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

// Helper function to reshape a Shopify product object
const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
): Product | undefined => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, collections, ...rest } = product;

  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants),
    collections: removeEdgesAndNodes(collections).map((collection) => ({
      ...collection,
      path: `/search/${collection.handle}`
    }))
  };
};

// Helper function to reshape an array of Shopify product objects
const reshapeProducts = (products: ShopifyProduct[]): Product[] => {
  const reshapedProducts: Product[] = [];

  for (const product of products) {
    const reshapedProduct = reshapeProduct(product);
    if (reshapedProduct) {
      reshapedProducts.push(reshapedProduct);
    }
  }

  return reshapedProducts;
};

// Shopify fetch function
export async function shopifyFetch<T>({
  query,
  variables,
  tags,
  cache
}: {
  query: string;
  variables?: Extract<T, { variables: object }>['variables'];
  tags?: string[];
  cache?: RequestCache;
}): Promise<{ status: number; body: T }> {
  try {
    const endpoint = `${process.env.SHOPIFY_STORE_DOMAIN}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        status: e.status || 500,
        message: e.message,
        query
      };
    }
    throw {
      error: e,
      query
    };
  }
}

// The getPublicCoupons function has been removed.

// Function to get a menu from Shopify
export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return (
    res.body.data.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url.replace(process.env.SHOPIFY_STORE_DOMAIN!, '').replace('/pages', '')
    })) || []
  );
}

// Function to get a single product from Shopify
export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product, false);
}

// Function to get product recommendations from Shopify
export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

// Function to get all products from Shopify
export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// Function to get available shipping countries from Shopify
export async function getAvailableShippingCountries(): Promise<Country[]> {
  const res = await shopifyFetch<ShopifyLocalizationOperation>({
    query: getLocalizationQuery,
    tags: [TAGS.cart]
  });
  return res.body.data.localization.availableCountries;
}

// Function to get collections from Shopify
export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  const shopifyCollections = removeEdgesAndNodes(res.body.data.collections);
  const collections = shopifyCollections.map((collection) => ({
    ...collection,
    path: `/search/${collection.handle}`
  }));

  return collections;
}

// Function to get a single collection from Shopify
export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  const { ...collection } = res.body.data.collection;

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
}

// Function to get products in a specific collection from Shopify
export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey
    }
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for handle "${collection}"`);
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
}

// Cart functions
const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: 'USD'
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });
  revalidateTag(TAGS.cart);
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });
  revalidateTag(TAGS.cart);
  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });
  revalidateTag(TAGS.cart);
  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
    cache: 'no-store'
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return null;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}