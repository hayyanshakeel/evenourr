"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HiArrowLeft, HiExclamationTriangle } from "react-icons/hi2"

export default function AddInventoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    quantity: "",
    location: "",
    supplier: "",
    costPrice: "",
    threshold: "",
    notes: "",
    type: "adjustment",
    reason: "",
    batchNumber: "",
    expiryDate: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const inventoryData = {
      ...formData,
      id: Date.now().toString(),
      quantity: parseInt(formData.quantity) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      threshold: parseInt(formData.threshold) || 0,
      totalValue: (parseInt(formData.quantity) || 0) * (parseFloat(formData.costPrice) || 0),
      createdAt: new Date().toISOString(),
      status: parseInt(formData.quantity) > parseInt(formData.threshold) ? "In Stock" : "Low Stock"
    }
    
    console.log("Adding inventory:", inventoryData)
    router.push("/hatsadmin/dashboard/inventory")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const totalValue = (parseInt(formData.quantity) || 0) * (parseFloat(formData.costPrice) || 0)
  const isLowStock = parseInt(formData.quantity) <= parseInt(formData.threshold)

  return (
    <div className="flex flex-col h-full w-full">
      <PageHeader 
        title="Add Inventory Stock" 
        subtitle="Add or adjust inventory stock levels"
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
              
              {/* Product Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="productName" className="text-sm font-medium">Product Name *</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => handleInputChange("productName", e.target.value)}
                      placeholder="Enter product name"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="sku" className="text-sm font-medium">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        placeholder="Product SKU"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="batchNumber" className="text-sm font-medium">Batch Number</Label>
                      <Input
                        id="batchNumber"
                        value={formData.batchNumber}
                        onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                        placeholder="Batch or lot number"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty if product doesn't expire
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="type" className="text-sm font-medium">Transaction Type</Label>
                      <Select value={formData.type} onValueChange={(value: string) => handleInputChange("type", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                          <SelectItem value="restock">Restock</SelectItem>
                          <SelectItem value="return">Return/Refund</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                          <SelectItem value="loss">Stock Loss</SelectItem>
                          <SelectItem value="found">Stock Found</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="reason" className="text-sm font-medium">Reason</Label>
                      <Input
                        id="reason"
                        value={formData.reason}
                        onChange={(e) => handleInputChange("reason", e.target.value)}
                        placeholder="Reason for this transaction"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="quantity" className="text-sm font-medium">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                        placeholder="0"
                        className="mt-2"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use negative numbers to reduce stock
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="threshold" className="text-sm font-medium">Low Stock Threshold</Label>
                      <Input
                        id="threshold"
                        type="number"
                        value={formData.threshold}
                        onChange={(e) => handleInputChange("threshold", e.target.value)}
                        placeholder="10"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Supplier */}
              <Card>
                <CardHeader>
                  <CardTitle>Location & Supplier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                      <Select value={formData.location} onValueChange={(value: string) => handleInputChange("location", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main-warehouse">Main Warehouse</SelectItem>
                          <SelectItem value="store-front">Store Front</SelectItem>
                          <SelectItem value="storage-room">Storage Room</SelectItem>
                          <SelectItem value="supplier">With Supplier</SelectItem>
                          <SelectItem value="returns">Returns Area</SelectItem>
                          <SelectItem value="damaged">Damaged Goods</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="costPrice" className="text-sm font-medium">Cost Price per Unit</Label>
                      <Input
                        id="costPrice"
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => handleInputChange("costPrice", e.target.value)}
                        placeholder="0.00"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="supplier" className="text-sm font-medium">Supplier</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => handleInputChange("supplier", e.target.value)}
                      placeholder="Supplier name or company"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Additional notes about this inventory transaction..."
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Transaction Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className={parseInt(formData.quantity) < 0 ? "text-red-600" : "text-green-600"}>
                        {formData.quantity || 0} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost per unit:</span>
                      <span>${parseFloat(formData.costPrice || "0").toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span>{formData.location || "Not set"}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total Value:</span>
                        <span className={totalValue < 0 ? "text-red-600" : "text-green-600"}>
                          ${totalValue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isLowStock && formData.quantity && formData.threshold && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <HiExclamationTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Low Stock Warning</p>
                        <p className="text-yellow-700">
                          This quantity is at or below the threshold level.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, type: "restock", reason: "New stock received" }))
                    }}
                  >
                    Restock from Supplier
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, type: "adjustment", reason: "Physical count adjustment" }))
                    }}
                  >
                    Physical Count Adjustment
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, type: "return", reason: "Customer return" }))
                    }}
                  >
                    Customer Return
                  </Button>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Add to Inventory
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
