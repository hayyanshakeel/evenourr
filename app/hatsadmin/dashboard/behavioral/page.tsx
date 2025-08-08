import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BehaviorAnalyticsDashboard from '@/components/admin/BehaviorAnalyticsDashboard';
import LiveTrackingDashboard from '@/components/admin/LiveTrackingDashboard';
import { Brain, Activity, Users, TrendingUp } from 'lucide-react';

export default function CompleteBehaviorDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Brain className="h-10 w-10 text-blue-600" />
          AI Behavioral Tracking System
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive behavioral analytics, real-time monitoring, and AI-powered customer insights
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tracking Events</p>
                <p className="text-lg font-bold text-blue-600">15+ Types</p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Insights</p>
                <p className="text-lg font-bold text-purple-600">Real-time</p>
              </div>
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Data</p>
                <p className="text-lg font-bold text-orange-600">Enhanced</p>
              </div>
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Behavioral Analytics
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <BehaviorAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <LiveTrackingDashboard />
        </TabsContent>
      </Tabs>

      {/* Quick Start Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            System Features & Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">✅ Implemented Features</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Global behavior tracking provider</li>
                <li>• Product view tracking</li>
                <li>• Cart interaction monitoring</li>
                <li>• Search behavior analysis</li>
                <li>• Error tracking system</li>
                <li>• Customer segmentation AI</li>
                <li>• Churn prediction algorithms</li>
                <li>• Real-time analytics APIs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🧠 AI Capabilities</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Customer lifetime value prediction</li>
                <li>• Purchase probability scoring</li>
                <li>• Engagement level assessment</li>
                <li>• Cart abandonment risk analysis</li>
                <li>• Behavioral pattern recognition</li>
                <li>• Automated recommendation generation</li>
                <li>• Risk factor identification</li>
                <li>• Campaign trigger optimization</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📊 Available Dashboards</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Analytics:</strong> Comprehensive insights</li>
                <li>• <strong>Live Tracking:</strong> Real-time events</li>
                <li>• <strong>Customer Segments:</strong> AI classification</li>
                <li>• <strong>Behavioral Patterns:</strong> Usage analysis</li>
                <li>• <strong>Recommendations:</strong> Action items</li>
                <li>• <strong>Risk Assessment:</strong> Churn alerts</li>
                <li>• <strong>Performance Metrics:</strong> KPI tracking</li>
                <li>• <strong>Predictive Models:</strong> Future insights</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
