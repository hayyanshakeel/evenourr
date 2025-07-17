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
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product';
import {
  Cart,
  Collection,
  Connection,
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
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from './types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

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

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

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

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }
  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  return products.map((product) => reshapeProduct(product)).filter(Boolean) as Product[];
};

const reshapeProduct = (product: ShopifyProduct): Product | undefined => {
  if (!product) {
    return undefined;
  }
  const { images, variants, ...rest } = product;
  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants)
  };
};

// All cart actions are now here and exported
export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });
  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store'
  });
  return res.body.data.cart ? reshapeCart(res.body.data.cart) : null;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: 'no-store'
  });
  revalidateTag(TAGS.cart);
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
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
    variables: { cartId, lines },
    cache: 'no-store'
  });
  revalidateTag(TAGS.cart);
  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function redirectToCheckout(cartId: string): Promise<void> {
  const cart = await getCart(cartId);
  if (cart?.checkoutUrl) {
    redirect(cart.checkoutUrl);
  } else {
    throw new Error('Could not retrieve checkout URL.');
  }
}

// All other product/collection functions are also here and exported
export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: { handle },
    tags: [TAGS.products]
  });
  return reshapeProduct(res.body.data.product);
}

export async function getProducts(variables: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables,
    tags: [TAGS.products]
  });
  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: { productId },
    tags: [TAGS.products]
  });
  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  return res.body.data.collections.edges.map((edge: { node: ShopifyCollection }) =>
    reshapeCollection(edge.node)
  ).filter(Boolean) as Collection[];
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: { handle },
    tags: [TAGS.collections]
  });
  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts(variables: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: variables.collection,
      reverse: variables.reverse,
      sortKey: variables.sortKey
    },
    tags: [TAGS.products, TAGS.collections]
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for handle: ${variables.collection}`);
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: { handle },
    tags: [TAGS.collections]
  });
  return res.body.data.menu?.items.map((item: { title: string; url: string }) => ({
    title: item.title,
    path: item.url.replace(process.env.SHOPIFY_STORE_DOMAIN!, '').replace('/collections', '/search').replace('/pages', '')
  })) || [];
}