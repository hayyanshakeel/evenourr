'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CouponFormData {
  code: string;
  description: string;
  discountType: string;
  discountValue: string;
  minimumPurchase: string;
  usageLimit: string;
  usageLimitPerCustomer: string;
  customerEligibility: string;
  startsAt: string;
  endsAt: string;
}

interface CouponFormProps {
  initialData?: Partial<CouponFormData>;
  couponCode?: string;
}

export default function CouponForm({ initialData, couponCode }: CouponFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>({
    code: initialData?.code || '',
    description: initialData?.description || '',
    discountType: initialData?.discountType || 'percentage',
    discountValue: initialData?.discountValue || '',
    minimumPurchase: initialData?.minimumPurchase || '',
    usageLimit: initialData?.usageLimit || '',
    usageLimitPerCustomer: initialData?.usageLimitPerCustomer || '',
    customerEligibility: initialData?.customerEligibility || 'all',
    startsAt: initialData?.startsAt || '',
    endsAt: initialData?.endsAt || ''
  });

  const handleChange = (field: keyof CouponFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {
        code: formData.code.toUpperCase(),
        description: formData.description || null,
        discountType: formData.discountType,
        discountValue: formData.discountType === 'percentage' 
          ? parseInt(formData.discountValue) 
          : Math.round(parseFloat(formData.discountValue || '0') * 100),
        minimumPurchase: formData.minimumPurchase 
          ? Math.round(parseFloat(formData.minimumPurchase) * 100) 
          : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        usageLimitPerCustomer: formData.usageLimitPerCustomer 
          ? parseInt(formData.usageLimitPerCustomer) 
          : null,
        customerEligibility: formData.customerEligibility,
        startsAt: formData.startsAt || null,
        endsAt: formData.endsAt || null
      };

      const url = couponCode ? `/api/coupons/${couponCode}` : '/api/coupons';
      const method = couponCode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.push('/admin/dashboard/coupons');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save coupon');
      }
    } catch (error) {
      console.error('Failed to save coupon:', error);
      alert('Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Coupon Code *
              </label>
              <input
                type="text"
                name="code"
                id="code"
                required
                disabled={!!couponCode}
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                placeholder="SUMMER2024"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                name="description"
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Summer sale - 20% off all items"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Discount */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Discount</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                Discount Type *
              </label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={(e) => handleChange('discountType', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                Discount Value *
              </label>
              {formData.discountType === 'free_shipping' ? (
                <input
                  type="text"
                  value="Free Shipping"
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                />
              ) : (
                <div className="relative mt-1 rounded-md shadow-sm">
                  {formData.discountType === 'fixed_amount' && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                  )}
                  <input
                    type="number"
                    name="discountValue"
                    id="discountValue"
                    required
                    min="0"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    value={formData.discountValue}
                    onChange={(e) => handleChange('discountValue', e.target.value)}
                    className={`block w-full rounded-md border-gray-300 ${
                      formData.discountType === 'fixed_amount' ? 'pl-7' : ''
                    } pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  />
                  {formData.discountType === 'percentage' && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="minimumPurchase" className="block text-sm font-medium text-gray-700">
                Minimum Purchase Amount
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="minimumPurchase"
                  id="minimumPurchase"
                  min="0"
                  step="0.01"
                  value={formData.minimumPurchase}
                  onChange={(e) => handleChange('minimumPurchase', e.target.value)}
                  placeholder="0.00"
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Usage Limits</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">
                Total Usage Limit
              </label>
              <input
                type="number"
                name="usageLimit"
                id="usageLimit"
                min="0"
                value={formData.usageLimit}
                onChange={(e) => handleChange('usageLimit', e.target.value)}
                placeholder="Leave empty for unlimited"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="usageLimitPerCustomer" className="block text-sm font-medium text-gray-700">
                Usage Limit Per Customer
              </label>
              <input
                type="number"
                name="usageLimitPerCustomer"
                id="usageLimitPerCustomer"
                min="0"
                value={formData.usageLimitPerCustomer}
                onChange={(e) => handleChange('usageLimitPerCustomer', e.target.value)}
                placeholder="Leave empty for unlimited"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="customerEligibility" className="block text-sm font-medium text-gray-700">
                Customer Eligibility
              </label>
              <select
                id="customerEligibility"
                name="customerEligibility"
                value={formData.customerEligibility}
                onChange={(e) => handleChange('customerEligibility', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Customers</option>
                <option value="specific_customers">Specific Customers</option>
                <option value="customer_groups">Customer Groups</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Dates */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Active Dates</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="startsAt" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startsAt"
                id="startsAt"
                value={formData.startsAt}
                onChange={(e) => handleChange('startsAt', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="endsAt" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endsAt"
                id="endsAt"
                value={formData.endsAt}
                onChange={(e) => handleChange('endsAt', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard/coupons')}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : couponCode ? 'Update Coupon' : 'Create Coupon'}
        </button>
      </div>
    </form>
  );
}
