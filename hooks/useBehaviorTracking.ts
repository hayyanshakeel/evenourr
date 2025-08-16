import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface BehaviorEvent {
  eventType: string;
  eventData?: any;
  pageUrl?: string;
  userAgent?: string;
  timestamp?: number;
}

interface UseBehaviorTrackingProps {
  userId?: string;
  sessionId?: string;
  enabled?: boolean;
}

export function useBehaviorTracking({ 
  userId, 
  sessionId, 
  enabled = true 
}: UseBehaviorTrackingProps = {}) {
  const pathname = usePathname();
  const sessionIdRef = useRef(sessionId || generateSessionId());
  const pageStartTime = useRef<number>(Date.now());
  const lastScrollPosition = useRef<number>(0);
  const timeOnPage = useRef<number>(0);

  // Track behavior event
  const trackEvent = useCallback(async (event: BehaviorEvent) => {
    if (!enabled) return;

    try {
      const payload = {
        userId,
        sessionId: sessionIdRef.current,
        eventType: event.eventType,
        eventData: event.eventData,
        pageUrl: event.pageUrl || window.location.href,
        userAgent: navigator.userAgent,
        timestamp: event.timestamp || Date.now(),
      };

      await fetch('/api/analytics/behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error tracking behavior event:', error);
    }
  }, [userId, enabled]);

  // Track page views
  useEffect(() => {
    if (!enabled) return;

    pageStartTime.current = Date.now();
    trackEvent({
      eventType: 'page_view',
      eventData: {
        page: pathname,
        referrer: document.referrer,
        timestamp: Date.now()
      }
    });

    // Track page unload/time on page
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - pageStartTime.current;
      trackEvent({
        eventType: 'page_exit',
        eventData: {
          page: pathname,
          timeSpent,
          timestamp: Date.now()
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Track exit when component unmounts
    };
  }, [pathname, trackEvent, enabled]);

  // Track scroll behavior
  useEffect(() => {
    if (!enabled) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;

        // Track significant scroll events
        if (Math.abs(scrollPosition - lastScrollPosition.current) > 500) {
          trackEvent({
            eventType: 'scroll_engagement',
            eventData: {
              page: pathname,
              scrollPosition,
              scrollPercentage: Math.round(scrollPercentage),
              direction: scrollPosition > lastScrollPosition.current ? 'down' : 'up'
            }
          });
          lastScrollPosition.current = scrollPosition;
        }
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [pathname, trackEvent, enabled]);

  // Track cart events
  const trackCartAdd = useCallback((product: any, quantity: number = 1) => {
    trackEvent({
      eventType: 'cart_add',
      eventData: {
        productId: product.id,
        productName: product.title,
        productPrice: product.price,
        quantity,
        cartValue: product.price * quantity,
        page: pathname
      }
    });
  }, [trackEvent, pathname]);

  const trackCartRemove = useCallback((product: any, quantity: number = 1) => {
    trackEvent({
      eventType: 'cart_remove',
      eventData: {
        productId: product.id,
        productName: product.title,
        productPrice: product.price,
        quantity,
        cartValue: product.price * quantity,
        page: pathname
      }
    });
  }, [trackEvent, pathname]);

  const trackCartAbandon = useCallback((cartItems: any[], cartValue: number) => {
    trackEvent({
      eventType: 'cart_abandon',
      eventData: {
        cartItems: cartItems.map(item => ({
          productId: item.id,
          productName: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        cartValue,
        itemCount: cartItems.length,
        page: pathname,
        timeSpentBeforeAbandon: Date.now() - pageStartTime.current
      }
    });
  }, [trackEvent, pathname]);

  // Track product interactions
  const trackProductView = useCallback((product: any, viewDuration?: number) => {
    trackEvent({
      eventType: 'product_view',
      eventData: {
        productId: product.id,
        productName: product.title,
        productPrice: product.price,
        productCategory: product.category,
        viewDuration,
        page: pathname
      }
    });
  }, [trackEvent, pathname]);

  const trackProductInteraction = useCallback((product: any, interactionType: string, data?: any) => {
    trackEvent({
      eventType: 'product_interaction',
      eventData: {
        productId: product.id,
        productName: product.title,
        interactionType, // 'image_click', 'zoom', 'variant_select', 'description_expand'
        ...data,
        page: pathname
      }
    });
  }, [trackEvent, pathname]);

  // Track search behavior
  const trackSearch = useCallback((query: string, resultsCount?: number, filters?: any) => {
    trackEvent({
      eventType: 'search',
      eventData: {
        query,
        resultsCount,
        filters,
        page: pathname
      }
    });
  }, [trackEvent, pathname]);

  // Track checkout events
  const trackCheckoutStart = useCallback((cartItems: any[], cartValue: number) => {
    trackEvent({
      eventType: 'checkout_start',
      eventData: {
        cartItems: cartItems.map(item => ({
          productId: item.id,
          productName: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        cartValue,
        itemCount: cartItems.length,
        page: pathname
      }
    });
  }, [trackEvent, pathname]);

  const trackCheckoutStep = useCallback((step: string, stepData?: any) => {
    trackEvent({
      eventType: 'checkout_step',
      eventData: {
        step, // 'shipping', 'payment', 'review'
        ...stepData,
        page: pathname
      }
    });
  }, [trackEvent, pathname]);

  const trackPurchase = useCallback((order: any) => {
    trackEvent({
      eventType: 'purchase',
      eventData: {
        orderId: order.id,
        orderValue: order.totalPrice,
        items: order.items?.map((item: any) => ({
          productId: item.productId,
          productName: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: order.paymentMethod,
        shippingMethod: order.shippingMethod,
        page: pathname
      }
    });
  }, [trackEvent, pathname]);

  // Track engagement events
  const trackEngagement = useCallback((engagementType: string, data?: any) => {
    trackEvent({
      eventType: 'engagement',
      eventData: {
        engagementType, // 'click', 'hover', 'focus', 'video_play', 'form_interaction'
        ...data,
        page: pathname,
        timestamp: Date.now()
      }
    });
  }, [trackEvent, pathname]);

  // Track errors or issues
  const trackError = useCallback((errorType: string, errorData?: any) => {
    trackEvent({
      eventType: 'error',
      eventData: {
        errorType, // 'api_error', 'validation_error', 'payment_error'
        ...errorData,
        page: pathname,
        userAgent: navigator.userAgent
      }
    });
  }, [trackEvent, pathname]);

  return {
    trackEvent,
    trackCartAdd,
    trackCartRemove,
    trackCartAbandon,
    trackProductView,
    trackProductInteraction,
    trackSearch,
    trackCheckoutStart,
    trackCheckoutStep,
    trackPurchase,
    trackEngagement,
    trackError,
    sessionId: sessionIdRef.current
  };
}

// Generate a unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
