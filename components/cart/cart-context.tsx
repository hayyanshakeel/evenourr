'use client';

import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart
} from '@/lib/shopify';
import { Cart, CartItem } from '@/lib/shopify/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition
} from 'react';

interface CartContextType {
  cart: Cart | undefined;
  addToCart: (variantId: string) => void;
  removeFromCart: (lineId: string) => void;
  updateCartItemQuantity: (lineId: string, quantity: number) => void;
  optimisticUpdate: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function initializeCart() {
      const cartId = localStorage.getItem('cartId');
      const existingCart = cartId ? await getCart(cartId) : null;
      if (existingCart) {
        setCart(existingCart);
      }
    }
    initializeCart();
  }, []);

  const addToCartAndUpdateState = useCallback(async (variantId: string) => {
    let currentCart = cart;
    if (!currentCart) {
      currentCart = await createCart();
      localStorage.setItem('cartId', currentCart.id);
    }
    const updatedCart = await addToCart(currentCart.id, [{ merchandiseId: variantId, quantity: 1 }]);
    setCart(updatedCart);
  }, [cart]);

  const removeFromCartAndUpdateState = useCallback(async (lineId: string) => {
    if (!cart) return;
    const updatedCart = await removeFromCart(cart.id, [lineId]);
    setCart(updatedCart);
  }, [cart]);

  const updateCartItemQuantityAndUpdateState = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      const updatedCart = await updateCart(cart.id, [{ id: lineId, quantity }]);
      setCart(updatedCart);
    },
    [cart]
  );

  const contextValue = useMemo(() => {
    return {
      cart,
      addToCart: (variantId: string) => startTransition(() => addToCartAndUpdateState(variantId)),
      removeFromCart: (lineId: string) => startTransition(() => removeFromCartAndUpdateState(lineId)),
      updateCartItemQuantity: (lineId: string, quantity: number) =>
        startTransition(() => updateCartItemQuantityAndUpdateState(lineId, quantity)),
      optimisticUpdate: true
    };
  }, [cart, addToCartAndUpdateState, removeFromCartAndUpdateState, updateCartItemQuantityAndUpdateState]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};