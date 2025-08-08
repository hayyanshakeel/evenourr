'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency as formatCurrencyUtil } from '@/lib/currencies';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  ArrowLeft,
  Package,
  User,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  Truck,
  MessageCircle,
  Edit,
  Save,
  Mail,
  Phone,
  Calendar,
  Tag,
  FileText,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface ReturnDetail {
  id: string;
  rmaNumber: string;
  orderId: number;
  status: string;
  reason: string;
  reasonCategory: string;
  description?: string;
  refundAmount: number;
  refundMethod?: string;
  priority: string;
  trackingNumber?: string;
  carrierName?: string;
  returnLabel?: string;
  processedBy?: string;
  processedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  completedAt?: string;
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  order: {
    id: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    user?: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
    customer?: {
      id: number;
      name: string;
      email: string;
    };
    orderItems: Array<{
      id: number;
      quantity: number;
      price: number;
      product: {
        id: number;
        name: string;
        imageUrl?: string;
      };
      variant?: {
        id: number;
        title: string;
        sku?: string;
      };
    }>;
  };
  returnItems: Array<{
    id: number;
    productId: number;
    variantId?: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    condition: string;
    productName: string;
    variantTitle?: string;
    product: {
      id: number;
      name: string;
      imageUrl?: string;
    };
    variant?: {
      id: number;
      title: string;
      sku?: string;
    };
  }>;
  returnUpdates: Array<{
    id: number;
    status: string;
    message: string;
    isPublic: boolean;
    createdBy: string;
    createdAt: string;
  }>;
}

