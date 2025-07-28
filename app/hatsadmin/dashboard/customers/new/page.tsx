'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  marketingEmails: boolean;
  marketingSms: boolean;
  notes: string;
  tags: string[];
  addresses: Address[];
  taxExempt: boolean;
  taxSettings: string;
}

interface Address {
  id?: string;
  company?: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  country: string;
  province: string;
  zip: string;
  phone?: string;
  isDefault: boolean;
}

const LANGUAGES = [
  { value: 'en', label: 'English (Default)' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
];

const COUNTRIES = [
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'CA', label: 'Canada', flag: '🇨🇦' },
  { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'AU', label: 'Australia', flag: '🇦🇺' },
  { value: 'DE', label: 'Germany', flag: '🇩🇪' },
  { value: 'FR', label: 'France', flag: '🇫🇷' },
  { value: 'IN', label: 'India', flag: '🇮🇳' },
];

const TAX_SETTINGS = [
  { value: 'collect', label: 'Collect tax' },
  { value: 'exempt', label: 'Tax exempt' },
];

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newTag, setNewTag] = useState('');

  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'en',
    marketingEmails: false,
    marketingSms: false,
    notes: '',
    tags: [],
    addresses: [],
    taxExempt: false,
    taxSettings: 'collect',
  });

  const [newAddress, setNewAddress] = useState<Address>({
    company: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    country: 'US',
    province: '',
    zip: '',
    phone: '',
    isDefault: true,
  });

  const handleInputChange = (field: keyof CustomerForm, value: any) => {
    setCustomerForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof Address, value: any) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !customerForm.tags.includes(newTag.trim())) {
      setCustomerForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCustomerForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addAddress = () => {
    if (newAddress.firstName && newAddress.lastName && newAddress.address1) {
      const addressWithId = { ...newAddress, id: Date.now().toString() };
      setCustomerForm(prev => ({
        ...prev,
        addresses: [...prev.addresses, addressWithId]
      }));
      setNewAddress({
        company: '',
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        country: 'US',
        province: '',
        zip: '',
        phone: '',
        isDefault: false,
      });
      setShowAddressForm(false);
    }
  };

  const removeAddress = (addressId: string) => {
    setCustomerForm(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== addressId)
    }));
  };

  const handleSubmit = async () => {
    if (!customerForm.firstName || !customerForm.lastName || !customerForm.email) {
      alert('Please fill in required fields: First name, Last name, and Email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${customerForm.firstName} ${customerForm.lastName}`.trim(),
          email: customerForm.email,
          phone: customerForm.phone,
          notes: customerForm.notes,
          tags: customerForm.tags,
          addresses: customerForm.addresses,
          marketingEmails: customerForm.marketingEmails,
          marketingSms: customerForm.marketingSms,
          language: customerForm.language,
          taxExempt: customerForm.taxExempt,
        }),
      });

      if (response.ok) {
        router.push('/hatsadmin/dashboard/customers');
      } else {
        console.error('Failed to create customer');
        alert('Failed to create customer. Please try again.');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="New customer">
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </Header>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Overview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Customer overview</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    value={customerForm.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={customerForm.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <div className="relative">
                  <select
                    value={customerForm.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This customer will receive notifications in this language.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                    <span className="text-sm">🇮🇳</span>
                    <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={customerForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketing-emails"
                    checked={customerForm.marketingEmails}
                    onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="marketing-emails" className="ml-2 text-sm text-gray-700">
                    Customer agreed to receive marketing emails.
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketing-sms"
                    checked={customerForm.marketingSms}
                    onChange={(e) => handleInputChange('marketingSms', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="marketing-sms" className="ml-2 text-sm text-gray-700">
                    Customer agreed to receive SMS marketing text messages.
                  </label>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  You should ask your customers for permission before you subscribe them to your marketing 
                  emails or SMS.
                </p>
              </div>
            </div>
          </div>

          {/* Default Address */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Default address</h3>
                <p className="text-sm text-gray-500">The primary address of this customer</p>
              </div>
              {!showAddressForm && customerForm.addresses.length === 0 && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add address
                </button>
              )}
            </div>
            <div className="p-6">
              {customerForm.addresses.length > 0 ? (
                <div className="space-y-4">
                  {customerForm.addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">
                            {address.firstName} {address.lastName}
                          </div>
                          {address.company && (
                            <div className="text-sm text-gray-500">{address.company}</div>
                          )}
                          <div className="text-sm text-gray-700 mt-1">
                            {address.address1}
                            {address.address2 && <div>{address.address2}</div>}
                            <div>{address.city}, {address.province} {address.zip}</div>
                            <div>{COUNTRIES.find(c => c.value === address.country)?.label}</div>
                          </div>
                          {address.phone && (
                            <div className="text-sm text-gray-500 mt-1">{address.phone}</div>
                          )}
                        </div>
                        <button
                          onClick={() => removeAddress(address.id!)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : showAddressForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={newAddress.company}
                      onChange={(e) => handleAddressChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                      <input
                        type="text"
                        value={newAddress.firstName}
                        onChange={(e) => handleAddressChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                      <input
                        type="text"
                        value={newAddress.lastName}
                        onChange={(e) => handleAddressChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newAddress.address1}
                      onChange={(e) => handleAddressChange('address1', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc.</label>
                    <input
                      type="text"
                      value={newAddress.address2}
                      onChange={(e) => handleAddressChange('address2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select
                        value={newAddress.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        {COUNTRIES.map(country => (
                          <option key={country.value} value={country.value}>
                            {country.flag} {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                      <input
                        type="text"
                        value={newAddress.zip}
                        onChange={(e) => handleAddressChange('zip', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addAddress}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Add address
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No address added yet
                </div>
              )}
            </div>
          </div>

          {/* Tax Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tax details</h3>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax settings</label>
                <div className="relative">
                  <select
                    value={customerForm.taxSettings}
                    onChange={(e) => handleInputChange('taxSettings', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {TAX_SETTINGS.map(setting => (
                      <option key={setting.value} value={setting.value}>{setting.label}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notes */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Notes</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-3">
                Notes are private and won't be shared with the customer.
              </p>
              <textarea
                value={customerForm.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes about this customer..."
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Tags</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {customerForm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
