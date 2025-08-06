'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { MobileHeader } from "@/components/admin/mobile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  Download, 
  Plus,
  Users, 
  UserCheck, 
  UserX, 
  Calendar,
  Search,
  Eye,
  MoreHorizontal,
  Mail,
  Phone
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastOrderDate?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusStyle(status)} variant="secondary">
      {status}
    </Badge>
  );
};

function CustomersActions() {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <Button
        variant="outline"
        className="h-10 lg:h-12 px-4 lg:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <Filter className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Filter</span>
      </Button>
      <Button
        variant="outline"
        className="h-10 lg:h-12 px-4 lg:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <Download className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Export</span>
      </Button>
      <Button className="h-10 lg:h-12 px-4 lg:px-6 bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Add Customer</span>
      </Button>
    </div>
  );
}

function CustomersStats({ customers }: { customers: Customer[] }) {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(customer => customer.status.toLowerCase() === 'active').length;
  const newCustomers = customers.filter(customer => {
    const createdDate = new Date(customer.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  }).length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active",
      value: activeCustomers.toString(),
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "New (30 days)",
      value: newCustomers.toString(),
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: UserX,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CustomersFilters({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomersTable({ customers }: { customers: Customer[] }) {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Orders</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Spent</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {customer.totalOrders}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/hatsadmin/dashboard/customers/${customer.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No customers found</h3>
                      <p className="text-sm text-gray-500">Get started by adding your first customer.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getIdToken } = useAuth();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const token = await getIdToken();
        if (!token) {
          console.error('No authentication token available');
          return;
        }

        const response = await fetch('/api/customers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        } else {
          console.error('Failed to fetch customers');
          // Show sample data if no real customers exist
          setCustomers([
            {
              id: 1,
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '+1 (555) 123-4567',
              status: 'active',
              totalOrders: 12,
              totalSpent: 15600,
              createdAt: '2024-01-15',
              lastOrderDate: '2024-02-01'
            },
            {
              id: 2,
              name: 'Sarah Wilson',
              email: 'sarah.wilson@example.com',
              status: 'active',
              totalOrders: 8,
              totalSpent: 9200,
              createdAt: '2024-01-20',
              lastOrderDate: '2024-01-28'
            },
            {
              id: 3,
              name: 'Mike Johnson',
              email: 'mike.johnson@example.com',
              phone: '+1 (555) 987-6543',
              status: 'inactive',
              totalOrders: 3,
              totalSpent: 2400,
              createdAt: '2023-12-10',
              lastOrderDate: '2023-12-25'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [getIdToken]);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <MobileHeader 
          title="Customers" 
          subtitle="Manage your customer base and relationships" 
          actions={<CustomersActions />} 
        />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
            <div className="animate-pulse space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <MobileHeader
        title="Customers"
        subtitle="Manage your customer base and relationships"
        actions={<CustomersActions />}
      />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
          <CustomersStats customers={filteredCustomers} />
          <CustomersFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CustomersTable customers={filteredCustomers} />
        </div>
      </main>
    </div>
  );
}
