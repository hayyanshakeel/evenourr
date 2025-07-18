// FILE: components/cart/actions.ts

'use server';

import { shopifyFetch } from 'lib/shopify';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
  applyDiscountMutation
} from 'lib/shopify/mutations/cart';
import { getCartQuery } from 'lib/shopify/queries/cart';
import {
  Cart,
  Connection,
  ShopifyAddToCartOperation,
  ShopifyApplyDiscountOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCreateCartOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from 'lib/shopify/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

function removeEdgesAndNodes(array: Connection<any>) {
  return array.edges.map((edge) => edge?.node);
}

function reshapeCart(cart: ShopifyCart): Cart {
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

export async function applyDiscount(
  cartId: string,
  discountCode: string
): Promise<{ success: boolean; error?: string }> {
  const res = await shopifyFetch<ShopifyApplyDiscountOperation>({
    query: applyDiscountMutation,
    variables: {
      cartId,
      discountCodes: [discountCode]
    },
    cache: 'no-store'
  });

  const userErrors = res.body.data.cartDiscountCodesUpdate?.userErrors;

  if (userErrors && userErrors.length > 0) {
    return { success: false, error: userErrors[0]?.message || 'An unknown error occurred.' };
  }
  
  revalidateTag('cart');
  return { success: true };
}

export async function redirectToCheckout(cartId: string): Promise<void> {
  const cart = await getCart(cartId);
  
  if (!cart?.checkoutUrl) {
    throw new Error('Could not retrieve checkout URL.');
  }

  redirect(cart.checkoutUrl);
}