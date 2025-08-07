'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Package, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  customer?: {
    name: string;
    email: string;
  };
  user?: {
    firstName: string;
    lastName: string;
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
    };
  }>;
}

interface ReturnableItem {
  productId: number;
  variantId?: number;
  productName: string;
  variantTitle?: string;
  orderedQuantity: number;
  returnedQuantity: number;
  availableQuantity: number;
  unitPrice: number;
  imageUrl?: string;
}

interface ReturnFormData {
  orderId: string;
  reason: string;
  reasonCategory: string;
  description: string;
  customerNotes: string;
  items: Array<{
    productId: number;
    variantId?: number;
    quantity: number;
    unitPrice: number;
    productName: string;
    variantTitle?: string;
  }>;
}

interface CreateReturnFormProps {
  onSuccess: () => void;
}

export default function CreateReturnForm({ onSuccess }: CreateReturnFormProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnableItems, setReturnableItems] = useState<ReturnableItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [step, setStep] = useState<'search' | 'items' | 'details'>('search');
  
  const [formData, setFormData] = useState<ReturnFormData>({
    orderId: '',
    reason: '',
    reasonCategory: '',
    description: '',
    customerNotes: '',
    items: [],
  });

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // Search orders
  const searchOrders = async () => {
    if (!user || !searchQuery.trim()) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/orders?search=${encodeURIComponent(searchQuery.trim())}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error searching orders:', error);
    }
  };

  // Get returnable items for selected order
  const getReturnableItems = async (orderId: number) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/orders/${orderId}/returnable-items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReturnableItems(data.items || []);
        setStep('items');
      }
    } catch (error) {
      console.error('Error fetching returnable items:', error);
    }
  };

  // Handle order selection
  const selectOrder = (order: Order) => {
    setSelectedOrder(order);
    setFormData(prev => ({ ...prev, orderId: order.id.toString() }));
    getReturnableItems(order.id);
  };

  // Handle item quantity change
  const updateItemQuantity = (productId: number, variantId: number | undefined, quantity: number) => {
    const key = `${productId}-${variantId || 'null'}`;
    
    if (quantity <= 0) {
      const newSelected = { ...selectedItems };
      delete newSelected[key];
      setSelectedItems(newSelected);
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [key]: quantity
      }));
    }
  };

  // Proceed to details step
  const proceedToDetails = () => {
    const items = returnableItems
      .filter(item => {
        const key = `${item.productId}-${item.variantId || 'null'}`;
        return selectedItems[key] && selectedItems[key] > 0;
      })
      .map(item => {
        const key = `${item.productId}-${item.variantId || 'null'}`;
        const quantity = selectedItems[key];
        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: quantity || 0,
          unitPrice: item.unitPrice,
          productName: item.productName,
          variantTitle: item.variantTitle,
        };
      });

    setFormData(prev => ({ ...prev, items }));
    setStep('details');
  };

  // Submit return request
  const handleSubmit = async () => {
    if (!user || !formData.orderId || formData.items.length === 0) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/returns', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: parseInt(formData.orderId),
          reason: formData.reason,
          reasonCategory: formData.reasonCategory,
          description: formData.description,
          customerNotes: formData.customerNotes,
          items: formData.items,
        }),
      });

      if (response.ok) {
        onSuccess();
        // Reset form
        setStep('search');
        setSelectedOrder(null);
        setReturnableItems([]);
        setSelectedItems({});
        setFormData({
          orderId: '',
          reason: '',
          reasonCategory: '',
          description: '',
          customerNotes: '',
          items: [],
        });
        setSearchQuery('');
        setOrders([]);
      } else {
        const error = await response.json();
        alert(`Error creating return: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating return:', error);
      alert('Error creating return. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (order: Order) => {
    if (order.customer) return order.customer.name;
    if (order.user) return `${order.user.firstName} ${order.user.lastName}`;
    return 'Unknown Customer';
  };

  const getCustomerEmail = (order: Order) => {
    return order.customer?.email || order.user?.email || '';
  };

  if (step === 'search') {
    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="orderSearch">Search Order</Label>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="orderSearch"
                placeholder="Enter order ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && searchOrders()}
              />
            </div>
            <Button onClick={searchOrders} disabled={!searchQuery.trim()}>
              Search
            </Button>
          </div>
        </div>

        {orders.length > 0 && (
          <div className="space-y-3">
            <Label>Select Order</Label>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {orders.map((order) => (
                <Card key={order.id} className="cursor-pointer hover:bg-gray-50" onClick={() => selectOrder(order)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {getCustomerName(order)} • {getCustomerEmail(order)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()} • ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{order.status}</Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.orderItems.length} items
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'items') {
    const selectedCount = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Select Items to Return</h3>
            <p className="text-sm text-gray-500">
              Order #{selectedOrder?.id} • {getCustomerName(selectedOrder!)}
            </p>
          </div>
          <Button variant="outline" onClick={() => setStep('search')}>
            Back to Search
          </Button>
        </div>

        {returnableItems.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No items available for return from this order.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {returnableItems.map((item) => {
                const key = `${item.productId}-${item.variantId || 'null'}`;
                const selectedQty = selectedItems[key] || 0;
                
                return (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          {item.variantTitle && (
                            <p className="text-sm text-gray-500">{item.variantTitle}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            Available: {item.availableQuantity} of {item.orderedQuantity} • ${item.unitPrice.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.productId, item.variantId, selectedQty - 1)}
                            disabled={selectedQty <= 0}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center">{selectedQty}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.productId, item.variantId, selectedQty + 1)}
                            disabled={selectedQty >= item.availableQuantity}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-600">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </p>
              <Button 
                onClick={proceedToDetails} 
                disabled={selectedCount === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Details
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (step === 'details') {
    const totalRefund = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Return Details</h3>
            <p className="text-sm text-gray-500">
              {formData.items.length} item{formData.items.length !== 1 ? 's' : ''} • Total refund: ${totalRefund.toFixed(2)}
            </p>
          </div>
          <Button variant="outline" onClick={() => setStep('items')}>
            Back to Items
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="reasonCategory">Return Category *</Label>
              <Select value={formData.reasonCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, reasonCategory: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defective">Defective</SelectItem>
                  <SelectItem value="wrong_item">Wrong Item</SelectItem>
                  <SelectItem value="damaged">Damaged in Transit</SelectItem>
                  <SelectItem value="not_as_described">Not as Described</SelectItem>
                  <SelectItem value="changed_mind">Changed Mind</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Return Reason *</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Brief reason for return"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details about the return..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="customerNotes">Customer Notes</Label>
              <Textarea
                id="customerNotes"
                value={formData.customerNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, customerNotes: e.target.value }))}
                placeholder="Notes visible to the customer..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setStep('items')}>
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !formData.reason || !formData.reasonCategory}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Creating Return...' : 'Create Return'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
