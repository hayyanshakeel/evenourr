// lib/admin-data.ts
import { prisma } from './db';

// Types for admin data
export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  inventory: number;
  status: string;
  imageUrl: string | null;
  category?: { id: number; name: string } | null;
  images?: { id: number; imageUrl: string; altText: string | null }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminOrder {
  id: number;
  userId: number | null;
  customerId: number | null;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      imageUrl: string | null;
    };
  }[];
  customer?: {
    id: number;
    name: string;
    email: string;
  } | null;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

export interface AdminCollection {
  id: number;
  title: string;
  handle: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  productCount: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface AdminInventoryItem {
  id: number;
  name: string;
  sku: string | null;
  quantity: number;
  reserved: number;
  category: string | null;
  price: number;
  description: string | null;
  status: string;
  reorderLevel: number;
  imageUrl: string | null;
  lastRestocked: Date;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
  lowStockCount: number;
  pendingOrdersCount: number;
  recentOrders: AdminOrder[];
  topProducts: {
    id: number;
    name: string;
    totalSold: number;
    revenue: number;
    imageUrl: string | null;
  }[];
}

// Products service
export const ProductsService = {
  getAll: async (params?: {
    status?: string;
    search?: string;
    categoryId?: number;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const where: any = {};
      
      if (params?.status) {
        where.status = params.status;
      }
      
      if (params?.search) {
        where.OR = [
          { name: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
          { slug: { contains: params.search, mode: 'insensitive' } },
        ];
      }
      
      if (params?.categoryId) {
        where.categoryId = params.categoryId;
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: {
              select: { id: true, name: true },
            },
            images: {
              select: { id: true, imageUrl: true, altText: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: params?.limit || 20,
          skip: params?.offset || 0,
        }),
        prisma.product.count({ where }),
      ]);

      return { products: products as AdminProduct[], total };
    } catch (error) {
      console.error('Error in ProductsService.getAll:', error);
      throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getById: async (id: number) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: { id: true, name: true },
          },
          images: {
            select: { id: true, imageUrl: true, altText: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      return product as AdminProduct | null;
    } catch (error) {
      console.error('Error in ProductsService.getById:', error);
      throw new Error(`Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  delete: async (id: number) => {
    try {
      await prisma.product.delete({ where: { id } });
    } catch (error) {
      console.error('Error in ProductsService.delete:', error);
      throw new Error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getStats: async () => {
    try {
      const [total, active, lowStock, draft] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { status: 'active' } }),
        prisma.product.count({ where: { inventory: { lte: 10 } } }),
        prisma.product.count({ where: { status: 'draft' } }),
      ]);

      return { total, active, lowStock, draft };
    } catch (error) {
      console.error('Error in ProductsService.getStats:', error);
      throw new Error(`Failed to fetch product stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Orders service
export const OrdersService = {
  getAll: async (params?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const where: any = {};
      
      if (params?.status) {
        where.status = params.status;
      }

      // Add search functionality
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        const searchConditions = [];
        
        // Search by order ID if search term is a number
        if (!isNaN(parseInt(searchTerm))) {
          searchConditions.push({ id: parseInt(searchTerm) });
        }
        
        // Search by customer name/email
        searchConditions.push({
          customer: {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' as any } },
              { email: { contains: searchTerm, mode: 'insensitive' as any } }
            ]
          }
        });
        
        // Search by user name/email
        searchConditions.push({
          user: {
            OR: [
              { firstName: { contains: searchTerm, mode: 'insensitive' as any } },
              { lastName: { contains: searchTerm, mode: 'insensitive' as any } },
              { email: { contains: searchTerm, mode: 'insensitive' as any } }
            ]
          }
        });
        
        where.OR = searchConditions;
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            orderItems: {
              include: {
                product: {
                  select: { id: true, name: true, imageUrl: true },
                },
              },
            },
            customer: {
              select: { id: true, name: true, email: true },
            },
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: params?.limit || 20,
          skip: params?.offset || 0,
        }),
        prisma.order.count({ where }),
      ]);

      return { orders: orders as AdminOrder[], total };
    } catch (error) {
      console.error('Error in OrdersService.getAll:', error);
      throw new Error(`Failed to fetch orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getById: async (id: number) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          orderItems: {
            include: {
              product: {
                select: { id: true, name: true, imageUrl: true },
              },
            },
          },
          customer: {
            select: { id: true, name: true, email: true },
          },
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });

      return order as AdminOrder | null;
    } catch (error) {
      console.error('Error in OrdersService.getById:', error);
      throw new Error(`Failed to fetch order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getStats: async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [total, pending, shipped, cancelled, recent] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'pending' } }),
        prisma.order.count({ where: { status: 'shipped' } }),
        prisma.order.count({ where: { status: 'cancelled' } }),
        prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      ]);

      return { total, pending, shipped, cancelled, recent };
    } catch (error) {
      console.error('Error in OrdersService.getStats:', error);
      throw new Error(`Failed to fetch order stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getRevenue: async () => {
    try {
      const revenue = await prisma.order.aggregate({
        where: { status: { in: ['paid', 'shipped', 'delivered'] } },
        _sum: { totalPrice: true },
      });

      return revenue._sum.totalPrice || 0;
    } catch (error) {
      console.error('Error in OrdersService.getRevenue:', error);
      throw new Error(`Failed to fetch revenue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Collections service
export const CollectionsService = {
  getAll: async (params?: {
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const where: any = {};
      
      if (params?.search) {
        where.OR = [
          { title: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ];
      }

      const collections = await prisma.collection.findMany({
        where,
        include: {
          _count: {
            select: { productsToCollections: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: params?.limit || 20,
        skip: params?.offset || 0,
      });

      return collections.map(collection => ({
        ...collection,
        productCount: collection._count.productsToCollections,
        status: 'ACTIVE' as const, // Default to active since we don't have status in schema
      })) as AdminCollection[];
    } catch (error) {
      console.error('Error in CollectionsService.getAll:', error);
      throw new Error(`Failed to fetch collections: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getById: async (id: number) => {
    try {
      const collection = await prisma.collection.findUnique({
        where: { id },
        include: {
          productsToCollections: {
            include: {
              product: true,
            },
          },
          _count: {
            select: { productsToCollections: true },
          },
        },
      });

      if (!collection) return null;

      return {
        ...collection,
        productCount: collection._count.productsToCollections,
      } as AdminCollection & {
        productsToCollections: any[];
      };
    } catch (error) {
      console.error('Error in CollectionsService.getById:', error);
      throw new Error(`Failed to fetch collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  delete: async (id: number) => {
    try {
      await prisma.collection.delete({ where: { id } });
    } catch (error) {
      console.error('Error in CollectionsService.delete:', error);
      throw new Error(`Failed to delete collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getStats: async () => {
    try {
      const [totalCollections, activeCollections] = await Promise.all([
        prisma.collection.count(),
        prisma.collection.count(), // All collections are considered active for now
      ]);

      const totalProducts = await prisma.productToCollection.count();
      const averageProductsPerCollection = totalCollections > 0 ? Math.round(totalProducts / totalCollections) : 0;

      return { 
        totalCollections, 
        activeCollections, 
        totalProducts,
        averageProductsPerCollection 
      };
    } catch (error) {
      console.error('Error in CollectionsService.getStats:', error);
      throw new Error(`Failed to fetch collection stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Inventory service
export const InventoryService = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const where: any = {};
      
      if (params?.search) {
        where.OR = [
          { name: { contains: params.search, mode: 'insensitive' } },
          { slug: { contains: params.search, mode: 'insensitive' } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: params?.limit || 20,
        skip: params?.offset || 0,
      });

      return products.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.slug, // Using slug as SKU for now
        quantity: product.inventory,
        reserved: 0, // Default reserved quantity
        category: product.category?.name || 'Uncategorized',
        price: product.price,
        description: product.description || '',
        status: product.inventory > 10 ? 'In Stock' : product.inventory > 0 ? 'Low Stock' : 'Out of Stock',
        reorderLevel: 10, // Default reorder level
        imageUrl: product.imageUrl,
        lastRestocked: product.updatedAt,
      })) as AdminInventoryItem[];
    } catch (error) {
      console.error('Error in InventoryService.getAll:', error);
      throw new Error(`Failed to fetch inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getStats: async () => {
    try {
      const [totalItems, lowStock, outOfStock] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { inventory: { gt: 0, lte: 10 } } }),
        prisma.product.count({ where: { inventory: 0 } }),
      ]);

      const totalValue = await prisma.product.aggregate({
        _sum: { price: true },
      });

      return {
        totalItems,
        lowStock,
        outOfStock,
        totalValue: totalValue._sum.price || 0,
      };
    } catch (error) {
      console.error('Error in InventoryService.getStats:', error);
      throw new Error(`Failed to fetch inventory stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getLowStockAlerts: async () => {
    try {
      const lowStockProducts = await prisma.product.findMany({
        where: { inventory: { gt: 0, lte: 10 } },
        select: {
          id: true,
          name: true,
          inventory: true,
          slug: true,
        },
        orderBy: { inventory: 'asc' },
        take: 10,
      });

      return lowStockProducts.map(product => ({
        name: product.name,
        sku: product.slug,
        quantity: product.inventory,
      }));
    } catch (error) {
      console.error('Error in InventoryService.getLowStockAlerts:', error);
      throw new Error(`Failed to fetch low stock alerts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Dashboard service
export const DashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      // Get current metrics
      const [
        revenue,
        previousRevenue,
        totalOrders,
        previousOrders,
        totalProducts,
        totalCustomers,
        lowStockCount,
        pendingOrdersCount,
        recentOrders,
      ] = await Promise.all([
        // Current period revenue
        prisma.order.aggregate({
          where: {
            status: { in: ['paid', 'shipped', 'delivered'] },
            createdAt: { gte: thirtyDaysAgo },
          },
          _sum: { totalPrice: true },
        }),
        // Previous period revenue for comparison
        prisma.order.aggregate({
          where: {
            status: { in: ['paid', 'shipped', 'delivered'] },
            createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
          },
          _sum: { totalPrice: true },
        }),
        // Orders count
        prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.order.count({
          where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
        }),
        // Products and customers
        prisma.product.count(),
        prisma.customer.count(),
        // Low stock and pending orders
        prisma.product.count({ where: { inventory: { lte: 10 } } }),
        prisma.order.count({ where: { status: 'pending' } }),
        // Recent orders
        prisma.order.findMany({
          include: {
            orderItems: {
              include: {
                product: { select: { id: true, name: true, imageUrl: true } },
              },
            },
            customer: { select: { id: true, name: true, email: true } },
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

      // Calculate percentage changes
      const revenueChange = previousRevenue._sum.totalPrice
        ? ((revenue._sum.totalPrice || 0) - previousRevenue._sum.totalPrice) /
          previousRevenue._sum.totalPrice * 100
        : 0;

      const ordersChange = previousOrders
        ? ((totalOrders - previousOrders) / previousOrders) * 100
        : 0;

      // Get top products by sales
      const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      });

      const topProductsWithDetails = await Promise.all(
        topProducts.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true, imageUrl: true },
          });
          return {
            id: item.productId,
            name: product?.name || 'Unknown Product',
            totalSold: item._sum.quantity || 0,
            revenue: item._sum.price || 0,
            imageUrl: product?.imageUrl || null,
          };
        })
      );

      return {
        totalRevenue: revenue._sum.totalPrice || 0,
        totalOrders,
        totalProducts,
        totalCustomers,
        revenueChange,
        ordersChange,
        productsChange: 0, // Would need historical data to calculate
        customersChange: 0, // Would need historical data to calculate
        lowStockCount,
        pendingOrdersCount,
        recentOrders: recentOrders as AdminOrder[],
        topProducts: topProductsWithDetails,
      };
    } catch (error) {
      console.error('Error in DashboardService.getMetrics:', error);
      throw new Error(`Failed to fetch dashboard metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Categories service
export const CategoriesService = {
  getAll: async () => {
    try {
      return await prisma.category.findMany({
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      console.error('Error in CategoriesService.getAll:', error);
      throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Customers service
export const CustomersService = {
  getAll: async (params?: {
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const where: any = {};
      
      if (params?.search) {
        where.OR = [
          { name: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } },
        ];
      }

      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          where,
          include: {
            _count: {
              select: { orders: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: params?.limit || 20,
          skip: params?.offset || 0,
        }),
        prisma.customer.count({ where }),
      ]);

      return { customers, total };
    } catch (error) {
      console.error('Error in CustomersService.getAll:', error);
      throw new Error(`Failed to fetch customers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getById: async (id: number) => {
    try {
      return await prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            include: {
              orderItems: {
                include: {
                  product: { select: { id: true, name: true, imageUrl: true } },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { orders: true },
          },
        },
      });
    } catch (error) {
      console.error('Error in CustomersService.getById:', error);
      throw new Error(`Failed to fetch customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  create: async (data: { name: string; email: string; phone?: string | null }) => {
    try {
      return await prisma.customer.create({
        data: {
          name: data.name,
          email: data.email,
        },
      });
    } catch (error) {
      console.error('Error in CustomersService.create:', error);
      throw new Error(`Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  update: async (id: number, data: { name?: string; email?: string; phone?: string | null }) => {
    try {
      return await prisma.customer.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
        },
      });
    } catch (error) {
      console.error('Error in CustomersService.update:', error);
      throw new Error(`Failed to update customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  delete: async (id: number) => {
    try {
      await prisma.customer.delete({ where: { id } });
    } catch (error) {
      console.error('Error in CustomersService.delete:', error);
      throw new Error(`Failed to delete customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getStats: async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [totalCustomers, newCustomers, totalOrders, totalRevenue] = await Promise.all([
        prisma.customer.count(),
        prisma.customer.count({
          where: {
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
        prisma.order.count(),
        prisma.order.aggregate({
          where: {
            status: { in: ['paid', 'shipped', 'delivered'] },
          },
          _sum: { totalPrice: true },
        }),
      ]);

      const averageOrdersPerCustomer = totalCustomers > 0 ? 
        (totalOrders / totalCustomers).toFixed(1) : '0.0';

      return {
        totalCustomers,
        newCustomers,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        averageOrdersPerCustomer,
      };
    } catch (error) {
      console.error('Error in CustomersService.getStats:', error);
      throw new Error(`Failed to fetch customer stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
