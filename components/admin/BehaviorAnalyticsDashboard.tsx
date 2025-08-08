"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  Brain,
  Eye,
  MousePointer,
  Heart,
  Target,
  Zap
} from 'lucide-react';

interface BehaviorAnalytics {
  summary: {
    totalUsers: number;
    activeUsers: number;
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    conversionRate: number;
    cartAbandonmentRate: number;
  };
  segments: Record<string, number>;
  customerLifecycle: any[];
  cartAnalysis: {
    totalCarts: number;
    abandonedCarts: number;
    completedCarts: number;
    abandonmentRate: number;
  };
  aiInsights: Array<{
    type: string;
    title: string;
    message: string;
    action: string;
    priority: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    tactics: string[];
  }>;
}

export default function BehaviorAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<BehaviorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/behavior?dateRange=${dateRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set analytics to null so error state is shown
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading behavioral analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load analytics data</p>
        <Button onClick={fetchAnalytics} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-500" />;
      default: return <Brain className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            AI Behavioral Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Advanced customer behavior insights and predictive analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Button onClick={fetchAnalytics} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.summary.activeUsers}
                </p>
                <p className="text-xs text-gray-500">
                  of {analytics.summary.totalUsers} total
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.summary.conversionRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  {analytics.summary.totalOrders} orders
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cart Abandonment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.summary.cartAbandonmentRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  {analytics.cartAnalysis.abandonedCarts} abandoned
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${analytics.summary.avgOrderValue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  ${analytics.summary.totalRevenue.toFixed(2)} total
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Segments
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            Behavior
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.aiInsights.map((insight, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg"
                  >
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{insight.message}</p>
                      <p className="text-blue-600 text-sm font-medium">{insight.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Customer Segmentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analytics.segments).map(([segment, count]) => (
                  <div key={segment} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {segment.replace('_', ' ')}
                      </h3>
                      <span className="text-2xl font-bold text-blue-600">{count}</span>
                    </div>
                    <Progress 
                      value={(count / analytics.summary.totalUsers) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {((count / analytics.summary.totalUsers) * 100).toFixed(1)}% of customers
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Lifecycle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Customer Lifecycle Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.customerLifecycle.slice(0, 10).map((customer, index) => (
                  <div 
                    key={customer.id} 
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </span>
                        <Badge variant="outline" className="capitalize">
                          {customer.stage.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${customer.totalSpent.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.floor(customer.daysSinceSignup)} days ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          {/* Cart Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
                Cart Behavior Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {analytics.cartAnalysis.totalCarts}
                  </div>
                  <p className="text-sm text-gray-600">Total Carts Created</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {analytics.cartAnalysis.abandonedCarts}
                  </div>
                  <p className="text-sm text-gray-600">Abandoned Carts</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analytics.cartAnalysis.completedCarts}
                  </div>
                  <p className="text-sm text-gray-600">Completed Purchases</p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Abandonment Rate</span>
                  <span className="text-sm font-bold text-red-600">
                    {analytics.cartAnalysis.abandonmentRate.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={analytics.cartAnalysis.abandonmentRate} 
                  className="h-3"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Actionable Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analytics.recommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{rec.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Suggested Tactics:</p>
                      <ul className="space-y-1">
                        {rec.tactics.map((tactic, tacticIndex) => (
                          <li key={tacticIndex} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            {tactic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
