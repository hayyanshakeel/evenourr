'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import { useSettings } from '@/hooks/useSettings';
import { CURRENCIES } from '@/lib/currencies';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  UserPlusIcon 
} from '@heroicons/react/24/outline';

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
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
        
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Add product to order
  const addProduct = (product: Product) => {
    const existingItem = orderForm.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Increase quantity if product already exists
      setOrderForm(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      // Add new product
      setOrderForm(prev => ({
        ...prev,
        items: [...prev.items, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl
        }]
      }));
    }
    
    setProductSearch('');
    setShowProductSearch(false);
  };

  // Remove product from order
  const removeProduct = (productId: number) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId)
    }));
  };

  // Update product quantity
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

  // Select customer
  const selectCustomer = (customer: Customer) => {
    setOrderForm(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email
    }));
    setCustomerSearch('');
    setShowCustomerSearch(false);
  };

  // Calculate totals
  const subtotal = orderForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = (subtotal * orderForm.taxRate) / 100;
  const total = subtotal + taxAmount + orderForm.shippingAmount - orderForm.discountAmount;

  // Submit order
  const handleSubmit = async () => {
    if (orderForm.items.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: orderForm.customerId,
          customerName: orderForm.customerName,
          customerEmail: orderForm.customerEmail,
          items: orderForm.items,
          subtotal,
          taxAmount,
          shippingAmount: orderForm.shippingAmount,
          discountAmount: orderForm.discountAmount,
          total,
          notes: orderForm.notes,
        }),
      });

      if (response.ok) {
        router.push('/hatsadmin/dashboard/orders');
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Create order">
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || orderForm.items.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create order'}
          </button>
        </div>
      </Header>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Products</h3>
            </div>
            <div className="p-6">
              {/* Product Search */}
              <div className="relative">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    onFocus={() => setShowProductSearch(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Product Search Results */}
                {showProductSearch && productSearch && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addProduct(product)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                        >
                          {product.imageUrl && (
                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{currencySymbol}{(product.price / 100).toFixed(2)}</div>
                          </div>
                          <div className="text-sm text-gray-500">Stock: {product.inventory}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500">No products found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Products */}
              <div className="mt-6">
                {orderForm.items.length > 0 ? (
                  <div className="space-y-4">
                    {orderForm.items.map((item) => (
                      <div key={item.productId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">{currencySymbol}{(item.price / 100).toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                          <button
                            onClick={() => removeProduct(item.productId)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="font-medium text-gray-900">
                          {currencySymbol}{((item.price * item.quantity) / 100).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-lg">No products added</div>
                    <div className="text-sm">Search and add products to create an order</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Payment</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{currencySymbol}{(subtotal / 100).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Shipping</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={(orderForm.shippingAmount / 100).toFixed(2)}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, shippingAmount: Math.round(parseFloat(e.target.value || '0') * 100) }))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Discount</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={(orderForm.discountAmount / 100).toFixed(2)}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, discountAmount: Math.round(parseFloat(e.target.value || '0') * 100) }))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tax ({orderForm.taxRate}%)</span>
                <span className="font-medium">{currencySymbol}{(taxAmount / 100).toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between py-2">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-lg font-medium text-gray-900">{currencySymbol}{(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Customer</h3>
            </div>
            <div className="p-6">
              {orderForm.customerId ? (
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">{orderForm.customerName}</div>
                  <div className="text-sm text-gray-500">{orderForm.customerEmail}</div>
                  <button
                    onClick={() => setOrderForm(prev => ({ ...prev, customerId: null, customerName: '', customerEmail: '' }))}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Change customer
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or create a customer"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    onFocus={() => setShowCustomerSearch(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {showCustomerSearch && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {customerSearch && (
                        <button
                          onClick={() => {
                            setOrderForm(prev => ({ ...prev, customerName: customerSearch, customerEmail: '' }));
                            setCustomerSearch('');
                            setShowCustomerSearch(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 border-b"
                        >
                          <UserPlusIcon className="h-5 w-5 text-gray-400" />
                          <span>Create customer "{customerSearch}"</span>
                        </button>
                      )}
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => selectCustomer(customer)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50"
                        >
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Notes</h3>
            </div>
            <div className="p-6">
              <textarea
                placeholder="Add notes about this order..."
                value={orderForm.notes}
                onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Currency Display */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Currency</h3>
            </div>
            <div className="p-6">
              <div className="text-sm text-gray-500">
                {CURRENCIES[currency]?.name} ({currency})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
