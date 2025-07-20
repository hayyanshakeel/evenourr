'use client';

import { Cart, ProductVariant } from '@/lib/shopify/types';
import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
export interface CartContextType {
  cart: Cart | undefined;
  addToCart: (item: ProductVariant) => void;
  // You can add other functions like removeFromCart, updateQuantity etc. here
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

  // Define the addToCart function
  const addToCart = (item: ProductVariant) => {
    // This is a simplified example.
    // In a real app, you would call your addItem action here.
    console.log('Adding to cart:', item);
    // For example: startTransition(() => addItem(item.id));
  };

  const value = {
    cart,
    addToCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
