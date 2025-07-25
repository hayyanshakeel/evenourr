// app/(admin)/dashboard/coupons/new/page.tsx

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';

const NewCouponPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use state to manage the data for each form input
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage', // Default to 'percentage'
    discountValue: '',
    usageLimit: '',
  });

  // Handler to update state when user types in an input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission
    setLoading(true);
    setError(null);

    try {
      // Prepare the data for the API, converting numbers correctly
      const payload = {
        ...formData,
        discountValue: parseInt(formData.discountValue, 10),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : undefined,
      };

      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // If API returns an error, display it
        throw new Error(result.error || 'Failed to create coupon');
      }

      // On success, redirect back to the main coupons list
      router.push('/dashboard/coupons');
      router.refresh(); // Refresh the page to show the new coupon

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Create a New Coupon" />
      <div className="mt-8 rounded-lg border bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coupon Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Coupon Code</label>
            <input
              type="text"
              name="code"
              id="code"
              required
              value={formData.code}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., SUMMER25"
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Discount Type</label>
              <select
                id="discountType"
                name="discountType"
                required
                value={formData.discountType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">Discount Value</label>
              <input
                type="number"
                name="discountValue"
                id="discountValue"
                required
                value={formData.discountValue}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder={formData.discountType === 'percentage' ? "e.g., 25 for 25%" : "e.g., 1000 for $10.00"}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="A brief description for this coupon."
            />
          </div>

          {/* Usage Limit */}
          <div>
            <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">Total Usage Limit (Optional)</label>
            <input
              type="number"
              name="usageLimit"
              id="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., 100"
            />
            <p className="mt-2 text-xs text-gray-500">Leave blank for unlimited uses.</p>
          </div>

          {/* Submission & Error Display */}
          <div className="border-t pt-6">
            {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCouponPage;