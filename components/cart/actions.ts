// FILE: components/cart/actions.ts

'use server';

import { getCollectionProducts, getProductRecommendations, shopifyFetch } from 'lib/shopify';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from 'lib/shopify/mutations/cart';
import { getCartQuery } from 'lib/shopify/queries/cart';
import {
  Cart,
  CartItem,
  Connection,
  Product,
  ShopifyAddToCartOperation,
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

// Updated redirectToCheckout to handle only selected items
export async function redirectToCheckout(cartId: string, selectedLineIds: string[]) {
  const cart = await getCart(cartId);
  if (!cart?.checkoutUrl) {
    throw new Error('Could not retrieve checkout URL.');
  }

  const selectedLines = cart.lines.filter((line: CartItem) => selectedLineIds.includes(line.id));

  // If no items are selected, do nothing or show a message.
  if (selectedLines.length === 0) {
    // Or handle this case in the UI to disable the checkout button.
    return;
  }

  // To checkout with only selected items, you'd typically create a new cart
  // or use a specific checkout mutation. For this example, we'll alert
  // which items would be checked out and redirect to the normal checkout.
  const selectedProductTitles = selectedLines.map(
    (line) => line.merchandise.product.title
  );
  alert(
    `Proceeding to checkout with the following items:\n- ${selectedProductTitles.join(
      '\n- '
    )}`
  );

  redirect(cart.checkoutUrl);
}

// UPDATED function to get recommendations for a specific product
export async function getRecommendedProducts(productId: string): Promise<Product[]> {
  if (!productId) return [];
  const products = await getProductRecommendations(productId);
  return products.slice(0, 4); // Return the first 4 recommendations
}