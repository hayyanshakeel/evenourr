"use client";

import { useEffect } from 'react';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';
import { useUser } from '@/hooks/useUser';

interface CheckoutStep {
  step: 'start' | 'shipping' | 'payment' | 'review' | 'complete';
  cartItems?: any[];
  cartValue?: number;
  orderData?: any;
}

interface CheckoutFlowTrackerProps {
  currentStep: CheckoutStep;
}

export function CheckoutFlowTracker({ currentStep }: CheckoutFlowTrackerProps) {
  const { user } = useUser();
  const { trackCheckoutStart, trackCheckoutStep, trackPurchase } = useBehaviorTracking({ 
    userId: user?.id 
  });

  useEffect(() => {
    const { step, cartItems, cartValue, orderData } = currentStep;

    switch (step) {
      case 'start':
        if (cartItems && cartValue !== undefined) {
          trackCheckoutStart(cartItems, cartValue);
        }
        break;
      
      case 'shipping':
      case 'payment':
      case 'review':
        trackCheckoutStep(step, {
          cartValue,
          itemCount: cartItems?.length || 0,
          timestamp: Date.now()
        });
        break;
      
      case 'complete':
        if (orderData) {
          trackPurchase(orderData);
        }
        break;
    }
  }, [currentStep, trackCheckoutStart, trackCheckoutStep, trackPurchase]);

  return null; // This is a tracking-only component
}

// Enhanced cart modal with abandonment tracking
interface CartModalTrackerProps {
  isOpen: boolean;
  cartItems: any[];
  cartValue: number;
  children: React.ReactNode;
}

export function CartModalTracker({ isOpen, cartItems, cartValue, children }: CartModalTrackerProps) {
  const { user } = useUser();
  const { trackEngagement, trackCartAbandon } = useBehaviorTracking({ userId: user?.id });

  useEffect(() => {
    if (isOpen) {
      // Track cart modal opening
      trackEngagement('cart_modal_open', {
        cartValue,
        itemCount: cartItems.length
      });
    }
  }, [isOpen, trackEngagement, cartValue, cartItems.length]);

  // Track modal close without purchase (potential abandonment)
  useEffect(() => {
    let abandonTimer: NodeJS.Timeout;

    if (isOpen && cartItems.length > 0) {
      // Set abandonment timer when cart modal is opened with items
      abandonTimer = setTimeout(() => {
        trackCartAbandon(cartItems, cartValue);
      }, 5 * 60 * 1000); // 5 minutes
    }

    return () => {
      if (abandonTimer) {
        clearTimeout(abandonTimer);
      }
    };
  }, [isOpen, cartItems, cartValue, trackCartAbandon]);

  const handleModalClose = () => {
    if (cartItems.length > 0) {
      trackEngagement('cart_modal_close', {
        cartValue,
        itemCount: cartItems.length,
        action: 'close_without_checkout'
      });
    }
  };

  return (
    <div onKeyDown={(e) => e.key === 'Escape' && handleModalClose()}>
      {children}
    </div>
  );
}

// Product recommendation tracking
interface RecommendationTrackerProps {
  recommendationType: 'related' | 'upsell' | 'cross_sell' | 'trending';
  products: any[];
  sourceProductId?: string;
  children: React.ReactNode;
}

export function RecommendationTracker({ 
  recommendationType, 
  products, 
  sourceProductId, 
  children 
}: RecommendationTrackerProps) {
  const { user } = useUser();
  const { trackEngagement } = useBehaviorTracking({ userId: user?.id });

  useEffect(() => {
    // Track recommendation display
    trackEngagement('recommendation_displayed', {
      type: recommendationType,
      productCount: products.length,
      sourceProductId,
      recommendedProducts: products.map(p => p.id).slice(0, 5) // First 5 IDs
    });
  }, [recommendationType, products, sourceProductId, trackEngagement]);

  const handleRecommendationClick = (product: any) => {
    trackEngagement('recommendation_click', {
      type: recommendationType,
      clickedProductId: product.id,
      sourceProductId,
      position: products.findIndex(p => p.id === product.id)
    });
  };

  return (
    <div onClick={(e) => {
      const target = e.target as HTMLElement;
      const productElement = target.closest('[data-product-id]');
      if (productElement) {
        const productId = productElement.getAttribute('data-product-id');
        const product = products.find(p => p.id === productId);
        if (product) {
          handleRecommendationClick(product);
        }
      }
    }}>
      {children}
    </div>
  );
}

// Wishlist/favorites tracking
interface WishlistTrackerProps {
  product: any;
  isInWishlist: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function WishlistTracker({ product, isInWishlist, onToggle, children }: WishlistTrackerProps) {
  const { user } = useUser();
  const { trackEngagement } = useBehaviorTracking({ userId: user?.id });

  const handleWishlistToggle = () => {
    trackEngagement('wishlist_toggle', {
      productId: product.id,
      productName: product.title || product.name,
      action: isInWishlist ? 'remove' : 'add',
      productPrice: product.price
    });
    onToggle();
  };

  return (
    <div onClick={handleWishlistToggle}>
      {children}
    </div>
  );
}

// Newsletter/email signup tracking
interface NewsletterTrackerProps {
  source: string; // 'footer', 'popup', 'checkout', etc.
  children: React.ReactNode;
}

export function NewsletterTracker({ source, children }: NewsletterTrackerProps) {
  const { user } = useUser();
  const { trackEngagement } = useBehaviorTracking({ userId: user?.id });

  const handleNewsletterInteraction = (action: string, data?: any) => {
    trackEngagement('newsletter_interaction', {
      source,
      action, // 'view', 'focus', 'submit', 'dismiss'
      ...data
    });
  };

  return (
    <div
      onFocus={() => handleNewsletterInteraction('focus')}
      onSubmit={() => handleNewsletterInteraction('submit')}
    >
      {children}
    </div>
  );
}
