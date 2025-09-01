/**
 * Layer 3: Business Logic & Database Operations Worker
 * Handles all admin API operations: orders, products, customers, etc.
 * Communicates directly with Turso database
 */

interface Env {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
}

interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
      'Access-Control-Max-Age': '86400'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Get authenticated user from Layer 2
      const userHeader = request.headers.get('X-Authenticated-User');
      const user: AuthenticatedUser = userHeader ? JSON.parse(userHeader) : null;
      
      if (!user && !url.pathname.startsWith('/auth/')) {
        return jsonResponse({ 
          success: false, 
          error: 'User not authenticated by Layer 2' 
        }, { status: 401, headers: corsHeaders });
      }

      console.log(`[Layer 3] Processing request: ${url.pathname} for user: ${user?.username || 'anonymous'}`);

      // Route to appropriate handler - support both /admin/ and /api/admin/ paths
      if (url.pathname.startsWith('/api/admin/orders') || url.pathname.startsWith('/admin/orders')) {
        return await handleOrders(request, env, corsHeaders, user);
      }
      
      if (url.pathname.startsWith('/api/admin/products') || url.pathname.startsWith('/admin/products')) {
        return await handleProducts(request, env, corsHeaders, user);
      }
      
      if (url.pathname.startsWith('/api/admin/customers') || url.pathname.startsWith('/admin/customers')) {
        return await handleCustomers(request, env, corsHeaders, user);
      }
      
      if (url.pathname.startsWith('/api/admin/dashboard') || url.pathname.startsWith('/admin/dashboard')) {
        return await handleDashboard(request, env, corsHeaders, user);
      }
      
      if (url.pathname.startsWith('/api/admin/inventory') || url.pathname.startsWith('/admin/inventory')) {
        return await handleInventory(request, env, corsHeaders, user);
      }
      
      if (url.pathname.startsWith('/api/admin/collections') || url.pathname.startsWith('/admin/collections')) {
        return await handleCollections(request, env, corsHeaders, user);
      }
      
      if (url.pathname.startsWith('/api/admin/categories') || url.pathname.startsWith('/admin/categories')) {
        return await handleCategories(request, env, corsHeaders, user);
      }
      
      if (url.pathname.startsWith('/api/admin/returns') || url.pathname.startsWith('/admin/returns')) {
        return await handleReturns(request, env, corsHeaders, user);
      }

      // Support /admin/stats endpoint for dashboard
      if (url.pathname === '/admin/stats') {
        return await handleDashboard(request, env, corsHeaders, user);
      }

      // Health check
      if (url.pathname === '/health') {
        return jsonResponse({
          service: '3-Layer Admin API Gateway',
          layer: 'business-logic',
          status: 'healthy',
          database: 'turso-connected',
          timestamp: new Date().toISOString()
        }, { status: 200, headers: corsHeaders });
      }

      return jsonResponse({ 
        success: false, 
        error: 'Endpoint not found' 
      }, { status: 404, headers: corsHeaders });

    } catch (error) {
      console.error('[Layer 3] Error:', error);
      return jsonResponse({ 
        success: false, 
        error: 'Internal server error' 
      }, { status: 500, headers: corsHeaders });
    }
  }
};

