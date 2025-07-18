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
import { getShopMetafieldsQuery } from './queries/shop';
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

// ... (keep all other functions like reshapeCart, getProduct, etc. exactly as they are) ...

export async function getPublicCoupons(): Promise<{
  success: boolean;
  coupons: string[];
  error?: string;
}> {
  try {
    const res = await shopifyFetch<ShopifyShopMetafieldOperation>({
      query: getShopMetafieldsQuery,
      variables: {
        namespace: 'custom',
        key: 'public_coupons'
      },
      tags: [TAGS.metafields],
      cache: 'no-store'
    });

    const metafield = res.body.data.shop.metafield;

    if (!metafield || !metafield.value) {
      return {
        success: false,
        coupons: [],
        error: "Metafield 'custom.public_coupons' not found or is empty. Please check the namespace, key, and value in your Shopify Admin."
      };
    }

    const couponString = metafield.value;
    return {
      success: true,
      coupons: couponString.split(',').map((code) => code.trim())
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      coupons: [],
      error: 'An API error occurred while fetching coupons.'
    };
  }
}