import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const segment = searchParams.get('segment');
    
    // Build search conditions and exclude admin users
    const where = search?.trim() ? {
      AND: [
        { role: { not: 'admin' } }, // Exclude admin users
        {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      ]
    } : {
      role: { not: 'admin' } // Always exclude admin users
    };    // Get real customers with their comprehensive behavioral data
    const [customers, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          lastLogin: true,
          orders: {
            select: {
              id: true,
              totalPrice: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          },
          carts: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    const now = new Date();

    // Transform data with advanced behavioral analytics and AI insights
    const customersWithAdvancedBehavior = customers.map(customer => {
      const orderCount = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
      const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
      const daysSinceSignup = Math.floor((now.getTime() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const daysSinceLastOrder = orderCount > 0 
        ? Math.floor((now.getTime() - new Date(Math.max(...customer.orders.map((o: any) => new Date(o.createdAt).getTime()))).getTime()) / (1000 * 60 * 60 * 24))
        : null;
      const daysSinceLastLogin = customer.lastLogin 
        ? Math.floor((now.getTime() - new Date(customer.lastLogin).getTime()) / (1000 * 60 * 60 * 24))
        : daysSinceSignup;

      // Calculate engagement score (0-100)
      let engagementScore = 0;
      if (orderCount > 0) engagementScore += Math.min(orderCount * 10, 50);
      if (totalSpent > 0) engagementScore += Math.min(totalSpent / 20, 30);
      if (daysSinceLastOrder !== null && daysSinceLastOrder <= 30) engagementScore += 20;
      if (daysSinceLastLogin <= 7) engagementScore += 10;
      
      // Advanced customer segmentation with behavioral data
      let segment = 'new';
      let value = 'low';
      let activity = 'inactive';
      let riskLevel = 'low';

      // Enhanced segmentation logic
      if (orderCount === 0 && daysSinceSignup > 7) {
        segment = 'inactive';
        riskLevel = 'high';
      } else if (orderCount === 1) {
        segment = 'first_time';
        riskLevel = daysSinceLastOrder && daysSinceLastOrder > 60 ? 'high' : 'medium';
      } else if (orderCount >= 2 && orderCount <= 5 && totalSpent < 500) {
        segment = 'developing';
        riskLevel = daysSinceLastOrder && daysSinceLastOrder > 45 ? 'medium' : 'low';
      } else if (orderCount > 5 || totalSpent >= 500) {
        segment = 'loyal';
        riskLevel = daysSinceLastOrder && daysSinceLastOrder > 90 ? 'medium' : 'low';
      }

      if (totalSpent >= 1000 && orderCount >= 3) {
        segment = 'vip';
        value = 'high';
      } else if (totalSpent >= 300) {
        value = 'medium';
      }

      // Activity level based on multiple factors
      if (daysSinceLastLogin <= 7 && daysSinceLastOrder !== null && daysSinceLastOrder <= 15) {
        activity = 'highly_active';
      } else if ((daysSinceLastLogin <= 15 || (daysSinceLastOrder !== null && daysSinceLastOrder <= 30))) {
        activity = 'active';
      } else if (daysSinceLastLogin <= 30 || (daysSinceLastOrder !== null && daysSinceLastOrder <= 60)) {
        activity = 'moderate';
      } else {
        activity = 'at_risk';
        riskLevel = 'high';
      }

      // Cart behavior analysis (simplified for now)
      const currentCart = customer.carts.length > 0 ? customer.carts[0] : null;
      const hasActiveCart = !!currentCart;
      const cartValue = 0; // Simplified - would need cart items relation

      // Purchase pattern analysis
      const orderFrequency = orderCount > 1 ? 
        (now.getTime() - new Date(customer.orders[customer.orders.length - 1]?.createdAt || now).getTime()) / 
        (customer.orders.length - 1) / (1000 * 60 * 60 * 24) : null;

      // Simplified category analysis
      const topCategories: string[] = ['general']; // Simplified for now

      // AI-powered behavioral insights
      const behaviorInsights = generateAdvancedBehaviorInsights(customer, {
        orderCount,
        totalSpent,
        avgOrderValue,
        daysSinceLastOrder,
        daysSinceLastLogin,
        segment,
        activity,
        engagementScore,
        hasActiveCart,
        cartValue,
        orderFrequency,
        topCategories
      });

      return {
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString(),
        lastLogin: customer.lastLogin?.toISOString(),

        // Basic metrics
        totalSpent,
        orderCount,
        avgOrderValue,
        
        // Segmentation
        segment,
        value,
        activity,
        riskLevel,
        engagementScore,
        
        // Timing insights
        daysSinceSignup,
        daysSinceLastOrder,
        daysSinceLastLogin,
        orderFrequency,
        
        // Order history insights
        lastOrderDate: orderCount > 0 ? new Date(Math.max(...customer.orders.map((o: any) => new Date(o.createdAt).getTime()))).toISOString() : null,
        
        // Cart behavior
        cartBehavior: {
          hasActiveCart,
          cartValue,
          cartItemCount: 0, // Simplified
          abandonment_risk: calculateCartAbandonmentRisk(daysSinceLastOrder, segment, hasActiveCart || false),
          conversion_likelihood: calculateConversionLikelihood(orderCount, segment, engagementScore, hasActiveCart || false)
        },
        
        // Purchase patterns
        purchasePatterns: {
          topCategories,
          seasonality: analyzePurchaseSeasonality(customer.orders),
          averageDaysBetweenOrders: orderFrequency,
          preferredOrderSize: getPreferredOrderSize(customer.orders)
        },
        
        // AI-driven insights
        riskOfChurn: calculateChurnRisk(daysSinceLastOrder, orderCount, segment, engagementScore, activity),
        recommendedAction: getRecommendedAction(segment, activity, value, daysSinceLastOrder, engagementScore, hasActiveCart || false),
        lifetimeValuePrediction: predictLifetimeValue(totalSpent, orderCount, daysSinceSignup, engagementScore, orderFrequency),
        nextPurchaseProbability: calculatePurchaseProbability(daysSinceLastOrder, avgOrderValue, segment, engagementScore, orderFrequency),
        
        // Behavioral insights from AI analysis
        behaviorProfile: behaviorInsights.profile,
        personalizedRecommendations: behaviorInsights.recommendations,
        riskFactors: behaviorInsights.risks,
        opportunityScore: behaviorInsights.opportunity,
        automationTriggers: behaviorInsights.triggers
      };
    });

    // Apply segment filter if specified
    const filteredCustomers = segment ? 
      customersWithAdvancedBehavior.filter(c => c.segment === segment) : 
      customersWithAdvancedBehavior;

    // Generate aggregated insights
    const aggregatedInsights = generateAggregatedInsights(customersWithAdvancedBehavior);
    
    return NextResponse.json({
      customers: filteredCustomers,
      totalCount: segment ? filteredCustomers.length : totalCount,
      hasMore: totalCount > offset + limit,
      insights: aggregatedInsights
    }, { status: 200 });

  } catch (error) {
    console.error('API Error /api/customers:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch customers',
      customers: [],
      totalCount: 0,
      hasMore: false
    }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating new customer:', body);

    const { firstName, lastName, email } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'First name, last name and email are required' }, { status: 400 });
    }

    // Check if customer already exists
    const existingCustomer = await prisma.user.findUnique({
      where: { email }
    });

    if (existingCustomer) {
      return NextResponse.json({ error: 'Customer with this email already exists' }, { status: 400 });
    }

    // Create new customer
    const newCustomer = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: 'temp_password', // You should hash this properly
      }
    });

    return NextResponse.json({ 
      message: 'Customer created successfully',
      customer: newCustomer
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

// Helper functions for advanced behavioral analytics

function getTopCategories(categories: string[]): string[] {
  const categoryCount = categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category);
}

function analyzePurchaseSeasonality(orders: any[]): string {
  if (orders.length < 2) return 'insufficient_data';
  
  const monthCounts = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const sortedEntries = Object.entries(monthCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number));
  
  if (sortedEntries.length === 0) return 'no_pattern';
  
  const topMonth = sortedEntries[0];
  if (!topMonth) return 'no_pattern';
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `peak_${monthNames[parseInt(topMonth[0])]}`;
}

