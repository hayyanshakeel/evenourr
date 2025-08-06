"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HiPlus, HiTrash } from "react-icons/hi2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
}

interface AddOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (order: any) => void
}

export function AddOrderModal({ isOpen, onClose, onSave }: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "card",
    orderStatus: "pending",
    notes: ""
  })

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const orderData = {
      ...formData,
      items: orderItems,
      total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      orderNumber: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    onSave(orderData)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      paymentMethod: "card",
      orderStatus: "pending",
      notes: ""
    })
    setOrderItems([])
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
      productId: "",
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

  const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <HiPlus className="h-5 w-5 text-blue-600" />
            Create New Order
          </DialogTitle>
          <DialogDescription>
            Create a manual order for a customer. Fill in the customer details and add products.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="text-sm font-medium">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Enter customer name"
                    className="mt-1"
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
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="shippingAddress" className="text-sm font-medium">Shipping Address *</Label>
                  <Input
                    id="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={(e) => handleInputChange("shippingAddress", e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                    className="mt-1"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paymentMethod" className="text-sm font-medium">Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value: string) => handleInputChange("paymentMethod", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="orderStatus" className="text-sm font-medium">Order Status</Label>
                  <Select value={formData.orderStatus} onValueChange={(value: string) => handleInputChange("orderStatus", value)}>
                    <SelectTrigger className="mt-1">
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
                  <Label htmlFor="notes" className="text-sm font-medium">Order Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Additional notes..."
                    className="mt-1"
                  />
                </div>

                <div className="pt-2 border-t">
                  <div className="text-lg font-semibold">
                    Total: ${orderTotal.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Order Items</CardTitle>
              <Button type="button" onClick={addOrderItem} variant="outline" size="sm">
                <HiPlus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No items added yet. Click "Add Item" to get started.
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <Input
                          placeholder="Product name"
                          value={item.productName}
                          onChange={(e) => updateOrderItem(item.id, "productName", e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Quantity"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => updateOrderItem(item.id, "price", parseFloat(e.target.value) || 0)}
                        />
                        <div className="text-sm font-medium py-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
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

          <DialogFooter className="flex gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
