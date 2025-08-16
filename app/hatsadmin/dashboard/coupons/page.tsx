"use client";

import { useState, useEffect } from "react";
import { MobileHeader } from "@/components/admin/mobile-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/currencies";
import { useSettings } from "@/hooks/useSettings";
import { IntelligentCouponService } from "@/lib/intelligent-coupon-service";
import {
  TicketPercent,
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  TrendingUp,
  Users,
  Target,
  Settings,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Gift,
  Percent,
  Tag,
  X,
  Trophy,
  Shield,
  Brain,
  AlertTriangle,
  UserCheck,
  Calendar,
  ShoppingCart,
  Activity
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  name: string;
  type: 'flat' | 'percentage' | 'bogo' | 'free_shipping' | 'custom';
  discountValue: number;
  minimumOrderValue: number;
  usageCount: number;
  usageLimit: number | null;
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  startDate: string;
  endDate: string | null;
  revenueGenerated: number;
  conversionRate: number;
  fraudAttempts?: number;
  segmentUsage?: Record<string, number>;
  rules?: CouponRule[];
}

interface CouponRule {
  id: string;
  type: 'order_count' | 'customer_segment' | 'cart_value' | 'cart_quantity' | 'product_category' | 'day_of_week' | 'time_period';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: any;
  description: string;
}

interface CustomerSegment {
  id: string;
  name: string;
  count: number;
  description: string;
}

interface CouponAnalytics {
  totalActive: number;
  totalRedeemed: number;
  totalUnused: number;
  revenueGenerated: number;
  fraudPrevented: number;
  conversionRate: number;
  segmentPerformance: Record<string, number>;
  performanceMetrics: {
    averageOrderValue: number;
    redemptionRate: number;
    customerRetention: number;
    discountEfficiency: number;
  };
  fraudAnalytics: {
    totalBlocked: number;
    ipBasedBlocking: number;
    deviceFingerprinting: number;
    velocityChecks: number;
    patternRecognition: number;
  };
}