function getPreferredOrderSize(orders: any[]): string {
  if (orders.length === 0) return 'no_orders';
  
  const avgItems = orders.reduce((sum, order) => sum + (order.items?.length || 0), 0) / orders.length;
  
  if (avgItems <= 1) return 'single_item';
  if (avgItems <= 3) return 'small_basket';
  if (avgItems <= 6) return 'medium_basket';
  return 'large_basket';
}

function calculateCartAbandonmentRisk(daysSinceLastOrder: number | null, segment: string, hasActiveCart: boolean): string {
  if (!hasActiveCart) return 'no_cart';
  
  let risk = 'low';
  
  if (segment === 'inactive' || (daysSinceLastOrder && daysSinceLastOrder > 90)) {
    risk = 'high';
  } else if (segment === 'first_time' || (daysSinceLastOrder && daysSinceLastOrder > 30)) {
    risk = 'medium';
  }
  
  return risk;
}

function calculateConversionLikelihood(orderCount: number, segment: string, engagementScore: number, hasActiveCart: boolean): string {
  if (!hasActiveCart) return 'no_cart';
  
  let likelihood = 'low';
  
  if (segment === 'vip' || segment === 'loyal') {
    likelihood = 'high';
  } else if (engagementScore > 60 || orderCount >= 2) {
    likelihood = 'medium';
  } else if (segment === 'developing' || engagementScore > 30) {
    likelihood = 'medium';
  }
  
  return likelihood;
}

