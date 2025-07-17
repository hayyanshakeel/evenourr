// components/cart/cart-context.tsx

'use client';

import {
  addItem,
  createCart as createShopifyCart,
  removeItem,
  updateItemQuantity
} from '@/components/cart/actions';
import { Cart, CartItem, ProductVariant } from '@/lib/shopify/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition
} from 'react';

type CartAction = 'plus' | 'minus' | 'delete';

interface CartContextType {
  cart: Cart | undefined;
  optimisticUpdate: (lineId: string, action: CartAction) => void;
  addToCart: (variantId: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const cartId = localStorage.getItem('cartId');

    async function fetchCart() {
      if (cartId) {
        const fetchedCart = await getCart(cartId);
        if (fetchedCart) {
          setCart(fetchedCart);
          return;
        }
      }
      // If no cart id or cart not found, create a new one
      const newCart = await createShopifyCart();
      localStorage.setItem('cartId', newCart.id);
      setCart(newCart);
    }

    fetchCart();
  }, []);

  const optimisticUpdate = useCallback((lineId: string, action: CartAction) => {
    if (!cart) return;

    const newLines = [...cart.lines];
    const lineIndex = newLines.findIndex((line) => line.id === lineId);
    if (lineIndex === -1) return;

    const line = newLines[lineIndex];
    let newQuantity = line.quantity;

    if (action === 'plus') newQuantity++;
    if (action === 'minus') newQuantity--;

    if (newQuantity <= 0 || action === 'delete') {
      newLines.splice(lineIndex, 1);
    } else {
      newLines[lineIndex] = { ...line, quantity: newQuantity };
    }

    const optimisticCart = { ...cart, lines: newLines };
    setCart(optimisticCart);

    startTransition(async () => {
      try {
        if (action === 'delete' || newQuantity <= 0) {
          await removeItem(cart.id, [lineId]);
        } else {
          await updateItemQuantity(cart.id, [
            { id: lineId, merchandiseId: line.merchandise.id, quantity: newQuantity }
          ]);
        }
      } catch (e) {
        // Revert on error
        const fetchedCart = await getCart(cart.id);
        setCart(fetchedCart ?? undefined);
      }
    });
  }, [cart]);

  const addToCart = useCallback((variantId: string) => {
    if (!cart?.id) {
      console.error('Cart not initialized');
      return;
    }

    startTransition(async () => {
      const updatedCart = await addItem(cart.id, [{ merchandiseId: variantId, quantity: 1 }]);
      setCart(updatedCart);
    });
  }, [cart?.id]);

  const contextValue = useMemo(() => {
    return { cart, optimisticUpdate, addToCart };
  }, [cart, optimisticUpdate, addToCart]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// We need getCart here to avoid circular dependencies
import { shopifyFetch } from 'lib/shopify';
import { getCartQuery } from 'lib/shopify/queries/cart';
import { ShopifyCartOperation } from 'lib/shopify/types';
import { reshapeCart } from '@/components/cart/actions'; // Use the exported one from actions

async function getCart(cartId: string): Promise<Cart | null> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store'
  });

  return res.body.data.cart ? reshapeCart(res.body.data.cart) : null;
}