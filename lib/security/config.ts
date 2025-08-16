// Enterprise Security Configuration
export const SECURITY_CONFIG = {
  // Authentication
  AUTH: {
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    JWT_EXPIRES_IN: '24h',
    BCRYPT_ROUNDS: 12,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes
  },

  // Rate Limiting (requests per minute)
  RATE_LIMITS: {
    GLOBAL: 120,        // Increased from 100
    AUTH: 5,
    API_WRITE: 50,      // Increased from 30 for admin operations
    API_READ: 100,      // Increased from 60
    UPLOAD: 10,
  },

  // Input Validation
  VALIDATION: {
    MAX_STRING_LENGTH: 1000,
    MAX_TEXT_LENGTH: 10000,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MIN_PASSWORD_LENGTH: 8,
  },

  // CORS
  CORS: {
    ALLOWED_ORIGINS: [
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'https://evenour.com',
      'https://www.evenour.com',
    ],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-API-Key',
      'X-CSRF-Token',
    ],
  },

  // Security Headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://apis.google.com https://www.gstatic.com https://securetoken.googleapis.com https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; font-src 'self' data:; connect-src 'self' http://localhost:3000 http://localhost:3001 https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://apis.google.com https://accounts.google.com https://www.googleapis.com;",
  },

  // Admin Routes Protection
  ADMIN_ROUTES: [
    '/api/products',
    '/api/collections',
    '/api/orders',
    '/api/customers',
    '/api/settings',
    '/api/dashboard',
    '/api/coupons',
  ],

  // Public Routes (no authentication required)
  PUBLIC_ROUTES: [
    '/api/auth',
    '/api/cart',
    '/api/products/public',
    '/api/collections/public',
  ],
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