function generateAdvancedBehaviorInsights(customer: any, metrics: any) {
  const {
    orderCount,
    totalSpent,
    daysSinceLastOrder,
    segment,
    activity,
    engagementScore,
    hasActiveCart,
    cartValue,
    topCategories
  } = metrics;

  // Behavior profile
  const profile = {
    type: segment,
    engagement_level: engagementScore > 70 ? 'high' : engagementScore > 40 ? 'medium' : 'low',
    shopping_frequency: orderCount > 10 ? 'frequent' : orderCount > 3 ? 'regular' : 'occasional',
    spending_pattern: totalSpent > 1000 ? 'high_spender' : totalSpent > 300 ? 'moderate_spender' : 'budget_conscious',
    category_focus: topCategories.length > 0 ? topCategories[0] : 'varied'
  };

  // Personalized recommendations
  const recommendations = [];
  
  if (hasActiveCart) {
    recommendations.push({
      type: 'cart_recovery',
      message: `Complete your purchase of $${cartValue.toFixed(2)}`,
      priority: 'high',
      action: 'send_cart_reminder'
    });
  }
  
  if (segment === 'first_time' && daysSinceLastOrder && daysSinceLastOrder > 14) {
    recommendations.push({
      type: 'second_purchase',
      message: 'Encourage repeat purchase with personalized recommendations',
      priority: 'high',
      action: 'send_product_recommendations'
    });
  }
  
  if (activity === 'at_risk') {
    recommendations.push({
      type: 'reactivation',
      message: 'Customer at risk of churning - send win-back campaign',
      priority: 'high',
      action: 'send_winback_offer'
    });
  }

  // Risk factors
  const risks = [];
  
  if (daysSinceLastOrder && daysSinceLastOrder > 60) {
    risks.push('long_absence');
  }
  if (segment === 'first_time' && daysSinceLastOrder && daysSinceLastOrder > 30) {
    risks.push('first_purchase_churn');
  }
  if (hasActiveCart && cartValue > 100) {
    risks.push('high_value_cart_abandonment');
  }

  // Opportunity score (0-100)
  let opportunity = 0;
  if (segment === 'developing') opportunity += 30;
  if (hasActiveCart) opportunity += 25;
  if (engagementScore > 50) opportunity += 20;
  if (topCategories.length > 0) opportunity += 15;
  if (orderCount === 1) opportunity += 10;

  // Automation triggers
  const triggers = [];
  
  if (hasActiveCart) {
    triggers.push({
      event: 'cart_abandonment_1h',
      action: 'send_cart_reminder_email'
    });
  }
  
  if (daysSinceLastOrder && daysSinceLastOrder > 30 && segment !== 'inactive') {
    triggers.push({
      event: 'inactivity_30_days',
      action: 'send_reengagement_email'
    });
  }

  return {
    profile,
    recommendations,
    risks,
    opportunity,
    triggers
  };
}

function calculateChurnRisk(daysSinceLastOrder: number | null, orderCount: number, segment: string, engagementScore: number, activity: string): string {
  if (activity === 'at_risk' || (daysSinceLastOrder && daysSinceLastOrder > 90)) return 'high';
  if (segment === 'first_time' && daysSinceLastOrder && daysSinceLastOrder > 45) return 'high';
  if (engagementScore < 30 || (daysSinceLastOrder && daysSinceLastOrder > 60)) return 'medium';
  return 'low';
}

