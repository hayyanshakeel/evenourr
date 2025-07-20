'use client';

import { Cart, CartItem, ProductVariant } from '@/lib/shopify/types';
import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
export interface CartContextType {
  cart: Cart | undefined;
  addToCart: (item: ProductVariant) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  selectedLineIds: Set<string>;
  toggleItemSelection: (itemId: string) => void;
  toggleSelectAll: (selectAll: boolean) => void;
}

// Create the context with an initial undefined value
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// The provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [selectedLineIds, setSelectedLineIds] = useState<Set<string>>(new Set());

  // Define the addToCart function
  const addToCart = (item: ProductVariant) => {
    // This is a simplified example.
    // In a real app, you would call your addItem action here.
    console.log('Adding to cart:', item);
    // For example: startTransition(() => addItem(item.id));
  };

  // Define the removeFromCart function
  const removeFromCart = (itemId: string) => {
    // This is a simplified example.
    // In a real app, you would call your removeItem action here.
    console.log('Removing from cart:', itemId);
    // For example: startTransition(() => removeItem(itemId));
    
    // Also remove from selected items if it was selected
    setSelectedLineIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  // Define the updateQuantity function
  const updateQuantity = (item: CartItem, quantity: number) => {
    // This is a simplified example.
    // In a real app, you would call your updateItemQuantity action here.
    console.log('Updating quantity:', item, quantity);
    // For example: startTransition(() => updateItemQuantity(item.id, quantity));
  };

  // Toggle selection of a single item
  const toggleItemSelection = (itemId: string) => {
    setSelectedLineIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Toggle selection of all items
  const toggleSelectAll = (selectAll: boolean) => {
    if (selectAll && cart?.lines) {
      setSelectedLineIds(new Set(cart.lines.map(line => line.id)));
    } else {
      setSelectedLineIds(new Set());
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    selectedLineIds,
    toggleItemSelection,
    toggleSelectAll
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
