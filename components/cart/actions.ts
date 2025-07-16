'use client';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { Cart, CartItem } from 'lib/shopify/types'; // Import CartItem type
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ... (addItem function remains the same)

export async function removeItem(prevState: any, merchandiseId: string) {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const cart = (await getCart(cartId)) as Cart;

    if (!cart) {
      return 'Error fetching cart';
    }
    
    // Add type for 'line' parameter
    const lineItem = cart.lines.find((line: CartItem) => line.merchandise.id === merchandiseId);

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
  const cartId = (await cookies()).get('cartId')?.value;
  const { merchandiseId, quantity } = payload;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const cart = (await getCart(cartId)) as Cart;

    if (!cart) {
      return 'Error fetching cart';
    }

    // Add type for 'line' parameter
    const lineItem = cart.lines.find((line: CartItem) => line.merchandise.id === merchandiseId);

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
    } else if (quantity > 0) {
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

// ... (other functions remain the same)