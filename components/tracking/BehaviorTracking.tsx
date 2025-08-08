"use client";

import { useBehaviorTracking, useCartTracking } from '@/hooks/useBehaviorTracking';
import { useAuth } from '@/components/auth/AuthContext';
import { useEffect } from 'react';

// Simplified user data interface
interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

// Inline useUser hook to avoid import issues
function useUser() {
  const { user: firebaseUser, loading } = useAuth();

  const user: UserData | null = firebaseUser ? {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || undefined,
    firstName: firebaseUser.displayName?.split(' ')[0] || undefined,
    lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || undefined,
  } : null;

  return {
    user,
    loading,
    isAuthenticated: !!user
  };
}

interface BehaviorTrackingProviderProps {
  children: React.ReactNode;
}

export function BehaviorTrackingProvider({ children }: BehaviorTrackingProviderProps) {
  const { user } = useUser();
  const { trackEvent } = useBehaviorTracking({ 
    userId: user?.id,
    enabled: true 
  });

  // Track app-level events
  useEffect(() => {
    // Track app initialization
    trackEvent({
      eventType: 'app_init',
      eventData: {
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        timestamp: Date.now()
      }
    });

    // Track user authentication status changes
    if (user) {
      trackEvent({
        eventType: 'user_authenticated',
        eventData: {
          userId: user.id,
          timestamp: Date.now()
        }
      });
    }
  }, [user, trackEvent]);

  return <>{children}</>;
}

// Component to wrap product listings and track viewing behavior
interface ProductViewTrackerProps {
  product: any;
  children: React.ReactNode;
  viewType?: 'grid' | 'list' | 'detail';
}

export function ProductViewTracker({ product, children, viewType = 'grid' }: ProductViewTrackerProps) {
  const { user } = useUser();
  const { trackProductView, trackProductInteraction } = useBehaviorTracking({ 
    userId: user?.id 
  });

  useEffect(() => {
    // Track product view when component mounts
    const viewStartTime = Date.now();
    
    trackProductView(product);

    // Track view duration when component unmounts
    return () => {
      const viewDuration = Date.now() - viewStartTime;
      if (viewDuration > 1000) { // Only track if viewed for more than 1 second
        trackProductView(product, viewDuration);
      }
    };
  }, [product.id, trackProductView]);

  const handleProductClick = (interactionType: string, data?: any) => {
    trackProductInteraction(product, interactionType, data);
  };

  return (
    <div 
      onMouseEnter={() => handleProductClick('hover')}
      onClick={() => handleProductClick('click', { viewType })}
    >
      {children}
    </div>
  );
}

// Enhanced cart button with behavior tracking
interface CartButtonProps {
  product: any;
  quantity?: number;
  children: React.ReactNode;
  className?: string;
}

export function CartButton({ product, quantity = 1, children, className }: CartButtonProps) {
  const { user } = useUser();
  const { trackCartAdd } = useCartTracking(user?.id);

  const handleAddToCart = () => {
    // Your existing add to cart logic here
    // ...

    // Track the cart addition
    trackCartAdd(product, quantity);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className={className}
    >
      {children}
    </button>
  );
}

// Search tracking component
interface SearchTrackerProps {
  onSearch: (query: string) => void;
}

export function SearchTracker({ onSearch }: SearchTrackerProps) {
  const { user } = useUser();
  const { trackSearch } = useBehaviorTracking({ userId: user?.id });

  const handleSearch = (query: string) => {
    // Perform the search
    onSearch(query);
    
    // Track the search behavior
    trackSearch(query);
  };

  return { handleSearch };
}

// Checkout progress tracker
interface CheckoutTrackerProps {
  step: string;
  cartItems: any[];
  cartValue: number;
}

export function CheckoutTracker({ step, cartItems, cartValue }: CheckoutTrackerProps) {
  const { user } = useUser();
  const { trackCheckoutStart, trackCheckoutStep } = useBehaviorTracking({ 
    userId: user?.id 
  });

  useEffect(() => {
    if (step === 'start') {
      trackCheckoutStart(cartItems, cartValue);
    } else {
      trackCheckoutStep(step, {
        cartValue,
        itemCount: cartItems.length,
        timestamp: Date.now()
      });
    }
  }, [step, cartItems, cartValue, trackCheckoutStart, trackCheckoutStep]);

  return null; // This is a tracking-only component
}

// Purchase completion tracker
interface PurchaseTrackerProps {
  order: any;
}

export function PurchaseTracker({ order }: PurchaseTrackerProps) {
  const { user } = useUser();
  const { trackPurchase } = useBehaviorTracking({ userId: user?.id });

  useEffect(() => {
    if (order) {
      trackPurchase(order);
    }
  }, [order, trackPurchase]);

  return null;
}

// Engagement tracker for interactive elements
interface EngagementTrackerProps {
  engagementType: string;
  elementId?: string;
  children: React.ReactNode;
}

export function EngagementTracker({ 
  engagementType, 
  elementId, 
  children 
}: EngagementTrackerProps) {
  const { user } = useUser();
  const { trackEngagement } = useBehaviorTracking({ userId: user?.id });

  const handleEngagement = (event: any) => {
    trackEngagement(engagementType, {
      elementId,
      eventType: event.type,
      timestamp: Date.now()
    });
  };

  return (
    <div
      onMouseEnter={(e) => handleEngagement(e)}
      onClick={(e) => handleEngagement(e)}
      onFocus={(e) => handleEngagement(e)}
    >
      {children}
    </div>
  );
}

// Error tracking component
export function ErrorTracker() {
  const { user } = useUser();
  const { trackError } = useBehaviorTracking({ userId: user?.id });

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackError]);

  return null;
}
