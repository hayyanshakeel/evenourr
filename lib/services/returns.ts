import prisma from '@/lib/db';

export interface CreateReturnData {
  orderId: number;
  userId?: number;
  customerId?: number;
  reason: string;
  reasonCategory: string;
  description?: string;
  customerNotes?: string;
  items: Array<{
    productId: number;
    variantId?: number;
    quantity: number;
    unitPrice: number;
    productName: string;
    variantTitle?: string;
  }>;
}

export interface UpdateReturnData {
  status?: string;
  refundAmount?: number;
  refundMethod?: string;
  priority?: string;
  trackingNumber?: string;
  carrierName?: string;
  returnLabel?: string;
  processedBy?: string;
  adminNotes?: string;
}

export interface ReturnFilters {
  status?: string;
  reasonCategory?: string;
  priority?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export class ReturnsService {
  /**
   * Create a new return request
   */
  static async createReturn(data: CreateReturnData): Promise<any> {
    // Generate unique RMA number
    const rmaNumber = await this.generateRMANumber();
    
    // Calculate total refund amount
    const refundAmount = data.items.reduce((total, item) => 
      total + (item.unitPrice * item.quantity), 0
    );

    const result = await prisma.$transaction(async (tx) => {
      // Create the return
      const returnRecord = await (tx as any).returnRequest.create({
        data: {
          rmaNumber,
          orderId: data.orderId,
          userId: data.userId,
          customerId: data.customerId,
          reason: data.reason,
          reasonCategory: data.reasonCategory,
          description: data.description,
          customerNotes: data.customerNotes,
          refundAmount,
          status: 'requested',
        },
      });

      // Create return items
      await (tx as any).returnItem.createMany({
        data: data.items.map(item => ({
          returnId: returnRecord.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          productName: item.productName,
          variantTitle: item.variantTitle,
        })),
      });

      // Create initial return update
      await (tx as any).returnUpdate.create({
        data: {
          returnId: returnRecord.id,
          status: 'requested',
          message: 'Return request submitted and is under review',
          isPublic: true,
          createdBy: 'system',
        },
      });

      return returnRecord;
    });

    return result;
  }

  /**
   * Get return by ID with all related data
   */
  static async getReturnById(id: string) {
    return await (prisma as any).returnRequest.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true }
            },
            customer: true,
            orderItems: {
              include: {
                product: true,
                variant: true,
              },
            },
          },
        },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        customer: true,
        returnItems: {
          include: {
            product: true,
            variant: true,
          },
        },
        returnUpdates: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Get returns with filters and pagination
   */
  static async getReturns(
    filters: ReturnFilters = {},
    page: number = 1,
    limit: number = 20
  ) {
    console.log('🔍 [ReturnsService] Starting getReturns');
    console.log('📊 [ReturnsService] Input parameters:', { filters, page, limit });
    
    const offset = (page - 1) * limit;
    console.log('📊 [ReturnsService] Calculated offset:', offset);
    
    const where: any = {};
    
    if (filters.status) {
      where.status = filters.status;
      console.log('🔍 [ReturnsService] Added status filter:', filters.status);
    }
    
    if (filters.reasonCategory) {
      where.reasonCategory = filters.reasonCategory;
      console.log('🔍 [ReturnsService] Added reasonCategory filter:', filters.reasonCategory);
    }
    
    if (filters.priority) {
      where.priority = filters.priority;
      console.log('🔍 [ReturnsService] Added priority filter:', filters.priority);
    }
    
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom;
        console.log('🔍 [ReturnsService] Added dateFrom filter:', filters.dateFrom);
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo;
        console.log('🔍 [ReturnsService] Added dateTo filter:', filters.dateTo);
      }
    }
    
    if (filters.search) {
      where.OR = [
        { rmaNumber: { contains: filters.search } },
        { reason: { contains: filters.search } },
        { customerNotes: { contains: filters.search } },
        { 
          order: {
            user: {
              OR: [
                { email: { contains: filters.search } },
                { firstName: { contains: filters.search } },
                { lastName: { contains: filters.search } },
              ],
            },
          },
        },
      ];
      console.log('🔍 [ReturnsService] Added search filter:', filters.search);
    }
    
    console.log('🔍 [ReturnsService] Final where clause:', JSON.stringify(where, null, 2));
    console.log('📞 [ReturnsService] About to execute Prisma queries...');

    const [returns, total] = await Promise.all([
      (async () => {
        console.log('📞 [ReturnsService] Executing findMany query...');
        try {
          const result = await (prisma as any).returnRequest.findMany({
            where,
            include: {
              order: {
                include: {
                  user: {
                    select: { id: true, email: true, firstName: true, lastName: true }
                  },
                  customer: true,
                },
              },
              user: {
                select: { id: true, email: true, firstName: true, lastName: true }
              },
              customer: true,
              returnItems: {
                include: {
                  product: true,
                  variant: true,
                },
              },
              _count: {
                select: { returnItems: true, returnUpdates: true },
              },
            },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
          });
          console.log('✅ [ReturnsService] findMany query completed, found', result.length, 'returns');
          return result;
        } catch (error) {
          console.error('❌ [ReturnsService] findMany query failed:', error);
          throw error;
        }
      })(),
      (async () => {
        console.log('📞 [ReturnsService] Executing count query...');
        try {
          const result = await (prisma as any).returnRequest.count({ where });
          console.log('✅ [ReturnsService] count query completed, total:', result);
          return result;
        } catch (error) {
          console.error('❌ [ReturnsService] count query failed:', error);
          throw error;
        }
      })()
    ]);

    console.log('✅ [ReturnsService] getReturns completed successfully');
    console.log('📊 [ReturnsService] Final results:', {
      returnsCount: returns.length,
      totalCount: total,
      page,
      limit,
      hasMore: offset + limit < total
    });
    
    return {
      returns,
      pagination: {
        page,
        limit,
        total,
        hasMore: offset + limit < total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update return status and details
   */
  static async updateReturn(
    id: string,
    data: UpdateReturnData,
    updatedBy: string
  ): Promise<any> {
    const result = await prisma.$transaction(async (tx) => {
      // Update the return
      const updatedReturn = await (tx as any).returnRequest.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
          ...(data.status === 'approved' && { approvedAt: new Date() }),
          ...(data.status === 'rejected' && { rejectedAt: new Date() }),
          ...(data.status === 'completed' && { completedAt: new Date() }),
          ...(data.processedBy && { processedAt: new Date() }),
        },
      });

      // Create return update log
      if (data.status) {
        const statusMessages: Record<string, string> = {
          approved: 'Return request has been approved',
          rejected: 'Return request has been rejected',
          processing: 'Return is being processed',
          completed: 'Return has been completed and refund processed',
          cancelled: 'Return request has been cancelled',
        };

        await (tx as any).returnUpdate.create({
          data: {
            returnId: id,
            status: data.status,
            message: statusMessages[data.status] || `Status updated to ${data.status}`,
            isPublic: true,
            createdBy: updatedBy,
          },
        });
      }

      return updatedReturn;
    });

    return result;
  }

  /**
   * Add return update/note
   */
  static async addReturnUpdate(
    returnId: string,
    message: string,
    isPublic: boolean = true,
    createdBy: string
  ): Promise<any> {
    return await (prisma as any).returnUpdate.create({
      data: {
        returnId,
        message,
        isPublic,
        createdBy,
        status: '', // Will be filled with current return status
      },
    });
  }

  /**
   * Get return statistics
   */
  static async getReturnStats(dateFrom?: Date, dateTo?: Date) {
    console.log('📈 [ReturnsService] Starting getReturnStats');
    console.log('📊 [ReturnsService] Date range:', { dateFrom, dateTo });
    
    const where: any = {};
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
        console.log('🔍 [ReturnsService] Added dateFrom filter:', dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = dateTo;
        console.log('🔍 [ReturnsService] Added dateTo filter:', dateTo);
      }
    }
    
    console.log('🔍 [ReturnsService] Stats where clause:', JSON.stringify(where, null, 2));
    console.log('📞 [ReturnsService] About to execute stats queries...');

    const [
      totalReturns,
      pendingReturns,
      approvedReturns,
      completedReturns,
      rejectedReturns,
      totalRefundAmount,
      returnsByReason,
      returnsByCategory,
    ] = await Promise.all([
      (prisma as any).returnRequest.count({ where }),
      (prisma as any).returnRequest.count({ where: { ...where, status: 'requested' } }),
      (prisma as any).returnRequest.count({ where: { ...where, status: 'approved' } }),
      (prisma as any).returnRequest.count({ where: { ...where, status: 'completed' } }),
      (prisma as any).returnRequest.count({ where: { ...where, status: 'rejected' } }),
      (prisma as any).returnRequest.aggregate({
        where: { ...where, status: { in: ['approved', 'completed'] } },
        _sum: { refundAmount: true },
      }),
      (prisma as any).returnRequest.groupBy({
        by: ['reason'],
        where,
        _count: { reason: true },
        orderBy: { _count: { reason: 'desc' } },
      }),
      (prisma as any).returnRequest.groupBy({
        by: ['reasonCategory'],
        where,
        _count: { reasonCategory: true },
        orderBy: { _count: { reasonCategory: 'desc' } },
      }),
    ]);

    return {
      totalReturns,
      pendingReturns,
      approvedReturns,
      completedReturns,
      rejectedReturns,
      totalRefundAmount: totalRefundAmount._sum.refundAmount || 0,
      returnsByReason,
      returnsByCategory,
      returnRate: totalReturns > 0 ? (totalReturns / await this.getTotalOrders()) * 100 : 0,
    };
  }

  /**
   * Generate unique RMA number
   */
  private static async generateRMANumber(): Promise<string> {
    const prefix = 'RMA';
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    // Get count of returns created today to generate sequential number
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const todaysCount = await (prisma as any).returnRequest.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    
    const sequence = (todaysCount + 1).toString().padStart(3, '0');
    
    return `${prefix}${year}${month}${day}${sequence}`;
  }

  /**
   * Get total orders for return rate calculation
   */
  private static async getTotalOrders(): Promise<number> {
    return await prisma.order.count();
  }

  /**
   * Get returnable items from an order
   */
  static async getReturnableItems(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
        returns: {
          include: {
            returnItems: true,
          },
        } as any,
      },
    });

    if (!order) return null;

    // Calculate already returned quantities
    const returnedQuantities: Record<string, number> = {};
    
    (order as any).returns.forEach((returnRecord: any) => {
      if (returnRecord.status !== 'rejected' && returnRecord.status !== 'cancelled') {
        returnRecord.returnItems.forEach((item: any) => {
          const key = `${item.productId}-${item.variantId || 'null'}`;
          returnedQuantities[key] = (returnedQuantities[key] || 0) + item.quantity;
        });
      }
    });

    // Filter returnable items
    const returnableItems = (order as any).orderItems
      .map((item: any) => {
        const key = `${item.productId}-${item.variantId || 'null'}`;
        const returnedQty = returnedQuantities[key] || 0;
        const availableQty = item.quantity - returnedQty;
        
        if (availableQty > 0) {
          return {
            ...item,
            availableQuantity: availableQty,
            returnedQuantity: returnedQty,
          };
        }
        return null;
      })
      .filter(Boolean);

    return {
      order,
      returnableItems,
    };
  }
}