export default function ReturnDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isReady, isAuthenticated } = useAdminAuth();
  const { currency } = useSettings();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [returnData, setReturnData] = useState<ReturnDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    refundAmount: '',
    refundMethod: '',
    priority: '',
    trackingNumber: '',
    carrierName: '',
    returnLabel: '',
    adminNotes: '',
  });
  const [newUpdate, setNewUpdate] = useState({
    message: '',
    isPublic: true,
  });
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // Fetch return data
  const fetchReturnData = async () => {
    if (!user || !params.id) return;
    
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/returns/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch return data');
      }

      const data = await response.json();
      setReturnData(data);
      setUpdateData({
        status: data.status,
        refundAmount: data.refundAmount.toString(),
        refundMethod: data.refundMethod || '',
        priority: data.priority,
        trackingNumber: data.trackingNumber || '',
        carrierName: data.carrierName || '',
        returnLabel: data.returnLabel || '',
        adminNotes: data.adminNotes || '',
      });
    } catch (error) {
      console.error('Error fetching return data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update return
  const handleUpdateReturn = async () => {
    if (!user || !params.id) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/returns/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updateData,
          refundAmount: parseFloat(updateData.refundAmount) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update return');
      }

      await fetchReturnData();
      setEditing(false);
    } catch (error) {
      console.error('Error updating return:', error);
    }
  };

  // Add return update
  const handleAddUpdate = async () => {
    if (!user || !params.id || !newUpdate.message.trim()) return;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/returns/${params.id}/updates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to add update');
      }

      await fetchReturnData();
      setNewUpdate({ message: '', isPublic: true });
      setShowUpdateDialog(false);
    } catch (error) {
      console.error('Error adding update:', error);
    }
  };

  useEffect(() => {
    fetchReturnData();
  }, [user, params.id]);

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

  // Condition badge styling
  const getConditionBadge = (condition: string) => {
    const conditionConfig = {
      returned: { bg: 'bg-emerald-100', text: 'text-black' },
      damaged: { bg: 'bg-rose-100', text: 'text-black' },
      defective: { bg: 'bg-red-100', text: 'text-black' },
      missing: { bg: 'bg-gray-100', text: 'text-black' },
    };

    const config = conditionConfig[condition as keyof typeof conditionConfig] || conditionConfig.returned;

    return (
      <Badge className={`${config.bg} ${config.text} !text-black border-0 font-medium`}>
        {condition.charAt(0).toUpperCase() + condition.slice(1)}
      </Badge>
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, currency);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (!returnData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Return Not Found</h2>
          <p className="text-muted-foreground mb-4">The return you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/hatsadmin/dashboard/returns">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Returns
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/hatsadmin/dashboard/returns">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Returns
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Return {returnData.rmaNumber}</h1>
            <p className="text-muted-foreground">
              Created on {formatDate(returnData.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Add Update
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Return Update</DialogTitle>
                <DialogDescription>
                  Add a note or update to this return request
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={newUpdate.message}
                    onChange={(e) => setNewUpdate({ ...newUpdate, message: e.target.value })}
                    placeholder="Enter your update message..."
                    rows={4}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newUpdate.isPublic}
                    onChange={(e) => setNewUpdate({ ...newUpdate, isPublic: e.target.checked })}
                  />
                  <Label htmlFor="isPublic">Visible to customer</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUpdate}>Add Update</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {editing ? (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateReturn}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Return
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Return Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Return Overview
                <div className="flex space-x-2">
                  {getStatusBadge(returnData.status)}
                  {getPriorityBadge(returnData.priority)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">RMA Number</Label>
                  <p className="font-medium">{returnData.rmaNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Order</Label>
                  <Link 
                    href={`/hatsadmin/dashboard/orders/${returnData.orderId}`}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    #{returnData.orderId}
                  </Link>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Reason Category</Label>
                  <p className="font-medium capitalize">{returnData.reasonCategory.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Refund Amount</Label>
                  <p className="font-medium text-green-600">{formatCurrency(returnData.refundAmount)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Reason</Label>
                <p className="mt-1">{returnData.reason}</p>
              </div>

              {returnData.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="mt-1">{returnData.description}</p>
                </div>
              )}

              {returnData.customerNotes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Customer Notes</Label>
                  <p className="mt-1 bg-blue-50 p-3 rounded-md">{returnData.customerNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Return Items */}
          <Card>
            <CardHeader>
              <CardTitle>Return Items</CardTitle>
              <CardDescription>
                {returnData.returnItems.length} item{returnData.returnItems.length !== 1 ? 's' : ''} being returned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnData.returnItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      {item.product.imageUrl ? (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.productName}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{item.productName}</h4>
                          {item.variantTitle && (
                            <p className="text-sm text-muted-foreground">{item.variantTitle}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="text-sm">Unit: {formatCurrency(item.unitPrice)}</span>
                            <span className="text-sm font-medium">Total: {formatCurrency(item.totalPrice)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getConditionBadge(item.condition)}
                          <Link 
                            href={`/hatsadmin/dashboard/products/${item.productId}`}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            View Product <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Return Updates Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Return Updates</CardTitle>
              <CardDescription>
                Timeline of updates and status changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnData.returnUpdates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No updates yet</p>
                ) : (
                  returnData.returnUpdates.map((update, index) => (
                    <div key={update.id} className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        {index < returnData.returnUpdates.length - 1 && (
                          <div className="w-px h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{update.createdBy}</span>
                            {!update.isPublic && (
                              <Badge variant="secondary" className="text-xs">Internal</Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(update.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1">{update.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                <p className="font-medium">
                  {returnData.order.user
                    ? `${returnData.order.user.firstName} ${returnData.order.user.lastName}`
                    : returnData.order.customer?.name || 'N/A'
                  }
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">
                    {returnData.order.user?.email || returnData.order.customer?.email || 'N/A'}
                  </p>
                  {(returnData.order.user?.email || returnData.order.customer?.email) && (
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Mail className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Customer Since</Label>
                <p className="font-medium">
                  {formatDate(returnData.order.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Return Details */}
          <Card>
            <CardHeader>
              <CardTitle>Return Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={updateData.status} onValueChange={(value) => setUpdateData({ ...updateData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={updateData.priority} onValueChange={(value) => setUpdateData({ ...updateData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refundAmount">Refund Amount</Label>
                    <Input
                      id="refundAmount"
                      type="number"
                      step="0.01"
                      value={updateData.refundAmount}
                      onChange={(e) => setUpdateData({ ...updateData, refundAmount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refundMethod">Refund Method</Label>
                    <Select value={updateData.refundMethod} onValueChange={(value) => setUpdateData({ ...updateData, refundMethod: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select method</SelectItem>
                        <SelectItem value="original_payment">Original Payment Method</SelectItem>
                        <SelectItem value="store_credit">Store Credit</SelectItem>
                        <SelectItem value="exchange">Exchange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <Input
                      id="trackingNumber"
                      value={updateData.trackingNumber}
                      onChange={(e) => setUpdateData({ ...updateData, trackingNumber: e.target.value })}
                      placeholder="Enter tracking number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carrierName">Carrier</Label>
                    <Input
                      id="carrierName"
                      value={updateData.carrierName}
                      onChange={(e) => setUpdateData({ ...updateData, carrierName: e.target.value })}
                      placeholder="e.g., FedEx, UPS, USPS"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea
                      id="adminNotes"
                      value={updateData.adminNotes}
                      onChange={(e) => setUpdateData({ ...updateData, adminNotes: e.target.value })}
                      placeholder="Internal notes..."
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                    <div className="mt-1">
                      {getPriorityBadge(returnData.priority)}
                    </div>
                  </div>

                  {returnData.refundMethod && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Refund Method</Label>
                      <p className="font-medium capitalize">{returnData.refundMethod.replace('_', ' ')}</p>
                    </div>
                  )}

                  {returnData.trackingNumber && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tracking Number</Label>
                      <p className="font-medium">{returnData.trackingNumber}</p>
                      {returnData.carrierName && (
                        <p className="text-sm text-muted-foreground">{returnData.carrierName}</p>
                      )}
                    </div>
                  )}

                  {returnData.processedBy && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Processed By</Label>
                      <p className="font-medium">{returnData.processedBy}</p>
                      {returnData.processedAt && (
                        <p className="text-sm text-muted-foreground">{formatDate(returnData.processedAt)}</p>
                      )}
                    </div>
                  )}

                  {returnData.adminNotes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Admin Notes</Label>
                      <p className="mt-1 bg-gray-50 p-3 rounded-md text-sm">{returnData.adminNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Original Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Order Number</Label>
                <Link 
                  href={`/hatsadmin/dashboard/orders/${returnData.orderId}`}
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                >
                  #{returnData.orderId} <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Order Total</Label>
                <p className="font-medium">{formatCurrency(returnData.order.totalPrice)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Order Status</Label>
                <p className="font-medium capitalize">{returnData.order.status}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Order Date</Label>
                <p className="font-medium">{formatDate(returnData.order.createdAt)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Items in Order</Label>
                <p className="font-medium">{returnData.order.orderItems.length} item{returnData.order.orderItems.length !== 1 ? 's' : ''}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
