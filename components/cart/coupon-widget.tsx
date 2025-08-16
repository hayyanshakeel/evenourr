"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/currencies";
import { useSettings } from "@/hooks/useSettings";
import {
  TicketPercent,
  Zap,
  Gift,
  Crown,
  Sparkles,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";

interface CartCouponWidgetProps {
  customerId: string;
  cartData: {
    total: number;
    quantity: number;
    categories: string[];
    items: any[];
  };
  onCouponApplied?: (coupon: any, discount: number) => void;
  appliedCoupon?: string;
}

interface EligibleCoupon {
  id: string;
  code: string;
  name: string;
  discount: number;
  type: string;
  personalizedMessage: string;
  autoApply: boolean;
  estimatedSavings: number;
}

export function CartCouponWidget({ 
  customerId, 
  cartData, 
  onCouponApplied,
  appliedCoupon 
}: CartCouponWidgetProps) {
  const { toast } = useToast();
  const { currency } = useSettings();
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [eligibleCoupons, setEligibleCoupons] = useState<EligibleCoupon[]>([]);
  const [customerSegments, setCustomerSegments] = useState<string[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  useEffect(() => {
    fetchEligibleCoupons();
  }, [customerId, cartData]);

  const fetchEligibleCoupons = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        customerId,
        cartTotal: cartData.total.toString(),
        cartQuantity: cartData.quantity.toString(),
        categories: cartData.categories.join(',')
      });

      const response = await fetch(`/api/coupons/validate?${params}`);
      const data = await response.json();

      if (data.success) {
        setEligibleCoupons(data.eligibleCoupons);
        setCustomerSegments(data.customerSegments);

        // Auto-apply best coupon if no coupon is currently applied
        if (!appliedCoupon && data.recommendations.autoApply) {
          await applyCoupon(data.recommendations.autoApply.code, true);
        }
      }
    } catch (error) {
      console.error('Error fetching eligible coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (code: string, isAutoApply = false) => {
    try {
      setApplying(true);

      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: code,
          customerId,
          cartData,
          context: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      });

      const result = await response.json();

      if (result.valid) {
        onCouponApplied?.(result.coupon, result.discountAmount);
        
        toast({
          title: isAutoApply ? "Coupon Auto-Applied!" : "Coupon Applied!",
          description: result.personalizedMessage || `You saved ${formatCurrency(result.discountAmount, currency)}`,
          variant: "default",
        });

        setManualCode('');
      } else {
        toast({
          title: "Coupon Invalid",
          description: result.reason || "This coupon cannot be applied to your cart.",
          variant: "destructive",
        });

        // Show suggestions if available
        if (result.suggestions && result.suggestions.length > 0) {
          toast({
            title: "Alternative Coupons Available",
            description: `Try: ${result.suggestions.map((s: any) => s.code).join(', ')}`,
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  const handleManualApply = () => {
    if (manualCode.trim()) {
      applyCoupon(manualCode.trim().toUpperCase());
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TicketPercent className="h-5 w-5" />
            Loading Coupons...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TicketPercent className="h-5 w-5" />
          Available Discounts
          {customerSegments.includes('high_value_customer') && (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
        </CardTitle>
        <CardDescription>
          {eligibleCoupons.length > 0 
            ? `${eligibleCoupons.length} coupons available for your cart`
            : "No coupons available for current cart"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        
        {/* Manual Coupon Entry */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleManualApply()}
            disabled={applying}
          />
          <Button 
            onClick={handleManualApply}
            disabled={!manualCode.trim() || applying}
          >
            {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </Button>
        </div>

        {/* Eligible Coupons Display */}
        {eligibleCoupons.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Recommended for you</h4>
              {eligibleCoupons.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllCoupons(!showAllCoupons)}
                >
                  {showAllCoupons ? 'Show Less' : `+${eligibleCoupons.length - 2} more`}
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {(showAllCoupons ? eligibleCoupons : eligibleCoupons.slice(0, 2)).map((coupon) => (
                <div 
                  key={coupon.id} 
                  className={`p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    appliedCoupon === coupon.code ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {coupon.code}
                        </code>
                        {coupon.autoApply && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-apply
                          </Badge>
                        )}
                        {customerSegments.includes('high_value_customer') && (
                          <Badge variant="default" className="text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            VIP
                          </Badge>
                        )}
                      </div>
                      
                      <h5 className="font-medium text-sm">{coupon.name}</h5>
                      
                      {coupon.personalizedMessage && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {coupon.personalizedMessage}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-semibold text-green-600">
                          Save {formatCurrency(coupon.estimatedSavings, currency)}
                        </span>
                        <span className="text-gray-500">
                          {coupon.type === 'percentage' ? `${coupon.discount}% off` : 
                           coupon.type === 'flat' ? `${formatCurrency(coupon.discount, currency)} off` :
                           coupon.type}
                        </span>
                      </div>
                    </div>

                    <div className="ml-4">
                      {appliedCoupon === coupon.code ? (
                        <Badge variant="default" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Applied
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => applyCoupon(coupon.code)}
                          disabled={applying}
                        >
                          {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Segment Badges */}
        {customerSegments.length > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Your status:</span>
              {customerSegments.map((segment) => {
                const segmentLabels: Record<string, { label: string; icon: any; color: string }> = {
                  'new_user': { label: 'New Customer', icon: Sparkles, color: 'bg-blue-100 text-blue-800' },
                  'returning_user': { label: 'Returning Customer', icon: Check, color: 'bg-green-100 text-green-800' },
                  'high_value_customer': { label: 'VIP Customer', icon: Crown, color: 'bg-yellow-100 text-yellow-800' },
                  'loyal_customer': { label: 'Loyal Customer', icon: Gift, color: 'bg-purple-100 text-purple-800' },
                };
                
                const config = segmentLabels[segment];
                if (!config) return null;
                
                const Icon = config.icon;
                
                return (
                  <Badge key={segment} variant="outline" className={`text-xs ${config.color}`}>
                    <Icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* No Coupons Message */}
        {eligibleCoupons.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No coupons available for your current cart.</p>
            <p className="text-xs mt-1">
              Try adding more items or check back later for new offers!
            </p>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}
