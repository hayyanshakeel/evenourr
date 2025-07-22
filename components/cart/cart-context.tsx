'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Define the types for our cart and cart items
interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  price: number;
  // We'll add product details when we fetch them
  product?: {
    title: string;
    handle: string;
    imageUrl: string | null;
  };
}

interface Cart {
  id: number;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Helper function to fetch product details for cart items
async function fetchProductDetailsForCart(items: any[]): Promise<any[]> {
  const productIds = items.map(item => item.productId);
  if (productIds.length === 0) return [];

  try {
    const response = await fetch('/api/products/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: productIds }),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    const products = await response.json();
    
    // Create a map for easy lookup
    const productMap = new Map(products.map((p: any) => [p.id, p]));

    return items.map(item => ({
      ...item,
      product: productMap.get(item.productId)
    }));
  } catch (error) {
    console.error(error);
    // Return items without product details if fetch fails
    return items.map(item => ({...item, product: { title: 'Product not found', handle: '#', imageUrl: null}}));
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        const itemsWithDetails = await fetchProductDetailsForCart(data.items);

        const totalQuantity = itemsWithDetails.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = itemsWithDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

        setCart({ ...data.cart, items: itemsWithDetails, totalQuantity, totalPrice });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      if (response.ok) {
        await fetchCart(); // Re-fetch cart to update state
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const updateItemQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) {
        await removeItem(itemId);
        return;
    }
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateItemQuantity,
    removeItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
