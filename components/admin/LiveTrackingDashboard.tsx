"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  ShoppingCart, 
  Search,
  MousePointer,
  Eye,
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

interface LiveEvent {
  id: string;
  timestamp: number;
  eventType: string;
  userId?: string;
  eventData: any;
  pageUrl: string;
}

interface LiveStats {
  activeUsers: number;
  currentPageViews: number;
  cartEvents: number;
  searchEvents: number;
  purchaseEvents: number;
  totalEvents: number;
}

export default function LiveTrackingDashboard() {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    activeUsers: 0,
    currentPageViews: 0,
    cartEvents: 0,
    searchEvents: 0,
    purchaseEvents: 0,
    totalEvents: 0
  });
  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time data (in production, you'd use WebSocket or Server-Sent Events)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving real-time events
      const mockEvent: LiveEvent = {
        id: `event_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        eventType: getRandomEventType(),
        userId: Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 100)}` : undefined,
        eventData: generateMockEventData(),
        pageUrl: getRandomPageUrl()
      };

      setLiveEvents(prev => [mockEvent, ...prev.slice(0, 49)]); // Keep last 50 events

      // Update live stats
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + (Math.random() > 0.8 ? 1 : 0),
        currentPageViews: prev.currentPageViews + (mockEvent.eventType === 'page_view' ? 1 : 0),
        cartEvents: prev.cartEvents + (mockEvent.eventType.includes('cart') ? 1 : 0),
        searchEvents: prev.searchEvents + (mockEvent.eventType === 'search' ? 1 : 0),
        purchaseEvents: prev.purchaseEvents + (mockEvent.eventType === 'purchase' ? 1 : 0),
        totalEvents: prev.totalEvents + 1
      }));
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds

    setIsConnected(true);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const getRandomEventType = (): string => {
    const eventTypes = [
      'page_view', 'product_view', 'cart_add', 'cart_remove', 
      'search', 'scroll_engagement', 'checkout_start', 'purchase',
      'product_interaction', 'cart_abandon'
    ];
    const randomIndex = Math.floor(Math.random() * eventTypes.length);
    return eventTypes[randomIndex] || 'page_view';
  };

  const generateMockEventData = () => {
    return {
      productId: `prod_${Math.floor(Math.random() * 100)}`,
      value: Math.floor(Math.random() * 500),
      category: ['electronics', 'clothing', 'books', 'home'][Math.floor(Math.random() * 4)]
    };
  };

  const getRandomPageUrl = (): string => {
    const pages = [
      '/', '/product/item-1', '/product/item-2', '/search', '/cart', '/checkout'
    ];
    const randomIndex = Math.floor(Math.random() * pages.length);
    return pages[randomIndex] || '/';
  };

  const getEventIcon = (eventType: string) => {
    switch (true) {
      case eventType.includes('page'):
        return <Eye className="h-4 w-4 text-blue-500" />;
      case eventType.includes('cart'):
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case eventType.includes('search'):
        return <Search className="h-4 w-4 text-purple-500" />;
      case eventType.includes('purchase'):
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case eventType.includes('product'):
        return <MousePointer className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (true) {
      case eventType.includes('purchase'):
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case eventType.includes('cart'):
        return 'bg-green-100 text-green-800 border-green-200';
      case eventType.includes('abandon'):
        return 'bg-red-100 text-red-800 border-red-200';
      case eventType.includes('search'):
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            Live Behavioral Tracking
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time user behavior monitoring and analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{liveStats.activeUsers}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{liveStats.currentPageViews}</p>
              </div>
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cart Events</p>
                <p className="text-2xl font-bold text-gray-900">{liveStats.cartEvents}</p>
              </div>
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Searches</p>
                <p className="text-2xl font-bold text-gray-900">{liveStats.searchEvents}</p>
              </div>
              <Search className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{liveStats.purchaseEvents}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{liveStats.totalEvents}</p>
              </div>
              <Activity className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Event Stream */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Live Event Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {liveEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Waiting for live events...</p>
              </div>
            ) : (
              liveEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.eventType)}
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={getEventColor(event.eventType)}>
                          {event.eventType.replace('_', ' ')}
                        </Badge>
                        {event.userId && (
                          <span className="text-xs text-gray-500">
                            {event.userId}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.pageUrl}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatTime(event.timestamp)}
                    </p>
                    {event.eventData.value && (
                      <p className="text-xs text-gray-500">
                        ${event.eventData.value}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              View Active Users
            </Button>
            <Button variant="outline" className="justify-start">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart Abandonment Alert
            </Button>
            <Button variant="outline" className="justify-start">
              <Search className="h-4 w-4 mr-2" />
              Popular Searches
            </Button>
            <Button variant="outline" className="justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Conversion Funnel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
