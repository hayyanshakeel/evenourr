// FILE: components/cart/cart-context.tsx

'use client';

import {
  addItem,
  createCart,
  getCart,
  removeItem,
  updateItemQuantity
} from './actions';
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
  selectedLineIds: Set<string>;
  toggleItemSelection: (lineId: string) => void;
  toggleSelectAll: (select: boolean) => void;
  openCart: () => void; // Added for programmatic opening
  isCartOpen: boolean; // Added to check state
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedLineIds, setSelectedLineIds] = useState<Set<string>>(new Set());

  const openCart = () => setIsCartOpen(true);

  useEffect(() => {
    async function initializeCart() {
      const cartId = localStorage.getItem('cartId');
      const existingCart = cartId ? await getCart(cartId) : null;
      if (existingCart) {
        setCart(existingCart);
        // Initially, all items are selected
        setSelectedLineIds(new Set(existingCart.lines.map((line) => line.id)));
      }
    }
    initializeCart();
  }, []);

  const toggleItemSelection = (lineId: string) => {
    setSelectedLineIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(lineId)) {
        newSelection.delete(lineId);
      } else {
        newSelection.add(lineId);
      }
      return newSelection;
    });
  };

  const toggleSelectAll = (select: boolean) => {
    if (select && cart) {
      setSelectedLineIds(new Set(cart.lines.map((line) => line.id)));
    } else {
      setSelectedLineIds(new Set());
    }
  };

  const addToCartAndUpdateState = useCallback(
    async (variantId: string) => {
      let currentCart = cart;
      if (!currentCart) {
        currentCart = await createCart();
        localStorage.setItem('cartId', currentCart.id);
      }
      const updatedCart = await addItem(currentCart.id, [
        { merchandiseId: variantId, quantity: 1 }
      ]);
      setCart(updatedCart);
      setSelectedLineIds(new Set(updatedCart.lines.map((line) => line.id)));
    },
    [cart]
  );

  const removeFromCartAndUpdateState = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      const updatedCart = await removeItem(cart.id, [lineId]);
      setCart(updatedCart);
      setSelectedLineIds((prev) => {
        const newSelection = new Set(prev);
        newSelection.delete(lineId);
        return newSelection;
      });
    },
    [cart]
  );

  // FIX: This function has been updated to correctly pass the 'merchandiseId'.
  const updateCartItemQuantityAndUpdateState = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;

      // First, find the specific item in the cart to get its merchandiseId.
      const itemToUpdate = cart.lines.find((item: CartItem) => item.id === lineId);
      if (!itemToUpdate) {
        console.error('Could not find cart item to update');
        return;
      }

      // Now, call the update function with all the required properties.
      const updatedCart = await updateItemQuantity(cart.id, [
        {
          id: lineId,
          merchandiseId: itemToUpdate.merchandise.id,
          quantity: quantity
        }
      ]);
      setCart(updatedCart);
    },
    [cart]
  );

  const contextValue = useMemo(() => {
    return {
      cart,
      addToCart: (variantId: string) => startTransition(() => addToCartAndUpdateState(variantId)),
      removeFromCart: (lineId: string) =>
        startTransition(() => removeFromCartAndUpdateState(lineId)),
      updateCartItemQuantity: (lineId: string, quantity: number) =>
        startTransition(() => updateCartItemQuantityAndUpdateState(lineId, quantity)),
      selectedLineIds,
      toggleItemSelection,
      toggleSelectAll,
      openCart,
      isCartOpen
    };
  }, [
    cart,
    isCartOpen,
    selectedLineIds,
    addToCartAndUpdateState,
    removeFromCartAndUpdateState,
    updateCartItemQuantityAndUpdateState
  ]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};