function getRecommendedAction(segment: string, activity: string, value: string, daysSinceLastOrder: number | null, engagementScore: number, hasActiveCart: boolean): string {
  if (hasActiveCart) return 'send_cart_recovery';
  if (activity === 'at_risk') return 'send_winback_campaign';
  if (segment === 'first_time' && daysSinceLastOrder && daysSinceLastOrder > 14) return 'encourage_second_purchase';
  if (segment === 'vip' && daysSinceLastOrder && daysSinceLastOrder > 30) return 'vip_outreach';
  if (engagementScore < 30) return 'reengagement_campaign';
  return 'nurture_relationship';
}

function predictLifetimeValue(totalSpent: number, orderCount: number, daysSinceSignup: number, engagementScore: number, orderFrequency: number | null): number {
  if (orderCount === 0) return 0;
  
  const avgOrderValue = totalSpent / orderCount;
  const projectedOrders = orderFrequency ? (365 / orderFrequency) * 2 : orderCount * 2; // 2-year projection
  const engagementMultiplier = 1 + (engagementScore / 100);
  
  return Math.round(avgOrderValue * projectedOrders * engagementMultiplier);
}

function calculatePurchaseProbability(daysSinceLastOrder: number | null, avgOrderValue: number, segment: string, engagementScore: number, orderFrequency: number | null): number {
  if (!daysSinceLastOrder) return 0;
  
  let baseProbability = 0.1; // 10% base
  
  // Adjust based on segment
  if (segment === 'vip') baseProbability = 0.8;
  else if (segment === 'loyal') baseProbability = 0.6;
  else if (segment === 'developing') baseProbability = 0.4;
  else if (segment === 'first_time') baseProbability = 0.2;
  
  // Adjust based on recency
  if (daysSinceLastOrder <= 30) baseProbability *= 1.5;
  else if (daysSinceLastOrder <= 60) baseProbability *= 1.0;
  else baseProbability *= 0.5;
  
  // Adjust based on engagement
  baseProbability *= (engagementScore / 100);
  
  return Math.min(Math.round(baseProbability * 100), 100);
}

function generateAggregatedInsights(customers: any[]) {
  const totalCustomers = customers.length;
  
  const segmentCounts = customers.reduce((acc, customer) => {
    acc[customer.segment] = (acc[customer.segment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const activityCounts = customers.reduce((acc, customer) => {
    acc[customer.activity] = (acc[customer.activity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const riskCounts = customers.reduce((acc, customer) => {
    acc[customer.riskOfChurn] = (acc[customer.riskOfChurn] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgEngagement = customers.reduce((sum, c) => sum + c.engagementScore, 0) / totalCustomers;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const activeCartCustomers = customers.filter(c => c.cartBehavior.hasActiveCart).length;
  
  return {
    summary: {
      totalCustomers,
      avgEngagementScore: Math.round(avgEngagement),
      totalRevenue,
      activeCartCustomers,
      churnRiskCustomers: riskCounts.high || 0
    },
    segments: segmentCounts,
    activity: activityCounts,
    riskDistribution: riskCounts,
    recommendations: generateTopRecommendations(customers)
  };
}

function generateTopRecommendations(customers: any[]) {
  const recommendations = [];
  
  const atRiskCustomers = customers.filter(c => c.riskOfChurn === 'high').length;
  const activeCartCustomers = customers.filter(c => c.cartBehavior.hasActiveCart).length;
  const firstTimeCustomers = customers.filter(c => c.segment === 'first_time').length;
  
  if (atRiskCustomers > 0) {
    recommendations.push({
      type: 'churn_prevention',
      message: `${atRiskCustomers} customers at high churn risk`,
      action: 'Create targeted retention campaign',
      priority: 'high'
    });
  }
  
  if (activeCartCustomers > 0) {
    recommendations.push({
      type: 'cart_recovery',
      message: `${activeCartCustomers} customers with active carts`,
      action: 'Send cart recovery emails',
      priority: 'high'
    });
  }
  
  if (firstTimeCustomers > 0) {
    recommendations.push({
      type: 'first_purchase_nurture',
      message: `${firstTimeCustomers} first-time customers need nurturing`,
      action: 'Implement onboarding sequence',
      priority: 'medium'
    });
  }
  
  return recommendations;
}