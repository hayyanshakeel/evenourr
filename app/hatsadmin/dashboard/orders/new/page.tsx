'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormLayout } from '@/components/admin/form-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/hooks/useSettings';
import { CURRENCIES } from '@/lib/currencies';
import { 
  Search, 
  X,
  Plus,
  Trash2,
  UserPlus,
  Save 
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  inventory: number;
  imageUrl?: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface OrderForm {
  customerId: number | null;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  notes: string;
  shippingAmount: number;
  discountAmount: number;
  taxRate: number;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const { currency } = useSettings();
  const currencySymbol = CURRENCIES[currency]?.symbol || '$';

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerId: null,
    customerName: '',
    customerEmail: '',
    items: [],
    notes: '',
    shippingAmount: 0,
    discountAmount: 0,
    taxRate: 10, // Default 10% tax
  });

  // Fetch products and customers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/customers')
        ]);

        if (productsRes.ok) {
          try {
            const productsData = await productsRes.json();
            setProducts(productsData);
          } catch (err) {
            console.error('Products API did not return JSON:', err);
          }
        } else {
          const text = await productsRes.text();
          console.error('Products API error:', text);
        }

        if (customersRes.ok) {
          try {
            const customersData = await customersRes.json();
            setCustomers(customersData);
          } catch (err) {
            console.error('Customers API did not return JSON:', err);
          }
        } else {
          const text = await customersRes.text();
          console.error('Customers API error:', text);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    router.push('/hatsadmin/dashboard/orders');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderForm),
      });

      if (response.ok) {
        router.push('/hatsadmin/dashboard/orders');
      } else {
        let errorText = '';
        try {
          errorText = await response.text();
        } catch (err) {
          errorText = 'Unknown error';
        }
        console.error('Failed to create order:', errorText);
        alert('Failed to create order.\n' + errorText);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (product: Product) => {
    const existingItem = orderForm.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      setOrderForm(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      setOrderForm(prev => ({
        ...prev,
        items: [...prev.items, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        }]
      }));
    }
    setShowProductSearch(false);
    setProductSearch('');
  };

  const removeProduct = (productId: number) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId)
    }));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }

    setOrderForm(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    }));
  };

  const selectCustomer = (customer: Customer) => {
    setOrderForm(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
    }));
    setShowCustomerSearch(false);
    setCustomerSearch('');
  };

  const clearCustomer = () => {
    setOrderForm(prev => ({
      ...prev,
      customerId: null,
      customerName: '',
      customerEmail: '',
    }));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const subtotal = orderForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = subtotal * (orderForm.taxRate / 100);
  const total = subtotal + orderForm.shippingAmount - orderForm.discountAmount + taxAmount;

  const actions = (
    <>
      <Button variant="outline" onClick={handleBack} disabled={loading}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} disabled={loading || orderForm.items.length === 0} className="bg-blue-600 hover:bg-blue-700">
        <Save className="h-4 w-4 mr-2" />
        {loading ? 'Creating...' : 'Create Order'}
      </Button>
    </>
  );

  return (
    <FormLayout
      title="New Order"
      subtitle="Create a new order for a customer"
      onBack={handleBack}
      actions={actions}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderForm.customerId ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{orderForm.customerName}</p>
                  <p className="text-sm text-gray-500">{orderForm.customerEmail}</p>
                </div>
                <Button variant="outline" size="sm" onClick={clearCustomer}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Select Customer</Label>
                <div className="relative">
                  <Input
                    placeholder="Search customers..."
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerSearch(true);
                    }}
                    onFocus={() => setShowCustomerSearch(true)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  
                  {showCustomerSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            type="button"
                            onClick={() => selectCustomer(customer)}
                            className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-gray-500 text-center">
                          No customers found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Section */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Product Search */}
            <div className="relative">
              <Input
                placeholder="Search products to add..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowProductSearch(true);
                }}
                onFocus={() => setShowProductSearch(true)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              
              {showProductSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => addProduct(product)}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              {currencySymbol}{product.price.toFixed(2)} • {product.inventory} in stock
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500 text-center">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Items */}
            {orderForm.items.length > 0 ? (
              <div className="space-y-3">
                {orderForm.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{currencySymbol}{item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProduct(item.productId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No items added to the order yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        {orderForm.items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping">Shipping Amount</Label>
                  <Input
                    id="shipping"
                    type="number"
                    step="0.01"
                    value={orderForm.shippingAmount}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, shippingAmount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Amount</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    value={orderForm.discountAmount}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax Rate (%)</Label>
                  <Input
                    id="tax"
                    type="number"
                    step="0.1"
                    value={orderForm.taxRate}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{currencySymbol}{orderForm.shippingAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-{currencySymbol}{orderForm.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({orderForm.taxRate}%):</span>
                  <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea
                  id="notes"
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this order..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </FormLayout>
  );
}
