'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface Customer {
  id: number;
  name: string | null;
  email: string;
  createdAt: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/customers');
        
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        } else {
          console.error('Failed to fetch customers:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      <Header title="Customers" />
      
      {loading ? (
        <div className="mt-8 text-center py-12">
          <div className="text-gray-500">Loading customers...</div>
        </div>
      ) : customers.length === 0 ? (
        /* Empty State - Shopify Style */
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="text-center py-16 px-6">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">Everything customers-related in one place</h3>
                <p className="text-gray-600 mb-8">Manage customer details, see customer order history, and group customers into segments.</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.push('/hatsadmin/dashboard/customers/new')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    Add customer
                  </button>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Import customers
                  </button>
                </div>
              </div>
              
              {/* Additional section */}
              <div className="mt-16 pt-8 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Get customers with apps</h4>
                <p className="text-gray-600 mb-4">Grow your customer list by adding a lead capture form to your store and marketing.</p>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  See app recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Customers Table */
        <div className="mt-8">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {customers.length} customer{customers.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                Import
              </button>
              <button
                onClick={() => router.push('/hatsadmin/dashboard/customers/new')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add customer
              </button>
            </div>
          </div>
          
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {customer.name || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        0
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        $0.00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Import customers by CSV</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Add file</p>
                <input type="file" accept=".csv" className="hidden" id="csv-upload" />
                <label htmlFor="csv-upload" className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                  Choose file
                </label>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Download a sample CSV
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    disabled
                  >
                    Import customers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}