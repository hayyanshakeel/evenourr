import prisma from "@/lib/db";

// Customer Segmentation Types
export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  conditions: SegmentCondition[];
}

export interface SegmentCondition {
  field: 'order_count' | 'total_spend' | 'days_since_last_order' | 'cart_abandonment' | 'registration_date';
  operator: 'equals' | 'greater_than' | 'less_than' | 'greater_than_or_equal' | 'less_than_or_equal' | 'contains';
  value: any;
}

// Advanced Coupon Rule Types
export interface CouponRule {
  id: string;
  type: 'order_count' | 'customer_segment' | 'cart_value' | 'cart_quantity' | 'product_category' | 'day_of_week' | 'time_period' | 'device_type';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in' | 'greater_than_or_equal' | 'less_than_or_equal';
  value: any;
  description: string;
}

// Fraud Detection Types
export interface FraudCheck {
  type: 'ip_usage' | 'email_usage' | 'device_fingerprint' | 'frequency_check' | 'velocity_check';
  threshold: number;
  action: 'flag' | 'block' | 'require_verification';
}

export class IntelligentCouponService {
  
  // Customer Segmentation Logic
  static async getCustomerSegment(customerId: string): Promise<string[]> {
    try {
      const customerIdInt = parseInt(customerId);
      if (isNaN(customerIdInt)) {
        return ['unknown'];
      }

      const customer = await prisma.user.findUnique({
        where: { id: customerIdInt },
        include: {
          orders: {
            where: { status: 'completed' },
            select: {
              totalPrice: true,
              createdAt: true
            }
          }
        }
      });

      if (!customer) return ['unknown'];

      const segments: string[] = [];
      const orderCount = customer.orders.length;
      const totalSpend = customer.orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
      const daysSinceLastOrder = customer.orders.length > 0 && customer.orders[0]?.createdAt
        ? Math.floor((Date.now() - new Date(customer.orders[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      // Segmentation Logic
      if (orderCount === 0) {
        segments.push('new_user');
      } else if (orderCount >= 1) {
        segments.push('returning_user');
      }

      if (totalSpend > 10000) {
        segments.push('high_value_customer');
      }

      if (orderCount >= 2) {
        segments.push('loyal_customer');
      }

      if (daysSinceLastOrder > 7 && orderCount > 0) {
        segments.push('dormant_customer');
      }

      // Check for cart abandonment (simplified - would need cart tracking)
      const hasAbandonedCart = await this.checkCartAbandonment(customerId);
      if (hasAbandonedCart) {
        segments.push('cart_abandoner');
      }

      return segments;
    } catch (error) {
      console.error('Error getting customer segment:', error);
      return ['unknown'];
    }
  }

  // Check Cart Abandonment (simplified implementation)
  static async checkCartAbandonment(customerId: string): Promise<boolean> {
    // This would check if user added items to cart but didn't complete order in last 7 days
    // For now, return a mock value - implement based on your cart tracking system
    return Math.random() > 0.7; // 30% chance of being cart abandoner
  }

  // Advanced Coupon Validation
  static async validateCouponRules(
    couponId: string, 
    customerId: string, 
    cartData: {
      items: any[];
      total: number;
      quantity: number;
      categories: string[];
    },
    context: {
      ip?: string;
      userAgent?: string;
      timestamp: Date;
    }
  ): Promise<{ valid: boolean; reason?: string; fraudRisk?: boolean }> {
    
    try {
      const couponIdInt = parseInt(couponId);
      if (isNaN(couponIdInt)) {
        return { valid: false, reason: 'Invalid coupon ID' };
      }

      const coupon = await prisma.coupon.findUnique({
        where: { id: couponIdInt }
      });

      if (!coupon) {
        return { valid: false, reason: 'Coupon not found' };
      }

      if (!coupon.isActive) {
        return { valid: false, reason: 'Coupon is not active' };
      }

      // Check date validity
      const now = new Date();
      if (coupon.validFrom && now < coupon.validFrom) {
        return { valid: false, reason: 'Coupon not yet valid' };
      }
      if (coupon.validUntil && now > coupon.validUntil) {
        return { valid: false, reason: 'Coupon has expired' };
      }

      // Check usage limits
      if (coupon.maxUses) {
        const usageCount = await this.getCouponUsageCount(couponId);
        if (usageCount >= coupon.maxUses) {
          return { valid: false, reason: 'Coupon usage limit exceeded' };
        }
      }

      // Get customer segments
      const customerSegments = await this.getCustomerSegment(customerId);

      // Advanced Rule Validation (this would be stored in database)
      const rules = await this.getCouponRules(couponId);
      for (const rule of rules) {
        const ruleValid = await this.validateRule(rule, customerId, cartData, customerSegments, context);
        if (!ruleValid.valid) {
          return { valid: false, reason: ruleValid.reason };
        }
      }

      // Fraud Detection
      const fraudCheck = await this.performFraudChecks(couponId, customerId, context);
      if (fraudCheck.fraudRisk) {
        return { valid: false, reason: 'Fraud risk detected', fraudRisk: true };
      }

      return { valid: true };

    } catch (error) {
      console.error('Error validating coupon rules:', error);
      return { valid: false, reason: 'Validation error' };
    }
  }

  // Get Coupon Rules (mock - would come from database)
  static async getCouponRules(couponId: string): Promise<CouponRule[]> {
    // This would fetch from a coupon_rules table
    // For now, return mock rules based on coupon
    return [
      {
        id: '1',
        type: 'cart_value',
        operator: 'greater_than',
        value: 500,
        description: 'Cart value must be greater than ₹500'
      },
      {
        id: '2',
        type: 'customer_segment',
        operator: 'contains',
        value: 'new_user',
        description: 'Valid only for new users'
      }
    ];
  }

  // Validate Individual Rule
  static async validateRule(
    rule: CouponRule,
    customerId: string,
    cartData: any,
    customerSegments: string[],
    context: any
  ): Promise<{ valid: boolean; reason?: string }> {
    
    switch (rule.type) {
      case 'cart_value':
        if (rule.operator === 'greater_than' && cartData.total <= rule.value) {
          return { valid: false, reason: `Cart value must be greater than ₹${rule.value}` };
        }
        break;

      case 'cart_quantity':
        if (rule.operator === 'greater_than' && cartData.quantity <= rule.value) {
          return { valid: false, reason: `Cart quantity must be greater than ${rule.value}` };
        }
        break;

      case 'customer_segment':
        if (rule.operator === 'contains' && !customerSegments.includes(rule.value)) {
          return { valid: false, reason: `Not eligible for customer segment: ${rule.value}` };
        }
        break;

      case 'product_category':
        if (rule.operator === 'contains' && !cartData.categories.includes(rule.value)) {
          return { valid: false, reason: `Cart must contain products from category: ${rule.value}` };
        }
        break;

      case 'day_of_week':
        const dayOfWeek = context.timestamp.getDay(); // 0 = Sunday, 6 = Saturday
        if (rule.value === 'weekends' && !(dayOfWeek === 0 || dayOfWeek === 6)) {
          return { valid: false, reason: 'Valid only on weekends' };
        }
        break;

      case 'order_count':
        const orderCount = await this.getCustomerOrderCount(customerId);
        if (rule.operator === 'equals' && orderCount !== rule.value) {
          return { valid: false, reason: `Must have exactly ${rule.value} orders` };
        }
        if (rule.operator === 'greater_than_or_equal' && orderCount < rule.value) {
          return { valid: false, reason: `Must have at least ${rule.value} orders` };
        }
        break;

      default:
        return { valid: true };
    }

    return { valid: true };
  }

  // Fraud Detection System
  static async performFraudChecks(
    couponId: string,
    customerId: string,
    context: { ip?: string; userAgent?: string; timestamp: Date }
  ): Promise<{ fraudRisk: boolean; reasons: string[] }> {
    
    const reasons: string[] = [];
    
    try {
      // Check IP usage frequency
      if (context.ip) {
        const ipUsageCount = await this.getIpUsageCount(couponId, context.ip, 24); // last 24 hours
        if (ipUsageCount > 5) {
          reasons.push('Excessive usage from same IP address');
        }
      }

      // Check email/customer usage frequency
      const customerUsageCount = await this.getCustomerCouponUsage(customerId, 24);
      if (customerUsageCount > 3) {
        reasons.push('Excessive coupon usage by customer');
      }

      // Check rapid succession usage
      const recentUsage = await this.getRecentCouponUsage(couponId, 1); // last 1 hour
      if (recentUsage > 10) {
        reasons.push('Rapid succession usage detected');
      }

      // Device fingerprint check (simplified)
      if (context.userAgent) {
        const deviceUsage = await this.getDeviceUsageCount(couponId, context.userAgent, 24);
        if (deviceUsage > 3) {
          reasons.push('Multiple accounts from same device');
        }
      }

      return {
        fraudRisk: reasons.length > 0,
        reasons
      };

    } catch (error) {
      console.error('Error performing fraud checks:', error);
      return { fraudRisk: false, reasons: [] };
    }
  }

  // Helper Methods for Fraud Detection
  static async getIpUsageCount(couponId: string, ip: string, hours: number): Promise<number> {
    // This would query a coupon_usage_logs table
    // For now, return mock data
    return Math.floor(Math.random() * 10);
  }

  static async getCustomerCouponUsage(customerId: string, hours: number): Promise<number> {
    // Check customer's coupon usage in recent hours
    return Math.floor(Math.random() * 5);
  }

  static async getRecentCouponUsage(couponId: string, hours: number): Promise<number> {
    // Check how many times this coupon was used recently
    return Math.floor(Math.random() * 15);
  }

  static async getDeviceUsageCount(couponId: string, userAgent: string, hours: number): Promise<number> {
    // Check usage from same device/browser
    return Math.floor(Math.random() * 5);
  }

  static async getCouponUsageCount(couponId: string): Promise<number> {
    // This would count actual usage from orders table
    return Math.floor(Math.random() * 100);
  }

  static async getCustomerOrderCount(customerId: string): Promise<number> {
    try {
      const customerIdInt = parseInt(customerId);
      if (isNaN(customerIdInt)) {
        return 0;
      }

      return await prisma.order.count({
        where: {
          userId: customerIdInt,
          status: 'completed'
        }
      });
    } catch (error) {
      console.error('Error getting customer order count:', error);
      return 0;
    }
  }

  // Context-Aware Coupon Recommendations
  static async getEligibleCoupons(
    customerId: string,
    cartData: {
      items: any[];
      total: number;
      quantity: number;
      categories: string[];
    },
    context: {
      ip?: string;
      userAgent?: string;
      timestamp: Date;
    }
  ): Promise<{ coupon: any; autoApply: boolean; personalizedMessage?: string }[]> {
    
    try {
      // Get all active coupons
      const coupons = await prisma.coupon.findMany({
        where: {
          isActive: true,
          OR: [
            { validUntil: { gte: new Date() } },
            // Handle null validUntil (no expiration)
          ],
          validFrom: { lte: new Date() }
        }
      });

      const eligibleCoupons = [];

      for (const coupon of coupons) {
        const validation = await this.validateCouponRules(coupon.id.toString(), customerId, cartData, context);
        
        if (validation.valid) {
          const customerSegments = await this.getCustomerSegment(customerId);
          
          eligibleCoupons.push({
            coupon,
            autoApply: this.shouldAutoApply(coupon, customerSegments),
            personalizedMessage: this.generatePersonalizedMessage(coupon, customerSegments, customerId)
          });
        }
      }

      // Sort by best value for customer
      return eligibleCoupons.sort((a, b) => {
        const valueA = this.calculateCouponValue(a.coupon, cartData.total);
        const valueB = this.calculateCouponValue(b.coupon, cartData.total);
        return valueB - valueA;
      });

    } catch (error) {
      console.error('Error getting eligible coupons:', error);
      return [];
    }
  }

  static shouldAutoApply(coupon: any, customerSegments: string[]): boolean {
    // Auto-apply best coupon for high-value customers
    return customerSegments.includes('high_value_customer');
  }

  static generatePersonalizedMessage(coupon: any, customerSegments: string[], customerId: string): string {
    if (customerSegments.includes('new_user')) {
      return `Welcome! Enjoy ${coupon.discount}% off your first order.`;
    }
    if (customerSegments.includes('loyal_customer')) {
      return `Thank you for being a loyal customer! Here's ${coupon.discount}% off as our appreciation.`;
    }
    if (customerSegments.includes('cart_abandoner')) {
      return `Don't let these items slip away! Complete your purchase with ${coupon.discount}% off.`;
    }
    return `Save ${coupon.discount}% with code ${coupon.code}`;
  }

  static calculateCouponValue(coupon: any, cartTotal: number): number {
    // Calculate actual savings value
    if (coupon.type === 'percentage') {
      return (cartTotal * coupon.discount) / 100;
    }
    return coupon.discount;
  }

  // Analytics and Tracking
  static async trackCouponPerformance(couponId: string): Promise<{
    redemptionRate: number;
    revenueImpact: number;
    fraudAttempts: number;
    segmentUsage: Record<string, number>;
  }> {
    try {
      // These would be real queries to your analytics tables
      return {
        redemptionRate: Math.random() * 100,
        revenueImpact: Math.random() * 50000,
        fraudAttempts: Math.floor(Math.random() * 20),
        segmentUsage: {
          'new_user': Math.floor(Math.random() * 100),
          'returning_user': Math.floor(Math.random() * 200),
          'high_value_customer': Math.floor(Math.random() * 50),
          'cart_abandoner': Math.floor(Math.random() * 75)
        }
      };
    } catch (error) {
      console.error('Error tracking coupon performance:', error);
      return {
        redemptionRate: 0,
        revenueImpact: 0,
        fraudAttempts: 0,
        segmentUsage: {}
      };
    }
  }

  // Log Coupon Usage for Analytics
  static async logCouponUsage(
    couponId: string,
    customerId: string,
    orderId: string,
    context: {
      ip?: string;
      userAgent?: string;
      timestamp: Date;
      discountAmount: number;
      orderTotal: number;
    }
  ): Promise<void> {
    try {
      // This would insert into a coupon_usage_logs table
      console.log('Coupon usage logged:', {
        couponId,
        customerId,
        orderId,
        ...context
      });
    } catch (error) {
      console.error('Error logging coupon usage:', error);
    }
  }
}
