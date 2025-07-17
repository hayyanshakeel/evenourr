'use server';

import { shopifyFetch } from 'lib/shopify';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from 'lib/shopify/mutations/cart';
import { getCartQuery } from 'lib/shopify/queries/cart';
import {
  Cart,
  Connection,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCreateCartOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from 'lib/shopify/types';
import { revalidateTag } from 'next/cache';

// Helper function to extract nodes from edges
function removeEdgesAndNodes(array: Connection<any>) {
  return array.edges.map((edge) => edge?.node);
}

// Export this helper so it can be used elsewhere if needed
export function reshapeCart(cart: ShopifyCart): Cart {
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
}

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

export async function addItem(
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
  revalidateTag('cart');
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeItem(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });
  revalidateTag('cart');
  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateItemQuantity(
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
  revalidateTag('cart');
  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

// This function was missing
export async function redirectToCheckout(cartId: string): Promise<string> {
  const cart = await getCart(cartId);
  if (!cart?.checkoutUrl) {
    throw new Error('Could not retrieve checkout URL.');
  }
  return cart.checkoutUrl;
}