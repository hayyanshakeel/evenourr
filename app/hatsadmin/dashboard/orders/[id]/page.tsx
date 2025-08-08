"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, User, CreditCard, Truck, Calendar, DollarSign, MapPin, FileText } from "lucide-react"
import { AdminOrder } from "@/lib/admin-data"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency } from "@/lib/currencies"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth()
  const orderId = parseInt(params.id as string)
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { currency } = useSettings()

  useEffect(() => {
    if (isReady && isAuthenticated && orderId) {
      fetchOrder()
    }
  }, [isReady, isAuthenticated, orderId])

  async function fetchOrder() {
    try {
      const response = await makeAuthenticatedRequest(`/api/admin/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(nextStatus: string) {
    try {
      setUpdating(true)
      const res = await makeAuthenticatedRequest(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
      if (!res.ok) throw new Error(`Failed to update status (${res.status})`)
      await fetchOrder()
    } catch (err) {
      console.error('updateStatus failed', err)
      alert(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  async function cancelOrder() {
    if (!confirm('Are you sure you want to cancel this order?')) return
    await updateStatus('cancelled')
  }

  const statusColors: { [key: string]: string } = {
    pending: "bg-amber-100 text-black !bg-amber-100 !text-black",
    processing: "bg-sky-100 text-black !bg-sky-100 !text-black", 
    paid: "bg-emerald-100 text-black !bg-emerald-100 !text-black",
    shipped: "bg-violet-100 text-black !bg-violet-100 !text-black",
    delivered: "bg-emerald-100 text-black !bg-emerald-100 !text-black",
    cancelled: "bg-rose-100 text-black !bg-rose-100 !text-black",
    fulfilled: "bg-emerald-100 text-black !bg-emerald-100 !text-black",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading order details...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
        <p className="text-gray-500 mb-4">The order you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/hatsadmin/dashboard/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    )
  }

  const customerName = order.customer?.name || (order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Unknown Customer')
  const customerEmail = order.customer?.email || order.user?.email || ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/hatsadmin/dashboard/orders')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Badge 
              variant="secondary"
              className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items ({order.orderItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      {item.product.imageUrl && (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price, currency)}</p>
                        <p className="text-sm text-gray-500">each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{customerName}</p>
                  <p className="text-sm text-gray-600">{customerEmail}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Billing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping & Billing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-semibold">Shipping Address</div>
                    <div className="text-gray-600 break-words">{(order as any).shippingAddress || '—'}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Billing Address</div>
                    <div className="text-gray-600 break-words">{(order as any).billingAddress || '—'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="font-semibold">Shipping Method</div>
                      <div className="text-gray-600">{(order as any).shippingMethod || '—'}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Payment Method</div>
                      <div className="text-gray-600">{(order as any).paymentMethod || '—'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.totalPrice, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{typeof (order as any).taxRate === 'number' ? `${((order as any).taxRate as number).toFixed(2)}%` : '$0.00'}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.totalPrice, currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions: Update Status / Cancel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Manage Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" disabled={updating} onClick={() => updateStatus('processing')}>Mark Processing</Button>
                  <Button variant="outline" disabled={updating} onClick={() => updateStatus('paid')}>Mark Paid</Button>
                  <Button variant="outline" disabled={updating} onClick={() => updateStatus('shipped')}>Mark Shipped</Button>
                  <Button variant="outline" disabled={updating} onClick={() => updateStatus('delivered')}>Mark Delivered</Button>
                </div>
                <Button variant="destructive" disabled={updating} onClick={cancelOrder}>Cancel Order</Button>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Order placed</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {order.status === 'paid' && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Payment confirmed</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.status === 'shipped' && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Order shipped</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
