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
  Percent, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Search,
  Eye,
  MoreHorizontal
} from "lucide-react";

interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  description: string;
  minOrderValue?: number;
  maxUses?: number;
  currentUses: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const StatusBadge = ({ isActive, endDate }: { isActive: boolean; endDate: string }) => {
  const now = new Date();
  const expiry = new Date(endDate);
  const isExpired = expiry < now;

  if (isExpired) {
    return <Badge className="bg-red-100 text-red-800" variant="secondary">Expired</Badge>;
  }
  
  return (
    <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} variant="secondary">
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  const getTypeInfo = () => {
    switch (type) {
      case 'percentage':
        return { label: 'Percentage', style: 'bg-blue-100 text-blue-800' };
      case 'fixed':
        return { label: 'Fixed Amount', style: 'bg-green-100 text-green-800' };
      case 'shipping':
        return { label: 'Free Shipping', style: 'bg-purple-100 text-purple-800' };
      default:
        return { label: type, style: 'bg-gray-100 text-gray-800' };
    }
  };

  const typeInfo = getTypeInfo();

  return (
    <Badge className={typeInfo.style} variant="secondary">
      {typeInfo.label}
    </Badge>
  );
};

function CouponsActions() {
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
        <span className="text-sm lg:text-base font-medium">Create Coupon</span>
      </Button>
    </div>
  );
}

function CouponsStats({ coupons }: { coupons: Coupon[] }) {
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(coupon => coupon.isActive && new Date(coupon.endDate) > new Date()).length;
  const totalRedemptions = coupons.reduce((sum, coupon) => sum + coupon.currentUses, 0);
  const expiredCoupons = coupons.filter(coupon => new Date(coupon.endDate) < new Date()).length;

  const stats = [
    {
      title: "Total Coupons",
      value: totalCoupons.toString(),
      icon: Percent,
      color: "text-blue-600",
    },
    {
      title: "Active",
      value: activeCoupons.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Total Redemptions",
      value: totalRedemptions.toString(),
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Expired",
      value: expiredCoupons.toString(),
      icon: XCircle,
      color: "text-red-600",
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

function CouponsFilters({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search coupons..."
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

function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDiscount = (type: string, value: number) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'fixed':
        return `₹${value}`;
      case 'shipping':
        return 'Free Shipping';
      default:
        return `₹${value}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Code</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Discount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Usage</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Validity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-mono">{coupon.code}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{coupon.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <TypeBadge type={coupon.type} />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                      {formatDiscount(coupon.type, coupon.value)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">
                        {coupon.currentUses}{coupon.maxUses ? ` / ${coupon.maxUses}` : ' / ∞'}
                      </div>
                      {coupon.maxUses && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{width: `${Math.min((coupon.currentUses / coupon.maxUses) * 100, 100)}%`}}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge isActive={coupon.isActive} endDate={coupon.endDate} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/hatsadmin/dashboard/coupons/${coupon.id}`)}
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
                      <Percent className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No coupons found</h3>
                      <p className="text-sm text-gray-500">Get started by creating your first coupon.</p>
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

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getIdToken } = useAuth();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const token = await getIdToken();
        if (!token) {
          console.error('No authentication token available');
          return;
        }

        const response = await fetch('/api/coupons', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setCoupons(data);
        } else {
          console.error('Failed to fetch coupons');
          // Show sample data if no real coupons exist
          setCoupons([
            {
              id: 1,
              code: 'SUMMER20',
              type: 'percentage',
              value: 20,
              description: '20% off summer collection',
              minOrderValue: 1000,
              maxUses: 100,
              currentUses: 45,
              startDate: '2024-06-01',
              endDate: '2024-08-31',
              isActive: true
            },
            {
              id: 2,
              code: 'FREESHIP',
              type: 'shipping',
              value: 0,
              description: 'Free shipping on all orders',
              minOrderValue: 500,
              maxUses: undefined,
              currentUses: 123,
              startDate: '2024-01-01',
              endDate: '2024-12-31',
              isActive: true
            },
            {
              id: 3,
              code: 'NEWCUSTOMER',
              type: 'fixed',
              value: 200,
              description: 'New customer discount',
              minOrderValue: 800,
              maxUses: 50,
              currentUses: 12,
              startDate: '2024-01-01',
              endDate: '2024-03-31',
              isActive: false
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [getIdToken]);

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <MobileHeader 
          title="Coupons" 
          subtitle="Create and manage discount codes" 
          actions={<CouponsActions />} 
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
        title="Coupons"
        subtitle="Create and manage discount codes"
        actions={<CouponsActions />}
      />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
          <CouponsStats coupons={filteredCoupons} />
          <CouponsFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CouponsTable coupons={filteredCoupons} />
        </div>
      </main>
    </div>
  );
}
