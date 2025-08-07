'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Package,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

interface Return {
  id: string;
  rmaNumber: string;
  orderId: number;
  status: string;
  reason: string;
  reasonCategory: string;
  refundAmount: number;
  priority: string;
  createdAt: string;
  updatedAt: string;
  order: {
    id: number;
    totalPrice: number;
    user?: {
      email: string;
      firstName: string;
      lastName: string;
    };
    customer?: {
      name: string;
      email: string;
    };
  };
  returnItems: Array<{
    id: number;
    productName: string;
    variantTitle?: string;
    quantity: number;
    totalPrice: number;
  }>;
  _count: {
    returnItems: number;
    returnUpdates: number;
  };
}

interface ReturnStats {
  totalReturns: number;
  pendingReturns: number;
  approvedReturns: number;
  completedReturns: number;
  rejectedReturns: number;
  totalRefundAmount: number;
  returnRate: number;
  returnsByReason: Array<{ reason: string; _count: { reason: number } }>;
  returnsByCategory: Array<{ reasonCategory: string; _count: { reasonCategory: number } }>;
}

interface Filters {
  status: string;
  reasonCategory: string;
  priority: string;
  search: string;
  dateFrom: string;
  dateTo: string;
}

export default function ReturnsPage() {
  const { token, isReady, isAuthenticated } = useAdminAuth();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [returns, setReturns] = useState<Return[]>([]);
  const [stats, setStats] = useState<ReturnStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    reasonCategory: '',
    priority: '',
    search: '',
    dateFrom: '',
    dateTo: '',
  });

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // Fetch returns data
  const fetchReturns = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.status && { status: filters.status }),
        ...(filters.reasonCategory && { reasonCategory: filters.reasonCategory }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      });

      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/returns?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch returns');
      }

      const data = await response.json();
      setReturns(data.returns);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching returns:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const params = new URLSearchParams({
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      });

      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/returns/stats?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchReturns();
    fetchStats();
  }, [user, page, filters]);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { 
        bg: 'bg-amber-100', 
        text: 'text-black', 
        icon: Clock 
      },
      approved: { 
        bg: 'bg-sky-100', 
        text: 'text-black', 
        icon: CheckCircle 
      },
      rejected: { 
        bg: 'bg-rose-100', 
        text: 'text-black', 
        icon: XCircle 
      },
      processing: { 
        bg: 'bg-violet-100', 
        text: 'text-black', 
        icon: RefreshCw 
      },
      completed: { 
        bg: 'bg-emerald-100', 
        text: 'text-black', 
        icon: CheckCircle 
      },
      cancelled: { 
        bg: 'bg-gray-100', 
        text: 'text-black', 
        icon: XCircle 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.requested;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.bg} ${config.text} !text-black border-0 font-medium`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { bg: 'bg-gray-100', text: 'text-black' },
      normal: { bg: 'bg-sky-100', text: 'text-black' },
      high: { bg: 'bg-amber-100', text: 'text-black' },
      urgent: { bg: 'bg-rose-100', text: 'text-black' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal;

    return (
      <Badge className={`${config.bg} ${config.text} !text-black border-0 font-medium`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  // Category badge styling
  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      defective: { bg: 'bg-rose-100', text: 'text-black' },
      wrong_item: { bg: 'bg-amber-100', text: 'text-black' },
      changed_mind: { bg: 'bg-sky-100', text: 'text-black' },
      damaged: { bg: 'bg-red-100', text: 'text-black' },
      other: { bg: 'bg-gray-100', text: 'text-black' },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;

    return (
      <Badge className={`${config.bg} ${config.text} !text-black border-0 font-medium`}>
        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isReady || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Returns & RMA</h1>
          <p className="text-muted-foreground">
            Manage customer returns and return merchandise authorizations
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => {
            fetchReturns();
            fetchStats();
          }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Return
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Return</DialogTitle>
                <DialogDescription>
                  Create a new return request for a customer order
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Return creation form will be implemented here</p>
                <p className="text-sm">This will allow creating returns from existing orders</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReturns}</div>
              <p className="text-xs text-muted-foreground">
                Return rate: {stats.returnRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReturns}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRefundAmount)}</div>
              <p className="text-xs text-muted-foreground">
                From approved returns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalReturns > 0 ? Math.round((stats.completedReturns / stats.totalReturns) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.completedReturns} of {stats.totalReturns} completed
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="RMA number, customer..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filters.reasonCategory} onValueChange={(value) => setFilters({ ...filters, reasonCategory: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  <SelectItem value="defective">Defective</SelectItem>
                  <SelectItem value="wrong_item">Wrong Item</SelectItem>
                  <SelectItem value="changed_mind">Changed Mind</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date From</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date To</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  status: '',
                  reasonCategory: '',
                  priority: '',
                  search: '',
                  dateFrom: '',
                  dateTo: '',
                });
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
            <Button onClick={() => {
              setPage(1);
              fetchReturns();
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Returns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Returns & RMA Requests</CardTitle>
          <CardDescription>
            {returns.length} return{returns.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RMA Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-muted-foreground">No returns found</p>
                      <p className="text-sm text-muted-foreground">
                        Returns will appear here when customers request them
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  returns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">
                        <Link 
                          href={`/hatsadmin/dashboard/returns/${returnItem.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {returnItem.rmaNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {returnItem.order.user
                              ? `${returnItem.order.user.firstName} ${returnItem.order.user.lastName}`
                              : returnItem.order.customer?.name || 'N/A'
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {returnItem.order.user?.email || returnItem.order.customer?.email || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link 
                          href={`/hatsadmin/dashboard/orders/${returnItem.orderId}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          #{returnItem.orderId}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(returnItem.order.totalPrice)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{returnItem._count.returnItems} item{returnItem._count.returnItems !== 1 ? 's' : ''}</div>
                        <div className="text-sm text-muted-foreground">
                          {returnItem.returnItems.slice(0, 2).map(item => item.productName).join(', ')}
                          {returnItem.returnItems.length > 2 && ` +${returnItem.returnItems.length - 2} more`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate" title={returnItem.reason}>
                          {returnItem.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(returnItem.reasonCategory)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(returnItem.status)}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(returnItem.priority)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(returnItem.refundAmount)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(returnItem.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/hatsadmin/dashboard/returns/${returnItem.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/hatsadmin/dashboard/returns/${returnItem.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Return
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
