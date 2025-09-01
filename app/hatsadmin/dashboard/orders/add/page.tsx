"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HiArrowLeft, HiPlus, HiTrash } from "react-icons/hi2"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency } from "@/lib/currencies"
import { secureAdminApi } from '@/lib/secure-admin-api';

interface OrderItem {
  id: string
  productId?: number
  productName: string
  quantity: number
  price: number
  isManual: boolean
  productSearch: string
}

interface SearchProduct {
  id: number
  name: string
  price: number
}

export default function AddOrderPage() {
  const router = useRouter()
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth()
  const { currency } = useSettings()
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    billingAddress: "",
    paymentMethod: "card",
    orderStatus: "pending",
    notes: "",
    shippingMethod: "standard",
    taxRate: "10"
  })

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const searchAbortRef = useRef<Record<string, AbortController>>({})
  const [searchResults, setSearchResults] = useState<Record<string, SearchProduct[]>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Client-side validation
    if (orderItems.length === 0) {
      alert('Please add at least one item')
      return
    }
    const invalidRow = orderItems.find(i => !i.isManual && !i.productId)
    if (invalidRow) {
      alert('Please select a product for each non-manual item')
      return
    }
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = (subtotal * parseFloat(formData.taxRate || "0")) / 100
    const total = subtotal + tax

    const payload = {
      customer: { name: formData.customerName, email: formData.customerEmail },
      shippingAddress: formData.shippingAddress,
      billingAddress: formData.billingAddress || formData.shippingAddress,
      status: formData.orderStatus,
      totalPrice: total,
      items: orderItems.map(i => ({
        isManual: i.isManual,
        productId: i.isManual ? undefined : i.productId,
        productName: i.isManual ? (i.productName || 'Manual Item') : undefined,
        quantity: i.quantity,
        price: i.price,
      })),
    } as any

    try {
      if (!isReady || !isAuthenticated) throw new Error('Not authenticated')
      const res = await secureAdminApi.createOrder(payload)
      if (!res.success) throw new Error(res.error || 'Failed to create order')
      router.push("/hatsadmin/dashboard/orders")
    } catch (err) {
      console.error('Create order failed', err)
      alert(err instanceof Error ? err.message : 'Failed to create order')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      productId: undefined,
      productName: "",
      quantity: 1,
      price: 0,
      isManual: false,
      productSearch: ""
    }
    setOrderItems(prev => [...prev, newItem])
  }

  const updateOrderItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setOrderItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeOrderItem = (id: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== id))
  }

  const toggleManual = (id: string, manual: boolean) => {
    setOrderItems(prev => prev.map(item =>
      item.id === id ? {
        ...item,
        isManual: manual,
        // clear selection when switching modes
        productId: manual ? undefined : item.productId,
        productName: manual ? item.productName : item.productName,
      } : item
    ))
  }

  const searchProducts = async (id: string, query: string) => {
    if (!isReady || !isAuthenticated) return;
    if (query.trim().length < 1) { setSearchResults(prev => ({ ...prev, [id]: [] })); return }
    if (searchAbortRef.current[id]) searchAbortRef.current[id].abort()
    const ac = new AbortController(); searchAbortRef.current[id] = ac
    try {
      const res = await secureAdminApi.getProducts({ limit: 8, search: query })
      if (!res.success) return
      const products: SearchProduct[] = ((res as any).data?.products || (res as any).products || []).map((p: any) => ({ id: p.id, name: p.name, price: p.price }))
      setSearchResults(prev => ({ ...prev, [id]: products }))
    } catch (err:any) {
      if (err?.name === 'AbortError') return
      console.warn('product search failed', err)
    }
  }

  const selectSearchProduct = (rowId: string, p: SearchProduct) => {
    setOrderItems(prev => prev.map(item =>
      item.id === rowId ? {
        ...item,
        productId: p.id,
        productName: p.name,
        price: item.price > 0 ? item.price : (Number(p.price) || 0),
        isManual: false,
        productSearch: p.name,
      } : item
    ))
    setSearchResults(prev => ({ ...prev, [rowId]: [] }))
  }

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = (subtotal * parseFloat(formData.taxRate || "0")) / 100
  const total = subtotal + tax

  return (
    <div className="flex flex-col h-full w-full">
      <PageHeader 
        title="Create Order" 
        subtitle="Create a manual order for a customer"
      >
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="gap-2 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Customer Information */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="customerName" className="text-sm font-medium">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        placeholder="Enter customer name"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerEmail" className="text-sm font-medium">Email *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                        placeholder="customer@example.com"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customerPhone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="shippingAddress" className="text-sm font-medium">Shipping Address *</Label>
                    <Input
                      id="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange("shippingAddress", e.target.value)}
                      placeholder="123 Main St, City, State, ZIP"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="billingAddress" className="text-sm font-medium">Billing Address</Label>
                    <Input
                      id="billingAddress"
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                      placeholder="Same as shipping or different address"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shippingMethod" className="text-sm font-medium">Shipping Method</Label>
                    <Select value={formData.shippingMethod} onValueChange={(value: string) => handleInputChange("shippingMethod", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Shipping (5-7 days)</SelectItem>
                        <SelectItem value="express">Express Shipping (2-3 days)</SelectItem>
                        <SelectItem value="overnight">Overnight Shipping (1 day)</SelectItem>
                        <SelectItem value="pickup">Store Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Order Items</CardTitle>
                  <Button type="button" onClick={addOrderItem} variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-lg rounded-xl">
                    <HiPlus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  {orderItems.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <p>No items added yet</p>
                      <Button type="button" onClick={addOrderItem} variant="outline" className="mt-4 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-lg rounded-xl">
                        <HiPlus className="h-4 w-4 mr-2" />
                        Add First Item
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orderItems.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-xl bg-white/70 backdrop-blur-sm border-slate-200/50 hover:shadow-md transition-shadow">
                          <div className="text-sm font-medium text-gray-500 w-8">
                            #{index + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="md:col-span-3">
                              {/* Product Selector / Manual Toggle */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    id={`manual-${item.id}`}
                                    type="checkbox"
                                    checked={item.isManual}
                                    onChange={(e) => toggleManual(item.id, e.target.checked)}
                                  />
                                  <label htmlFor={`manual-${item.id}`} className="text-sm">Manual item</label>
                                </div>
                                {item.isManual ? (
                                  <Input
                                    placeholder="Manual product name"
                                    value={item.productName}
                                    onChange={(e) => updateOrderItem(item.id, "productName", e.target.value)}
                                  />
                                ) : (
                                  <div className="relative">
                                    <Input
                                      placeholder="Search products by name"
                                      value={item.productSearch}
                                      onChange={(e) => {
                                        const q = e.target.value
                                        updateOrderItem(item.id, "productSearch", q)
                                        searchProducts(item.id, q)
                                      }}
                                    />
                                    {searchResults[item.id] && searchResults[item.id]!.length > 0 && (
                                      <div className="absolute z-10 mt-1 w-full bg-white/95 border rounded-xl shadow-xl border-slate-200/50">
                                        {searchResults[item.id]!.map(p => (
                                          <button
                                            key={p.id}
                                            type="button"
                                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg"
                                            onClick={() => selectSearchProduct(item.id, p)}
                                          >
                                            <div className="flex justify-between">
                                              <span>{p.name}</span>
                                              <span className="text-sm text-slate-500">{formatCurrency(Number(p.price || 0), currency)}</span>
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Input
                              type="number"
                              placeholder="Qty"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateOrderItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                            />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              value={item.price}
                              onChange={(e) => updateOrderItem(item.id, "price", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="text-sm font-medium w-20 text-right">
                            {formatCurrency(item.price * item.quantity, currency)}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOrderItem(item.id)}
                            className="text-red-600 hover:text-red-700 rounded-xl"
                          >
                            <HiTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Order Summary */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({formData.taxRate}%):</span>
                    <span>{formatCurrency(tax, currency)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(total, currency)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Status */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Payment & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod" className="text-sm font-medium">Payment Method</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value: string) => handleInputChange("paymentMethod", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="orderStatus" className="text-sm font-medium">Order Status</Label>
                    <Select value={formData.orderStatus} onValueChange={(value: string) => handleInputChange("orderStatus", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="taxRate" className="text-sm font-medium">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange("taxRate", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="notes" className="text-sm font-medium">Internal Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Internal notes about this order..."
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 rounded-xl">
                  Create Order
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-lg rounded-xl"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
