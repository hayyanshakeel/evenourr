import prisma from '@/lib/db';
import { z } from 'zod';

// Enterprise-grade validation schemas
export const CreateCustomerSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
  // Phone field is now supported in the database
  phone: z.string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .nullable(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export const CustomerQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(['name', 'email', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Enterprise types
export interface CustomerWithStats {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    orders: number;
    returns?: number;
  };
  totalSpent?: number;
  lastOrderDate?: Date;
  segment?: 'new' | 'inactive' | 'developing' | 'loyal' | 'VIP';
  status?: 'active' | 'inactive';
}

export interface CustomerListResponse {
  customers: CustomerWithStats[];
  total: number;
  hasMore: boolean;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  avgOrderValue: number;
  repeatCustomerRate: number;
  segments: {
    new: number;
    inactive: number;
    developing: number;
    loyal: number;
    VIP: number;
  };
}

// Enterprise Customer Service
export class EnterpriseCustomerService {
  private static instance: EnterpriseCustomerService;
  
  public static getInstance(): EnterpriseCustomerService {
    if (!EnterpriseCustomerService.instance) {
      EnterpriseCustomerService.instance = new EnterpriseCustomerService();
    }
    return EnterpriseCustomerService.instance;
  }

  async validateCustomer(data: unknown): Promise<z.infer<typeof CreateCustomerSchema>> {
    try {
      return CreateCustomerSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        throw new Error(`Validation failed: ${messages.join(', ')}`);
      }
      throw error;
    }
  }

  async checkEmailExists(email: string, excludeId?: number): Promise<boolean> {
    try {
      const existing = await prisma.customer.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          ...(excludeId && { id: { not: excludeId } })
        }
      });
      return !!existing;
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw new Error('Failed to validate email uniqueness');
    }
  }

  async createCustomer(data: unknown): Promise<CustomerWithStats> {
    try {
      console.log('🔧 [CustomerService] Creating customer with data:', data);
      
      // Validate input data
      const validatedData = await this.validateCustomer(data);
      console.log('✅ [CustomerService] Validation passed:', validatedData);
      
      // Check for duplicate email
      const emailExists = await this.checkEmailExists(validatedData.email);
      if (emailExists) {
        throw new Error('A customer with this email already exists');
      }
      console.log('✅ [CustomerService] Email uniqueness check passed');

      // Create customer with transaction for data integrity
      const customer = await prisma.$transaction(async (tx) => {
        console.log('🔧 [CustomerService] Starting database transaction');
        const newCustomer = await tx.customer.create({
          data: {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone || null,
          },
          include: {
            _count: {
              select: { 
                orders: true,
                returns: true 
              }
            }
          }
        });
        console.log('✅ [CustomerService] Customer created in DB:', newCustomer.id);
        return newCustomer;
      });

      // Return customer with stats
      const result = {
        ...customer,
        totalSpent: 0,
        lastOrderDate: undefined,
        segment: 'new' as const,
        status: 'active' as const
      };
      
      console.log('✅ [CustomerService] Customer creation successful:', result.id);
      return result;

    } catch (error) {
      console.error('❌ [CustomerService] Error creating customer:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create customer: Unknown error');
    }
  }

  async getCustomers(params: unknown): Promise<CustomerListResponse> {
    try {
      const validatedParams = CustomerQuerySchema.parse(params);
      const { search, limit, offset, sortBy, sortOrder } = validatedParams;

      const where = search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } }
        ]
      } : {};

      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          where,
          include: {
            orders: {
              select: {
                totalPrice: true,
                createdAt: true,
                status: true
              }
            },
            _count: {
              select: { 
                orders: true,
                returns: true 
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          take: limit,
          skip: offset,
        }),
        prisma.customer.count({ where })
      ]);

      // Calculate stats for each customer
      const customersWithStats: CustomerWithStats[] = customers.map(customer => {
        const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const completedOrders = customer.orders.filter(order => order.status === 'completed');
        const lastOrder = completedOrders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        const segment = this.calculateCustomerSegment(customer._count.orders, totalSpent);
        const daysSinceLastOrder = lastOrder 
          ? Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        
        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
          _count: customer._count,
          totalSpent,
          lastOrderDate: lastOrder?.createdAt,
          segment,
          status: daysSinceLastOrder > 90 ? 'inactive' as const : 'active' as const
        };
      });

      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.floor(offset / limit) + 1;

      return {
        customers: customersWithStats,
        total,
        hasMore: offset + limit < total,
        pagination: {
          page: currentPage,
          limit,
          totalPages
        }
      };

    } catch (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to fetch customers');
    }
  }

  async getCustomerById(id: number): Promise<CustomerWithStats | null> {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            select: {
              id: true,
              totalPrice: true,
              createdAt: true,
              status: true
            },
            orderBy: { createdAt: 'desc' }
          },
          returns: {
            select: {
              id: true,
              reason: true,
              status: true,
              createdAt: true
            }
          },
          _count: {
            select: { 
              orders: true,
              returns: true 
            }
          }
        }
      });

      if (!customer) return null;

      const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const completedOrders = customer.orders.filter(order => order.status === 'completed');
      const lastOrder = completedOrders[0];
      
      const segment = this.calculateCustomerSegment(customer._count.orders, totalSpent);
      const daysSinceLastOrder = lastOrder 
        ? Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        _count: customer._count,
        totalSpent,
        lastOrderDate: lastOrder?.createdAt,
        segment,
        status: daysSinceLastOrder > 90 ? 'inactive' : 'active'
      };

    } catch (error) {
      console.error('Error fetching customer by ID:', error);
      throw new Error('Failed to fetch customer');
    }
  }

  async updateCustomer(id: number, data: unknown): Promise<CustomerWithStats> {
    try {
      const validatedData = UpdateCustomerSchema.parse(data);
      
      // Check if customer exists
      const existingCustomer = await this.getCustomerById(id);
      if (!existingCustomer) {
        throw new Error('Customer not found');
      }

      // Check email uniqueness if email is being updated
      if (validatedData.email && validatedData.email !== existingCustomer.email) {
        const emailExists = await this.checkEmailExists(validatedData.email, id);
        if (emailExists) {
          throw new Error('A customer with this email already exists');
        }
      }

      // Update customer
      const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: {
          ...(validatedData.name && { name: validatedData.name }),
          ...(validatedData.email && { email: validatedData.email.toLowerCase().trim() }),
        },
        include: {
          orders: {
            select: {
              totalPrice: true,
              createdAt: true,
              status: true
            }
          },
          _count: {
            select: { 
              orders: true,
              returns: true 
            }
          }
        }
      });

      // Calculate stats
      const totalSpent = updatedCustomer.orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const completedOrders = updatedCustomer.orders.filter(order => order.status === 'completed');
      const lastOrder = completedOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      const segment = this.calculateCustomerSegment(updatedCustomer._count.orders, totalSpent);
      const daysSinceLastOrder = lastOrder 
        ? Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      return {
        id: updatedCustomer.id,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        createdAt: updatedCustomer.createdAt,
        updatedAt: updatedCustomer.updatedAt,
        _count: updatedCustomer._count,
        totalSpent,
        lastOrderDate: lastOrder?.createdAt,
        segment,
        status: daysSinceLastOrder > 90 ? 'inactive' : 'active'
      };

    } catch (error) {
      console.error('Error updating customer:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update customer');
    }
  }

  async deleteCustomer(id: number): Promise<void> {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          _count: {
            select: { 
              orders: true,
              returns: true 
            }
          }
        }
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Check if customer has orders (business rule)
      if (customer._count.orders > 0) {
        throw new Error('Cannot delete customer with existing orders. Archive customer instead.');
      }

      await prisma.customer.delete({
        where: { id }
      });

    } catch (error) {
      console.error('Error deleting customer:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete customer');
    }
  }

  async getCustomerStats(): Promise<CustomerStats> {
    try {
      const [
        totalCustomers,
        newCustomers,
        activeCustomers,
        allCustomersWithOrders
      ] = await Promise.all([
        prisma.customer.count(),
        prisma.customer.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }),
        prisma.customer.count({
          where: {
            orders: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Active in last 90 days
                }
              }
            }
          }
        }),
        prisma.customer.findMany({
          include: {
            orders: {
              select: {
                totalPrice: true,
                status: true
              }
            },
            _count: {
              select: { orders: true }
            }
          }
        })
      ]);

      const totalRevenue = allCustomersWithOrders.reduce((sum, customer) => 
        sum + customer.orders.reduce((orderSum, order) => 
          orderSum + (order.status === 'completed' ? order.totalPrice : 0), 0
        ), 0
      );

      const totalOrders = allCustomersWithOrders.reduce((sum, customer) => 
        sum + customer.orders.filter(order => order.status === 'completed').length, 0
      );

      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const customersWithMultipleOrders = allCustomersWithOrders.filter(customer => 
        customer.orders.filter(order => order.status === 'completed').length > 1
      ).length;

      const repeatCustomerRate = totalCustomers > 0 ? (customersWithMultipleOrders / totalCustomers) * 100 : 0;

      // Calculate segments
      const segments = allCustomersWithOrders.reduce((acc, customer) => {
        const completedOrders = customer.orders.filter(order => order.status === 'completed');
        const totalSpent = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const segment = this.calculateCustomerSegment(completedOrders.length, totalSpent);
        acc[segment]++;
        return acc;
      }, { new: 0, inactive: 0, developing: 0, loyal: 0, VIP: 0 });

      return {
        totalCustomers,
        newCustomers,
        activeCustomers,
        totalRevenue,
        avgOrderValue,
        repeatCustomerRate,
        segments
      };

    } catch (error) {
      console.error('Error calculating customer stats:', error);
      throw new Error('Failed to calculate customer statistics');
    }
  }

  private calculateCustomerSegment(orderCount: number, totalSpent: number): 'new' | 'inactive' | 'developing' | 'loyal' | 'VIP' {
    if (orderCount === 0) return 'new';
    if (orderCount === 1 && totalSpent < 100) return 'developing';
    if (orderCount >= 2 && orderCount <= 5 && totalSpent < 500) return 'loyal';
    if (orderCount > 5 || totalSpent >= 500) return 'VIP';
    return 'inactive';
  }
}

// Export singleton instance
export const customerService = EnterpriseCustomerService.getInstance();
