'use server';

import { TAGS } from 'lib/constants';
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart
} from 'lib/shopify';
import { Cart, CartItem } from 'lib/shopify/types';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  const cookieStore = await cookies();
  let cartId = cookieStore.get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cookieStore.set('cartId', cart.id);
    cartId = cart.id;
  }

  if (!selectedVariantId) {
    return 'Missing variant ID';
  }

  try {
    await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const cart = (await getCart(cartId)) as Cart;
    const lineItem = cart.lines.find(
      (line: CartItem) => line.merchandise.id === merchandiseId
    );

    if (lineItem?.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;
  const { merchandiseId, quantity } = payload;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const cart = (await getCart(cartId)) as Cart;
    const lineItem = cart.lines.find(
      (line: CartItem) => line.merchandise.id === merchandiseId
    );

    if (lineItem?.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
      revalidateTag(TAGS.cart);
    } else if (quantity > 0) {
      await addToCart(cartId, [{ merchandiseId, quantity }]);
      revalidateTag(TAGS.cart);
    }
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  if (!cartId) {
    return redirect('/');
  }

  const cart = await getCart(cartId);

  if (!cart || !cart.checkoutUrl) {
    return redirect('/');
  }

  redirect(cart.checkoutUrl);
}