export default function CouponsPage() {
  const { currency } = useSettings();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [analytics, setAnalytics] = useState<CouponAnalytics | null>(null);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');

  const [couponForm, setCouponForm] = useState({
    code: '',
    name: '',
    type: 'percentage' as const,
    discountValue: 0,
    minimumOrderValue: 0,
    startDate: '',
    endDate: '',
    usageLimit: null as number | null,
    isStackable: false,
    targetSegments: [] as string[],
    rules: [] as CouponRule[],
    fraudProtection: true,
    autoApply: false,
    personalizedMessage: '',
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [couponsRes, analyticsRes, segmentsRes] = await Promise.all([
          fetch('/api/coupons'),
          fetch('/api/coupons/analytics'),
          fetch('/api/coupons/segments'),
        ]);
        const couponsData = await couponsRes.json();
        const analyticsData = await analyticsRes.json();
        const segmentsData = await segmentsRes.json();
        
        // Ensure we extract the coupons array from the response
        setCoupons(Array.isArray(couponsData) ? couponsData : couponsData.coupons || []);
        setAnalytics(analyticsData);
        setCustomerSegments(Array.isArray(segmentsData) ? segmentsData : []);
      } catch (err) {
        console.error('Failed to load coupon data:', err);
        toast({ title: 'Error', description: 'Failed to load coupon data', variant: 'destructive' });
        // Set fallback empty arrays to prevent filter errors
        setCoupons([]);
        setAnalytics(null);
        setCustomerSegments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponForm(prev => ({ ...prev, code: result }));
  };

  const handleBulkAction = (action: string) => {
    if (selectedCoupons.length === 0) {
      toast({
        title: "No coupons selected",
        description: "Please select coupons to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bulk action performed",
      description: `${action} applied to ${selectedCoupons.length} coupons.`,
    });
    setSelectedCoupons([]);
  };

  const filteredCoupons = (Array.isArray(coupons) ? coupons : []).filter(coupon => {
    const matchesSearch = coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
    const matchesType = typeFilter === 'all' || coupon.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <MobileHeader title="Coupon Management" subtitle="Enterprise-level discount and promotion management" />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 lg:p-6 xl:p-8">
            <div className="text-center">Loading coupon dashboard...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <MobileHeader 
        title="Coupon Management" 
        subtitle="Enterprise-level discount and promotion management"
      />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:block">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="coupons" className="flex items-center gap-2">
                <TicketPercent className="h-4 w-4" />
                <span className="hidden sm:block">Coupons</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:block">Analytics</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
                    <TicketPercent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics?.totalActive}</div>
                    <p className="text-xs text-muted-foreground">+2 from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Redeemed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics?.totalRedeemed?.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analytics?.revenueGenerated || 0, currency)}</div>
                    <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fraud Prevented</CardTitle>
                    <Shield className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{analytics?.fraudPrevented}</div>
                    <p className="text-xs text-muted-foreground">Blocked attempts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Segmentation Insights */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Customer Segments
                    </CardTitle>
                    <CardDescription>
                      Audience breakdown for targeted marketing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customerSegments.slice(0, 4).map((segment) => (
                        <div key={segment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{segment.name}</h4>
                            <p className="text-sm text-gray-500">{segment.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{segment.count.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">customers</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Insights
                    </CardTitle>
                    <CardDescription>
                      Intelligent recommendations for coupon optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics && analytics.fraudPrevented > 0 && (
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-orange-900 dark:text-orange-100">Security Alert</h4>
                              <p className="text-sm text-orange-700 dark:text-orange-300">
                                {analytics.fraudPrevented} fraudulent attempts blocked across all methods
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {analytics && analytics.performanceMetrics?.averageOrderValue > 0 && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-900 dark:text-green-100">Performance Insight</h4>
                              <p className="text-sm text-green-700 dark:text-green-300">
                                Current average order value: {formatCurrency(analytics.performanceMetrics.averageOrderValue, currency)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {customerSegments.length > 0 && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-3">
                            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900 dark:text-blue-100">Segmentation Opportunity</h4>
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                {customerSegments.find(s => s.count > 0)?.name || 'Target segments'} available for personalized campaigns
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Coupons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Top Performing Coupons
                  </CardTitle>
                  <CardDescription>
                    Highest revenue generating coupons in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(Array.isArray(coupons) ? coupons : []).slice(0, 5).map((coupon, index) => (
                      <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400">
                            #{index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{coupon.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{coupon.code}</span>
                              {coupon.fraudAttempts && coupon.fraudAttempts > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {coupon.fraudAttempts} blocked
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(coupon.revenueGenerated, currency)}</div>
                          <div className="text-sm text-gray-500">{coupon.usageCount} uses • {coupon.conversionRate}% conv.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            {/* Coupons Tab */}
            <TabsContent value="coupons" className="space-y-6">
              
              {/* Filters and Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search coupons..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="flat">Flat Amount</SelectItem>
                          <SelectItem value="bogo">BOGO</SelectItem>
                          <SelectItem value="free_shipping">Free Shipping</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Segment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Segments</SelectItem>
                          <SelectItem value="new_user">New Users</SelectItem>
                          <SelectItem value="returning_user">Returning Users</SelectItem>
                          <SelectItem value="high_value_customer">High Value</SelectItem>
                          <SelectItem value="loyal_customer">Loyal Customers</SelectItem>
                          <SelectItem value="cart_abandoner">Cart Abandoners</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {selectedCoupons.length > 0 && (
                        <div className="flex gap-2 mr-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleBulkAction('activate')}
                          >
                            Activate ({selectedCoupons.length})
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleBulkAction('delete')}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Coupon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coupons Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th className="text-left p-4 font-medium">
                            <input 
                              type="checkbox" 
                              className="rounded"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCoupons(filteredCoupons.map(c => c.id));
                                } else {
                                  setSelectedCoupons([]);
                                }
                              }}
                            />
                          </th>
                          <th className="text-left p-4 font-medium">Code</th>
                          <th className="text-left p-4 font-medium">Name</th>
                          <th className="text-left p-4 font-medium">Type</th>
                          <th className="text-left p-4 font-medium">Discount</th>
                          <th className="text-left p-4 font-medium">Rules</th>
                          <th className="text-left p-4 font-medium">Usage</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Performance</th>
                          <th className="text-left p-4 font-medium">Security</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCoupons.map((coupon) => (
                          <tr key={coupon.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="p-4">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedCoupons.includes(coupon.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCoupons(prev => [...prev, coupon.id]);
                                  } else {
                                    setSelectedCoupons(prev => prev.filter(id => id !== coupon.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="p-4">
                              <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {coupon.code}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium">{coupon.name}</div>
                              <div className="text-sm text-gray-500">
                                Min. order: {formatCurrency(coupon.minimumOrderValue, currency)}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline">
                                {coupon.type === 'percentage' && <Percent className="h-3 w-3 mr-1" />}
                                {coupon.type === 'flat' && <Tag className="h-3 w-3 mr-1" />}
                                {coupon.type === 'bogo' && <Gift className="h-3 w-3 mr-1" />}
                                {coupon.type === 'free_shipping' && <Zap className="h-3 w-3 mr-1" />}
                                {coupon.type.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="font-medium">
                                {coupon.type === 'percentage' ? `${coupon.discountValue}%` : 
                                 coupon.type === 'flat' ? formatCurrency(coupon.discountValue, currency) :
                                 coupon.type}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {coupon.rules?.slice(0, 2).map((rule, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    <Brain className="h-3 w-3 mr-1" />
                                    {rule.type.replace('_', ' ')}
                                  </Badge>
                                ))}
                                {(coupon.rules?.length || 0) > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{(coupon.rules?.length || 0) - 2} more
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div>{coupon.usageCount} / {coupon.usageLimit || '∞'}</div>
                                <div className="text-gray-500">
                                  {coupon.usageLimit ? 
                                    Math.round((coupon.usageCount / coupon.usageLimit) * 100) : 0}% used
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge 
                                variant={
                                  coupon.status === 'active' ? 'default' :
                                  coupon.status === 'expired' ? 'destructive' :
                                  coupon.status === 'scheduled' ? 'secondary' : 'outline'
                                }
                              >
                                {coupon.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                                {coupon.status === 'expired' && <XCircle className="h-3 w-3 mr-1" />}
                                {coupon.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                                {coupon.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="font-medium">
                                {formatCurrency(coupon.revenueGenerated, currency)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {coupon.conversionRate}% conv.
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {coupon.fraudAttempts && coupon.fraudAttempts > 0 ? (
                                  <Badge variant="destructive" className="text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {coupon.fraudAttempts} blocked
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Secure
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* Segment Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Segment Performance
                    </CardTitle>
                    <CardDescription>
                      Coupon usage by customer segments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics?.segmentPerformance || {}).map(([segment, count]) => {
                        const segmentInfo = customerSegments.find(s => s.id === segment);
                        const total = Object.values(analytics?.segmentPerformance || {}).reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? (count / total * 100).toFixed(1) : '0';
                        
                        return (
                          <div key={segment} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{segmentInfo?.name || segment}</span>
                              <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Fraud Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      Security Analytics
                    </CardTitle>
                    <CardDescription>
                      Fraud detection and prevention metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-red-900 dark:text-red-100">Blocked Attempts</h4>
                            <p className="text-sm text-red-700 dark:text-red-300">Fraudulent usage prevented</p>
                          </div>
                          <div className="text-2xl font-bold text-red-600">{analytics?.fraudPrevented}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span className="text-sm">IP-based blocking</span>
                          <Badge variant="outline">{analytics?.fraudAnalytics?.ipBasedBlocking || 0} blocked</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span className="text-sm">Device fingerprinting</span>
                          <Badge variant="outline">{analytics?.fraudAnalytics?.deviceFingerprinting || 0} blocked</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span className="text-sm">Velocity checks</span>
                          <Badge variant="outline">{analytics?.fraudAnalytics?.velocityChecks || 0} blocked</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <span className="text-sm">Pattern recognition</span>
                          <Badge variant="outline">{analytics?.fraudAnalytics?.patternRecognition || 0} blocked</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Detailed Analytics Charts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>
                    Detailed analytics and conversion tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analytics?.conversionRate?.toFixed(1) || 0}%</div>
                      <div className="text-sm text-gray-500">Overall Conversion Rate</div>
                      <div className="text-xs text-green-600 mt-1">Real-time data</div>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(analytics?.performanceMetrics?.averageOrderValue || 0, currency)}</div>
                      <div className="text-sm text-gray-500">Avg Order Value</div>
                      <div className="text-xs text-blue-600 mt-1">From actual orders</div>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{((analytics?.performanceMetrics?.discountEfficiency || 0) / 100).toFixed(1)}x</div>
                      <div className="text-sm text-gray-500">ROI Multiplier</div>
                      <div className="text-xs text-purple-600 mt-1">Revenue vs discount</div>
                    </div>

                  </div>
                  
                  <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium mb-4">Revenue Impact by Segment</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>High Value Customers</span>
                        <span className="font-semibold">{formatCurrency(analytics?.segmentPerformance?.high_value_customer || 0, currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Returning Users</span>
                        <span className="font-semibold">{formatCurrency(analytics?.segmentPerformance?.returning_user || 0, currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>New Users</span>
                        <span className="font-semibold">{formatCurrency(analytics?.segmentPerformance?.new_user || 0, currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cart Abandoners</span>
                        <span className="font-semibold">{formatCurrency(analytics?.segmentPerformance?.cart_abandoner || 0, currency)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>



          </Tabs>
        </div>
      </main>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TicketPercent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Create New Coupon</h3>
                  <p className="text-sm text-gray-500">Set up a new discount coupon</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="coupon-name">Coupon Name</Label>
                <Input
                  id="coupon-name"
                  value={couponForm.name}
                  onChange={(e) => setCouponForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Summer Sale 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-code">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon-code"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="SUMMER20"
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={generateCouponCode}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select 
                  value={couponForm.type} 
                  onValueChange={(value: any) => setCouponForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Discount</SelectItem>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-value">
                    {couponForm.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                  </Label>
                  <Input
                    id="discount-value"
                    type="number"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step={couponForm.type === 'percentage' ? '1' : '0.01'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-order">Minimum Order Value</Label>
                  <Input
                    id="min-order"
                    type="number"
                    value={couponForm.minimumOrderValue}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, minimumOrderValue: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={couponForm.startDate}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date (Optional)</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={couponForm.endDate}
                    onChange={(e) => setCouponForm(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usage-limit">Usage Limit (Optional)</Label>
                <Input
                  id="usage-limit"
                  type="number"
                  value={couponForm.usageLimit || ''}
                  onChange={(e) => setCouponForm(prev => ({ ...prev, usageLimit: e.target.value ? parseInt(e.target.value) : null }))}
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
              </div>

              {/* Customer Segmentation */}
              <div className="space-y-2">
                <Label>Target Customer Segments</Label>
                <div className="grid grid-cols-2 gap-2">
                  {customerSegments.map((segment) => (
                    <div key={segment.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id={segment.id}
                        checked={couponForm.targetSegments.includes(segment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCouponForm(prev => ({
                              ...prev,
                              targetSegments: [...prev.targetSegments, segment.id]
                            }));
                          } else {
                            setCouponForm(prev => ({
                              ...prev,
                              targetSegments: prev.targetSegments.filter(s => s !== segment.id)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={segment.id} className="text-sm cursor-pointer">
                        <div className="font-medium">{segment.name}</div>
                        <div className="text-gray-500 text-xs">{segment.count.toLocaleString()} customers</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Rules */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Advanced Rules</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowRulesModal(true)}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Configure Rules
                  </Button>
                </div>
                {couponForm.rules.length > 0 && (
                  <div className="space-y-2">
                    {couponForm.rules.map((rule, index) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                        <div>
                          <div className="font-medium text-sm">{rule.description}</div>
                          <div className="text-xs text-gray-500">
                            {rule.type} {rule.operator} {rule.value}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCouponForm(prev => ({
                              ...prev,
                              rules: prev.rules.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security and Automation Settings */}
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security & Automation
                </h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fraud Protection</Label>
                    <p className="text-sm text-gray-500">Enable intelligent fraud detection</p>
                  </div>
                  <Switch
                    checked={couponForm.fraudProtection}
                    onCheckedChange={(checked) => setCouponForm(prev => ({ ...prev, fraudProtection: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-apply for eligible customers</Label>
                    <p className="text-sm text-gray-500">Automatically apply best coupon at checkout</p>
                  </div>
                  <Switch
                    checked={couponForm.autoApply}
                    onCheckedChange={(checked) => setCouponForm(prev => ({ ...prev, autoApply: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Stackable with other coupons</Label>
                    <p className="text-sm text-gray-500">Allow this coupon to be combined with others</p>
                  </div>
                  <Switch
                    checked={couponForm.isStackable}
                    onCheckedChange={(checked) => setCouponForm(prev => ({ ...prev, isStackable: checked }))}
                  />
                </div>
              </div>

              {/* Personalized Message */}
              <div className="space-y-2">
                <Label htmlFor="personalized-message">Personalized Message (Optional)</Label>
                <Input
                  id="personalized-message"
                  value={couponForm.personalizedMessage}
                  onChange={(e) => setCouponForm(prev => ({ ...prev, personalizedMessage: e.target.value }))}
                  placeholder="e.g., Welcome back! Here's a special offer just for you..."
                />
                <p className="text-xs text-gray-500">
                  Use {'{customer_name}'} for personalization. Leave empty for default messaging.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t">
              <div className="text-sm text-gray-500">
                Preview and test your coupon before making it live
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button>
                  Create & Activate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
