"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HiPlus } from "react-icons/hi2"

interface AddInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (inventory: any) => void
}

export function AddInventoryModal({ isOpen, onClose, onSave }: AddInventoryModalProps) {
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    quantity: "",
    location: "",
    supplier: "",
    costPrice: "",
    threshold: "",
    notes: "",
    type: "adjustment" // adjustment, restock, return
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
    
    onSave(inventoryData)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setFormData({
      productName: "",
      sku: "",
      quantity: "",
      location: "",
      supplier: "",
      costPrice: "",
      threshold: "",
      notes: "",
      type: "adjustment"
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <HiPlus className="h-5 w-5 text-blue-600" />
            Add Inventory Stock
          </DialogTitle>
          <DialogDescription>
            Add or adjust inventory stock levels for your products.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Product Information</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="productName" className="text-sm font-medium">Product Name *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    placeholder="Enter product name"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku" className="text-sm font-medium">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Product SKU"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-sm font-medium">Transaction Type</Label>
                    <Select value={formData.type} onValueChange={(value: string) => handleInputChange("type", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                        <SelectItem value="restock">Restock</SelectItem>
                        <SelectItem value="return">Return/Refund</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Inventory Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity" className="text-sm font-medium">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    placeholder="0"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="threshold" className="text-sm font-medium">Low Stock Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => handleInputChange("threshold", e.target.value)}
                    placeholder="10"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="costPrice" className="text-sm font-medium">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => handleInputChange("costPrice", e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <Select value={formData.location} onValueChange={(value: string) => handleInputChange("location", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-warehouse">Main Warehouse</SelectItem>
                      <SelectItem value="store-front">Store Front</SelectItem>
                      <SelectItem value="storage-room">Storage Room</SelectItem>
                      <SelectItem value="supplier">With Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="supplier" className="text-sm font-medium">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange("supplier", e.target.value)}
                    placeholder="Supplier name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Additional notes about this inventory transaction..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            {formData.quantity && formData.costPrice && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Transaction Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{formData.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per unit:</span>
                    <span>${parseFloat(formData.costPrice || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Value:</span>
                    <span>${((parseInt(formData.quantity) || 0) * (parseFloat(formData.costPrice) || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add to Inventory
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
