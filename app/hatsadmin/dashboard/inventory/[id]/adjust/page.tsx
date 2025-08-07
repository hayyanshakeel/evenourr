'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Package, Plus, Minus, RotateCcw } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  status: string;
}

export default function AdjustStockPage() {
  const router = useRouter();
  const params = useParams();
  const { makeAuthenticatedRequest } = useAdminAuth();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<'set' | 'add' | 'subtract'>('set');
  const [adjustmentValue, setAdjustmentValue] = useState('');
  const [reason, setReason] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchInventoryItem();
    }
  }, [params.id]);

  useEffect(() => {
    if (item && adjustmentValue) {
      const value = parseInt(adjustmentValue) || 0;
      switch (adjustmentType) {
        case 'set':
          setNewQuantity(value);
          break;
        case 'add':
          setNewQuantity(item.quantity + value);
          break;
        case 'subtract':
          setNewQuantity(Math.max(0, item.quantity - value));
          break;
      }
    } else if (item) {
      setNewQuantity(item.quantity);
    }
  }, [item, adjustmentType, adjustmentValue]);

  const fetchInventoryItem = async () => {
    try {
      setLoading(true);
      // For now, we'll get the product details since inventory is likely based on products
      const response = await makeAuthenticatedRequest(`/api/admin/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setItem({
          id: data.id,
          name: data.name,
          sku: data.sku || data.slug,
          quantity: data.inventory || 0,
          price: data.price,
          status: data.inventory > 10 ? 'In Stock' : data.inventory > 0 ? 'Low Stock' : 'Out of Stock',
        });
      }
    } catch (error) {
      console.error('Error fetching inventory item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setSaving(true);
    try {
      const response = await makeAuthenticatedRequest(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventory: newQuantity,
          // Keep other existing fields
          name: item.name,
          price: item.price,
        }),
      });

      if (response.ok) {
        router.push(`/hatsadmin/dashboard/inventory/${params.id}`);
      } else {
        throw new Error('Failed to update inventory');
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Failed to update inventory. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/hatsadmin/dashboard/inventory/${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Item Not Found</h1>
          <p className="text-gray-600 mb-4">The inventory item you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/hatsadmin/dashboard/inventory')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Button onClick={handleBack} variant="outline" size="sm" className="border-slate-300 hover:border-slate-400 hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Adjust Stock</h1>
              <p className="text-gray-600">{item.name} (SKU: {item.sku})</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock Adjustment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Current Stock */}
                  <div>
                    <Label className="text-base font-semibold">Current Stock Level</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <span className="text-2xl font-bold text-gray-900">{item.quantity}</span>
                      <span className="text-gray-600 ml-2">units</span>
                    </div>
                  </div>

                  {/* Adjustment Type */}
                  <div>
                    <Label htmlFor="adjustmentType" className="text-base font-semibold">
                      Adjustment Type
                    </Label>
                    <Select value={adjustmentType} onValueChange={(value: 'set' | 'add' | 'subtract') => setAdjustmentType(value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="set">
                          <div className="flex items-center">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Set to specific amount
                          </div>
                        </SelectItem>
                        <SelectItem value="add">
                          <div className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add to current stock
                          </div>
                        </SelectItem>
                        <SelectItem value="subtract">
                          <div className="flex items-center">
                            <Minus className="h-4 w-4 mr-2" />
                            Subtract from current stock
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Adjustment Value */}
                  <div>
                    <Label htmlFor="adjustmentValue" className="text-base font-semibold">
                      {adjustmentType === 'set' ? 'New Stock Level' : 'Adjustment Amount'}
                    </Label>
                    <Input
                      id="adjustmentValue"
                      type="number"
                      min="0"
                      value={adjustmentValue}
                      onChange={(e) => setAdjustmentValue(e.target.value)}
                      className="mt-2"
                      placeholder="Enter amount..."
                      required
                    />
                  </div>

                  {/* New Quantity Preview */}
                  {adjustmentValue && (
                    <div>
                      <Label className="text-base font-semibold">New Stock Level</Label>
                      <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-2xl font-bold text-blue-900">{newQuantity}</span>
                        <span className="text-blue-700 ml-2">units</span>
                        <div className="mt-1">
                          <span className="text-sm text-blue-600">
                            Change: {newQuantity - item.quantity > 0 ? '+' : ''}{newQuantity - item.quantity} units
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  <div>
                    <Label htmlFor="reason" className="text-base font-semibold">
                      Reason for Adjustment
                    </Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-2"
                      placeholder="Enter reason for this stock adjustment..."
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={handleBack} className="border-slate-300 hover:border-slate-400 hover:bg-slate-50">
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={saving || !adjustmentValue}
                      className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Product Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Product Name</Label>
                  <p className="font-semibold">{item.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">SKU</Label>
                  <p className="font-mono text-sm">{item.sku}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Current Status</Label>
                  <p className="font-semibold">{item.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Unit Price</Label>
                  <p className="font-semibold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(item.price)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
