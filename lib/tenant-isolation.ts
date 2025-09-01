/**
 * Tenant Isolation Middleware
 * Enforces row-level security and tenant boundaries
 */

import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

export interface TenantContext {
  tenantId: string;
  userId?: string;
  role: 'admin' | 'user' | 'readonly';
  permissions: string[];
}

export class TenantIsolationManager {
  private static instance: TenantIsolationManager;
  private tenantPrismaClients: Map<string, PrismaClient> = new Map();

  static getInstance(): TenantIsolationManager {
    if (!TenantIsolationManager.instance) {
      TenantIsolationManager.instance = new TenantIsolationManager();
    }
    return TenantIsolationManager.instance;
  }

  /**
   * Extract tenant context from request
   */
  async extractTenantContext(request: NextRequest): Promise<TenantContext | null> {
    try {
      // Extract from JWT token
      const authHeader = request.headers.get('authorization');
      if (!authHeader) return null;

      const token = authHeader.replace('Bearer ', '');
      // TODO: Verify token and extract tenant info
      
      // For now, use a default tenant for admin
      return {
        tenantId: process.env.DEFAULT_TENANT_ID || 'evenour-main',
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'admin']
      };
    } catch (error) {
      console.error('Error extracting tenant context:', error);
      return null;
    }
  }

  /**
   * Get tenant-isolated Prisma client
   */
  getTenantPrismaClient(tenantId: string): PrismaClient {
    if (!this.tenantPrismaClients.has(tenantId)) {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: this.getTenantDatabaseUrl(tenantId)
          }
        }
      });

      // Add tenant isolation middleware
      this.addTenantMiddleware(prisma, tenantId);
      this.tenantPrismaClients.set(tenantId, prisma);
    }

    return this.tenantPrismaClients.get(tenantId)!;
  }

  /**
   * Add tenant isolation middleware to Prisma
   */
  private addTenantMiddleware(prisma: PrismaClient, tenantId: string) {
    prisma.$use(async (params, next) => {
      // Skip tenant filtering for models that don't have tenant_id
      const modelsWithTenants = ['User', 'Product', 'Order', 'Customer', 'Analytics'];
      
      if (!modelsWithTenants.includes(params.model || '')) {
        return next(params);
      }

      // Add tenant_id filter to all queries
      if (params.action === 'findMany' || params.action === 'findFirst') {
        params.args.where = {
          ...params.args.where,
          tenant_id: tenantId
        };
      } else if (params.action === 'create') {
        params.args.data = {
          ...params.args.data,
          tenant_id: tenantId
        };
      } else if (params.action === 'update' || params.action === 'delete') {
        params.args.where = {
          ...params.args.where,
          tenant_id: tenantId
        };
      }

      const result = await next(params);

      // Verify no cross-tenant data leaked
      if (Array.isArray(result)) {
        result.forEach((item: any) => {
          if (item.tenant_id && item.tenant_id !== tenantId) {
            throw new Error(`Tenant isolation violation: ${item.tenant_id} !== ${tenantId}`);
          }
        });
      } else if (result?.tenant_id && result.tenant_id !== tenantId) {
        throw new Error(`Tenant isolation violation: ${result.tenant_id} !== ${tenantId}`);
      }

      return result;
    });
  }

  /**
   * Get tenant-specific database URL
   * In a true multi-tenant setup, this would return different DB endpoints
   */
  private getTenantDatabaseUrl(tenantId: string): string {
    // For now, use same DB with tenant_id filtering
    // In production, you might have:
    // - Separate databases per tenant
    // - Separate schemas per tenant
    // - Or row-level security as implemented here
    
    const baseUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
    if (!baseUrl) {
      throw new Error('No database URL configured');
    }

    // TODO: In production, modify URL based on tenant
    // Example: replace database name with tenant-specific one
    return baseUrl;
  }

  /**
   * Validate tenant permissions for operation
   */
  validateTenantPermission(
    context: TenantContext,
    operation: 'read' | 'write' | 'delete' | 'admin',
    resource?: string
  ): boolean {
    // Admin role has all permissions
    if (context.role === 'admin') {
      return true;
    }

    // Check if user has required permission
    return context.permissions.includes(operation);
  }

  /**
   * Create tenant isolation wrapper for API routes
   */
  createTenantWrapper() {
    return (handler: Function) => {
      return async (request: NextRequest, ...args: any[]) => {
        const tenantContext = await this.extractTenantContext(request);
        
        if (!tenantContext) {
          return new Response(
            JSON.stringify({ error: 'Tenant context required' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Add tenant context to request
        (request as any).tenantContext = tenantContext;

        return handler(request, ...args);
      };
    };
  }
}

export const tenantIsolation = TenantIsolationManager.getInstance();
