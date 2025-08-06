"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HiArrowLeft, HiPlus, HiTrash } from "react-icons/hi2"

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
}

export default function AddOrderPage() {
  const router = useRouter()
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const orderData = {
      ...formData,
      items: orderItems,
      subtotal: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      tax: (orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * parseFloat(formData.taxRate)) / 100,
      total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * (1 + parseFloat(formData.taxRate) / 100),
      orderNumber: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    console.log("Creating order:", orderData)
    router.push("/hatsadmin/dashboard/orders")
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
      productName: "",
      quantity: 1,
      price: 0
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
          className="gap-2"
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
              <Card>
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
              <Card>
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Order Items</CardTitle>
                  <Button type="button" onClick={addOrderItem} variant="outline" size="sm">
                    <HiPlus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  {orderItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No items added yet</p>
                      <Button type="button" onClick={addOrderItem} variant="outline" className="mt-4">
                        <HiPlus className="h-4 w-4 mr-2" />
                        Add First Item
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orderItems.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="text-sm font-medium text-gray-500 w-8">
                            #{index + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                              <Input
                                placeholder="Product name"
                                value={item.productName}
                                onChange={(e) => updateOrderItem(item.id, "productName", e.target.value)}
                              />
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
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOrderItem(item.id)}
                            className="text-red-600 hover:text-red-700"
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
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({formData.taxRate}%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Status */}
              <Card>
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
              <Card>
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
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Order
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
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