// Orders API Handler
async function handleOrders(request: Request, env: Env, corsHeaders: Record<string, string>, user: AuthenticatedUser): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/admin/orders', '');
  
  try {
    if (request.method === 'GET') {
      if (path === '/stats') {
        const stats = await getOrderStats(env);
        return jsonResponse({ success: true, data: stats }, { status: 200, headers: corsHeaders });
      }
      
      if (path.startsWith('/')) {
        const orderId = path.substring(1);
        if (orderId) {
          const order = await getOrder(env, orderId);
          return jsonResponse({ success: true, data: order }, { status: 200, headers: corsHeaders });
        }
      }
      
      // Get all orders with pagination
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const status = url.searchParams.get('status');
      const search = url.searchParams.get('search');
      
      const orders = await getOrders(env, { page, limit, status, search });
      return jsonResponse({ success: true, orders }, { status: 200, headers: corsHeaders });
    }
    
    if (request.method === 'PUT' && path.startsWith('/')) {
      const orderId = path.substring(1);
      const body = await request.json();
      const result = await updateOrder(env, orderId, body);
      return jsonResponse({ success: true, data: result }, { status: 200, headers: corsHeaders });
    }
    
    if (request.method === 'POST') {
      const body = await request.json();
      const result = await createOrder(env, body);
      return jsonResponse({ success: true, data: result }, { status: 201, headers: corsHeaders });
    }

    return jsonResponse({ success: false, error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
  } catch (error) {
    console.error('[Orders] Error:', error);
    return jsonResponse({ success: false, error: 'Orders operation failed' }, { status: 500, headers: corsHeaders });
  }
}

// Products API Handler
async function handleProducts(request: Request, env: Env, corsHeaders: Record<string, string>, user: AuthenticatedUser): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/admin/products', '');
  
  try {
    if (request.method === 'GET') {
      if (path.startsWith('/')) {
        const productId = path.substring(1);
        if (productId) {
          const product = await getProduct(env, productId);
          return jsonResponse({ success: true, data: product }, { status: 200, headers: corsHeaders });
        }
      }
      
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');
      
      const products = await getProducts(env, { page, limit, category, search });
      return jsonResponse({ success: true, products }, { status: 200, headers: corsHeaders });
    }
    
    if (request.method === 'POST') {
      const body = await request.json();
      const result = await createProduct(env, body);
      return jsonResponse({ success: true, data: result }, { status: 201, headers: corsHeaders });
    }
    
    if (request.method === 'PUT' && path.startsWith('/')) {
      const productId = path.substring(1);
      const body = await request.json();
      const result = await updateProduct(env, productId, body);
      return jsonResponse({ success: true, data: result }, { status: 200, headers: corsHeaders });
    }
    
    if (request.method === 'DELETE' && path.startsWith('/')) {
      const productId = path.substring(1);
      await deleteProduct(env, productId);
      return jsonResponse({ success: true, message: 'Product deleted' }, { status: 200, headers: corsHeaders });
    }

    return jsonResponse({ success: false, error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
  } catch (error) {
    console.error('[Products] Error:', error);
    return jsonResponse({ success: false, error: 'Products operation failed' }, { status: 500, headers: corsHeaders });
  }
}

// Customers API Handler
async function handleCustomers(request: Request, env: Env, corsHeaders: Record<string, string>, user: AuthenticatedUser): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/admin/customers', '');
  
  try {
    if (request.method === 'GET') {
      if (path.startsWith('/')) {
        const customerId = path.substring(1);
        if (customerId) {
          const customer = await getCustomer(env, customerId);
          return jsonResponse({ success: true, data: customer }, { status: 200, headers: corsHeaders });
        }
      }
      
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const search = url.searchParams.get('search');
      
      const customers = await getCustomers(env, { page, limit, search });
      return jsonResponse({ success: true, customers }, { status: 200, headers: corsHeaders });
    }

    return jsonResponse({ success: false, error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
  } catch (error) {
    console.error('[Customers] Error:', error);
    return jsonResponse({ success: false, error: 'Customers operation failed' }, { status: 500, headers: corsHeaders });
  }
}

// Dashboard API Handler
async function handleDashboard(request: Request, env: Env, corsHeaders: Record<string, string>, user: AuthenticatedUser): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/admin/dashboard', '');
  
  try {
    if (request.method === 'GET' && path === '/metrics') {
      const metrics = await getDashboardMetrics(env);
      return jsonResponse({ success: true, data: metrics }, { status: 200, headers: corsHeaders });
    }

    return jsonResponse({ success: false, error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
  } catch (error) {
    console.error('[Dashboard] Error:', error);
    return jsonResponse({ success: false, error: 'Dashboard operation failed' }, { status: 500, headers: corsHeaders });
  }
}

// Placeholder handlers for other endpoints
async function handleInventory(request: Request, env: Env, corsHeaders: Record<string, string>, user: AuthenticatedUser): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;

  try {
    // Handle /api/admin/inventory/stats endpoint
    if (url.pathname.includes('/stats')) {
      const stats = {
        totalItems: 3,
        totalValue: 4748.45,
        lowStockItems: 1,
        outOfStockItems: 1,
        categories: [
          { name: 'Electronics', count: 1, value: 4498.50 },
          { name: 'Accessories', count: 2, value: 249.95 }
        ],
        recentMovements: [
          {
            id: 1,
            type: 'stock_in',
            productName: 'Sample Product 1',
            quantity: 50,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            user: 'Admin'
          },
          {
            id: 2,
            type: 'stock_out',
            productName: 'Sample Product 2',
            quantity: 15,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            user: 'System'
          }
        ],
        summary: {
          inStock: 2,
          lowStock: 1,
          outOfStock: 1,
          totalProducts: 3,
          averageValue: 1582.82
        }
      };

      return jsonResponse({
        success: true,
        data: stats
      }, { status: 200, headers: corsHeaders });
    }

    // Handle main inventory endpoint
    if (method === 'GET') {
      const warehouseId = url.searchParams.get('warehouseId');

      const mockInventory = [
        {
          id: 1,
          productId: 'prod_001',
          productName: 'Sample Product 1',
          sku: 'SKU001',
          quantity: 150,
          lowStockThreshold: 20,
          unitPrice: 29.99,
          totalValue: 4498.50,
          warehouseId: warehouseId || 'warehouse_1',
          location: 'A-1-1',
          lastUpdated: new Date().toISOString(),
          status: 'in_stock'
        },
        {
          id: 2,
          productId: 'prod_002',
          productName: 'Sample Product 2',
          sku: 'SKU002',
          quantity: 5,
          lowStockThreshold: 10,
          unitPrice: 49.99,
          totalValue: 249.95,
          warehouseId: warehouseId || 'warehouse_1',
          location: 'A-1-2',
          lastUpdated: new Date().toISOString(),
          status: 'low_stock'
        },
        {
          id: 3,
          productId: 'prod_003',
          productName: 'Sample Product 3',
          sku: 'SKU003',
          quantity: 0,
          lowStockThreshold: 15,
          unitPrice: 19.99,
          totalValue: 0,
          warehouseId: warehouseId || 'warehouse_1',
          location: 'A-1-3',
          lastUpdated: new Date().toISOString(),
          status: 'out_of_stock'
        }
      ];

      const filteredInventory = warehouseId 
        ? mockInventory.filter(item => item.warehouseId === warehouseId)
        : mockInventory;

      return jsonResponse({
        success: true,
        data: filteredInventory,
        meta: {
          total: filteredInventory.length,
          inStock: filteredInventory.filter(item => item.status === 'in_stock').length,
          lowStock: filteredInventory.filter(item => item.status === 'low_stock').length,
          outOfStock: filteredInventory.filter(item => item.status === 'out_of_stock').length,
        }
      }, { status: 200, headers: corsHeaders });
    }

    return jsonResponse({ 
      success: false, 
      error: 'Method not allowed' 
    }, { status: 405, headers: corsHeaders });

  } catch (error) {
    console.error('Inventory handler error:', error);
    return jsonResponse({ 
      success: false, 
      error: 'Failed to process inventory request' 
    }, { status: 500, headers: corsHeaders });
  }
}

async function handleCollections(request: Request, env: Env, corsHeaders: Record<string, string>, user: AuthenticatedUser): Promise<Response> {
  return jsonResponse({ success: true, data: [], message: 'Collections API - Coming Soon' }, { status: 200, headers: corsHeaders });
}

async function handleCategories(request: Request, env: Env, corsHeaders: Record<string, string>, user: AuthenticatedUser): Promise<Response> {
  return jsonResponse({ success: true, data: [], message: 'Categories API - Coming Soon' }, { status: 200, headers: corsHeaders });
}

async function handleReturns(request: Request, env: Env, corsHeaders: Record<string, string>, user: AuthenticatedUser): Promise<Response> {
  return jsonResponse({ success: true, data: [], message: 'Returns API - Coming Soon' }, { status: 200, headers: corsHeaders });
}

// Database operations using Turso
async function executeQuery(env: Env, query: string, params: any[] = []): Promise<any> {
  const response = await fetch(`${env.TURSO_DATABASE_URL}/v1/batch`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [{ type: 'execute', stmt: { sql: query, args: params } }]
    })
  });

  if (!response.ok) {
    throw new Error(`Database query failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result[0]?.response || { rows: [] };
}

// Database functions
async function getOrders(env: Env, filters: any): Promise<any[]> {
  let query = 'SELECT * FROM orders WHERE 1=1';
  const params: any[] = [];
  
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  
  if (filters.search) {
    query += ' AND (id LIKE ? OR customer_email LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  query += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
  params.push(filters.limit, (filters.page - 1) * filters.limit);
  
  const result = await executeQuery(env, query, params);
  return result.rows || [];
}

async function getOrder(env: Env, orderId: string): Promise<any> {
  const result = await executeQuery(env, 'SELECT * FROM orders WHERE id = ?', [orderId]);
  return result.rows?.[0] || null;
}

async function updateOrder(env: Env, orderId: string, data: any): Promise<any> {
  const result = await executeQuery(env, 
    'UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', 
    [data.status, orderId]
  );
  return result;
}

async function createOrder(env: Env, orderData: any): Promise<any> {
  const result = await executeQuery(env, 
    'INSERT INTO orders (customer_email, total_amount, status, createdAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', 
    [orderData.customer_email, orderData.total_amount, orderData.status || 'pending']
  );
  return result;
}

async function getOrderStats(env: Env): Promise<any> {
  const result = await executeQuery(env, `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shipped,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
    FROM orders
  `);
  return result.rows?.[0] || { total: 0, pending: 0, shipped: 0, cancelled: 0 };
}

async function getProducts(env: Env, filters: any): Promise<any[]> {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];
  
  if (filters.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }
  
  if (filters.search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  query += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
  params.push(filters.limit, (filters.page - 1) * filters.limit);
  
  const result = await executeQuery(env, query, params);
  return result.rows || [];
}

async function getProduct(env: Env, productId: string): Promise<any> {
  const result = await executeQuery(env, 'SELECT * FROM products WHERE id = ?', [productId]);
  return result.rows?.[0] || null;
}

async function createProduct(env: Env, productData: any): Promise<any> {
  const result = await executeQuery(env, 
    'INSERT INTO products (name, description, price, category, createdAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)', 
    [productData.name, productData.description, productData.price, productData.category]
  );
  return result;
}

async function updateProduct(env: Env, productId: string, productData: any): Promise<any> {
  const result = await executeQuery(env, 
    'UPDATE products SET name = ?, description = ?, price = ?, category = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', 
    [productData.name, productData.description, productData.price, productData.category, productId]
  );
  return result;
}

async function deleteProduct(env: Env, productId: string): Promise<void> {
  await executeQuery(env, 'DELETE FROM products WHERE id = ?', [productId]);
}

async function getCustomers(env: Env, filters: any): Promise<any[]> {
  let query = 'SELECT * FROM customers WHERE 1=1';
  const params: any[] = [];
  
  if (filters.search) {
    query += ' AND (email LIKE ? OR name LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  query += ` ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
  params.push(filters.limit, (filters.page - 1) * filters.limit);
  
  const result = await executeQuery(env, query, params);
  return result.rows || [];
}

async function getCustomer(env: Env, customerId: string): Promise<any> {
  const result = await executeQuery(env, 'SELECT * FROM customers WHERE id = ?', [customerId]);
  return result.rows?.[0] || null;
}

async function getDashboardMetrics(env: Env): Promise<any> {
  const [ordersResult, customersResult, productsResult] = await Promise.all([
    executeQuery(env, 'SELECT COUNT(*) as count FROM orders'),
    executeQuery(env, 'SELECT COUNT(*) as count FROM customers'),
    executeQuery(env, 'SELECT COUNT(*) as count FROM products')
  ]);

  return {
    totalOrders: ordersResult.rows?.[0]?.count || 0,
    totalCustomers: customersResult.rows?.[0]?.count || 0,
    totalProducts: productsResult.rows?.[0]?.count || 0,
    timestamp: new Date().toISOString()
  };
}

function jsonResponse(data: any, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });
}
