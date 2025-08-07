'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { FormLayout } from '@/components/admin/form-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusIcon, XIcon, ChevronDown, Save } from 'lucide-react';

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

export default function NewCustomerPage() {
  const router = useRouter();
  const { makeAuthenticatedRequest } = useAdminAuth();
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
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    country: 'US',
    province: '',
    zip: '',
    isDefault: false,
  });

  const handleBack = () => {
    router.push('/hatsadmin/dashboard/customers');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const customerData = {
        name: `${customerForm.firstName} ${customerForm.lastName}`.trim(),
        email: customerForm.email,
        phone: customerForm.phone || null,
      };
      
      const response = await makeAuthenticatedRequest('/api/admin/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        router.push('/hatsadmin/dashboard/customers');
      } else {
        throw new Error('Failed to create customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
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
    setCustomerForm(prev => ({
      ...prev,
      addresses: [...prev.addresses, { ...newAddress, id: Date.now().toString() }]
    }));
    setNewAddress({
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      country: 'US',
      province: '',
      zip: '',
      isDefault: false,
    });
    setShowAddressForm(false);
  };

  const actions = (
    <>
      <Button variant="outline" onClick={handleBack} disabled={loading}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
        <Save className="h-4 w-4 mr-2" />
        {loading ? 'Creating...' : 'Create Customer'}
      </Button>
    </>
  );

  return (
    <FormLayout
      title="New Customer"
      subtitle="Create a new customer profile with contact information and addresses"
      onBack={handleBack}
      actions={actions}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={customerForm.firstName}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={customerForm.lastName}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Marketing Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Marketing</Label>
                  <p className="text-sm text-gray-500">Customer agrees to receive marketing emails</p>
                </div>
                <Switch
                  checked={customerForm.marketingEmails}
                  onCheckedChange={(checked) => setCustomerForm(prev => ({ ...prev, marketingEmails: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Marketing</Label>
                  <p className="text-sm text-gray-500">Customer agrees to receive marketing SMS</p>
                </div>
                <Switch
                  checked={customerForm.marketingSms}
                  onCheckedChange={(checked) => setCustomerForm(prev => ({ ...prev, marketingSms: checked }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              {customerForm.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customerForm.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                value={customerForm.notes}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add notes about this customer..."
                rows={4}
              />
            </div>
          </div>

          <Separator />

          {/* Tax Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Settings</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tax Exempt</Label>
                <p className="text-sm text-gray-500">Customer is exempt from taxes</p>
              </div>
              <Switch
                checked={customerForm.taxExempt}
                onCheckedChange={(checked) => setCustomerForm(prev => ({ ...prev, taxExempt: checked }))}
              />
            </div>
          </div>
        </div>
      </form>
    </FormLayout>
  );
}
