/**
 * Admin Authentication Service
 * Supports both password-based and WebAuthn authentication for admin users
 * Integrated with enterprise security monitoring and device posture
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { enterpriseKeyManager } from './enterprise-key-management';
import { securityMonitor } from './enterprise-security-monitoring';
import { devicePostureManager } from './enterprise-device-posture';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminSession {
  id: string;
  username: string;
  email: string;
  role: 'admin';
  loginMethod: 'password' | 'webauthn';
  expiresAt: Date;
  createdAt: Date;
}

export class AdminAuthService {
  private static instance: AdminAuthService;
  private adminCredentials: Map<string, string> = new Map();

  private constructor() {
    this.initializeAdminCredentials();
  }

  static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  private initializeAdminCredentials() {
    // Load admin credentials from environment
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123!Secure';
    const adminEmail = process.env.ADMIN_EMAILS?.split(',')[0] || 'evenour.in@gmail.com';
    
    // Hash the password for secure storage
    const hashedPassword = bcrypt.hashSync(adminPassword, 12);
    this.adminCredentials.set(adminUsername, hashedPassword);
    this.adminCredentials.set('email', adminEmail);
  }

  /**
   * Authenticate admin with username and password
   */
  async authenticateWithPassword(username: string, password: string, request?: NextRequest): Promise<{ success: boolean; token?: string; error?: string }> {
    const clientIp = request?.headers.get('x-forwarded-for') || 
                     request?.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request?.headers.get('user-agent') || 'unknown';

    try {
      // Log authentication attempt
      await securityMonitor.logSecurityEvent({
        eventType: 'auth',
        action: 'login_attempt',
        details: { username, method: 'password' },
        riskScore: 20, // Base risk for password auth
        ipAddress: clientIp,
        userAgent
      });

      // Check if username exists
      const hashedPassword = this.adminCredentials.get(username);
      if (!hashedPassword) {
        await securityMonitor.logSecurityEvent({
          eventType: 'auth',
          action: 'login_failed',
          details: { username, reason: 'invalid_username' },
          riskScore: 60,
          ipAddress: clientIp,
          userAgent
        });
        return { success: false, error: 'Invalid credentials' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, hashedPassword);
      if (!isValidPassword) {
        await securityMonitor.logSecurityEvent({
          eventType: 'auth',
          action: 'login_failed',
          details: { username, reason: 'invalid_password' },
          riskScore: 70,
          ipAddress: clientIp,
          userAgent
        });
        return { success: false, error: 'Invalid credentials' };
      }

      // Check device posture if request available
      if (request) {
        const devicePosture = await devicePostureManager.checkDevicePosture(
          `admin-${username}-${clientIp}`,
          userAgent
        );

        const complianceResult = await devicePostureManager.evaluateDeviceCompliance(
          devicePosture,
          'admin',
          'evenour-main'
        );

        if (complianceResult.allowedAccess === 'denied') {
          await securityMonitor.logSecurityEvent({
            eventType: 'auth',
            action: 'login_failed',
            details: { 
              username, 
              reason: 'device_non_compliant',
              violations: complianceResult.violations 
            },
            riskScore: 90,
            ipAddress: clientIp,
            userAgent
          });
          return { 
            success: false, 
            error: `Device not compliant: ${complianceResult.violations.join(', ')}` 
          };
        }
      }

      // Create admin session
      const adminEmail = this.adminCredentials.get('email') || 'evenour.in@gmail.com';
      const sessionId = crypto.randomUUID();
      
      const token = await this.createAdminToken({
        id: sessionId,
        username,
        email: adminEmail,
        role: 'admin',
        loginMethod: 'password',
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
        createdAt: new Date()
      });

      // Log successful authentication
      await securityMonitor.logSecurityEvent({
        eventType: 'auth',
        action: 'login_success',
        details: { username, method: 'password' },
        riskScore: 10, // Low risk for successful auth
        ipAddress: clientIp,
        userAgent
      });

      return { success: true, token };
    } catch (error) {
      console.error('Admin password authentication error:', error);
      
      await securityMonitor.logSecurityEvent({
        eventType: 'auth',
        action: 'login_error',
        details: { username, error: error instanceof Error ? error.message : 'Unknown error' },
        riskScore: 50,
        ipAddress: clientIp,
        userAgent
      });

      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Create JWT token for admin session using enterprise key management
   */
  private async createAdminToken(session: AdminSession): Promise<string> {
    const payload = {
      sub: session.id,
      username: session.username,
      email: session.email,
      role: session.role,
      loginMethod: session.loginMethod,
      exp: Math.floor(session.expiresAt.getTime() / 1000),
      iat: Math.floor(session.createdAt.getTime() / 1000),
      aud: 'admin-panel',
      iss: 'evenour-auth'
    };

    // Use enterprise key management for signing
    try {
      return await enterpriseKeyManager.signJWT(payload);
    } catch (error) {
      console.error('Enterprise key manager not available, falling back to basic JWT');
      // Fallback to basic JWT if enterprise key management fails
      const JWT_SECRET = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
      );
      return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(JWT_SECRET);
    }
  }

  /**
   * Verify admin token from request
   */
  async verifyAdminToken(request: NextRequest): Promise<{ valid: boolean; session?: AdminSession; error?: string }> {
    try {
      // Extract token from Authorization header or cookie
      let token = request.headers.get('authorization')?.replace('Bearer ', '');
      
      if (!token) {
        // Try to get token from cookie
        token = request.cookies.get('admin-token')?.value;
      }

      if (!token) {
        return { valid: false, error: 'No token provided' };
      }

      // Verify JWT token
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return { valid: false, error: 'Token expired' };
      }

      // Check if it's an admin token
      if (payload.role !== 'admin') {
        return { valid: false, error: 'Not an admin token' };
      }

      const session: AdminSession = {
        id: payload.sub as string,
        username: payload.username as string,
        email: payload.email as string,
        role: payload.role as 'admin',
        loginMethod: payload.loginMethod as 'password' | 'webauthn',
        expiresAt: new Date((payload.exp as number) * 1000),
        createdAt: new Date((payload.iat as number) * 1000)
      };

      return { valid: true, session };
    } catch (error) {
      console.error('Admin token verification error:', error);
      return { valid: false, error: 'Invalid token' };
    }
  }

  /**
   * Check if email is an admin email
   */
  isAdminEmail(email: string): boolean {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    return adminEmails.includes(email);
  }

  /**
   * Get admin credentials (for reference only - don't expose password)
   */
  getAdminInfo(): { username: string; email: string } {
    return {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: this.adminCredentials.get('email') || 'evenour.in@gmail.com'
    };
  }
}

export const adminAuth = AdminAuthService.getInstance();
