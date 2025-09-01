/**
 * Enterprise Security Monitoring and Threat Detection
 * Real-time security event processing and anomaly detection
 */

import crypto from 'crypto';

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  tenantId: string;
  userId?: string;
  deviceId?: string;
  eventType: 'auth' | 'access' | 'data' | 'admin' | 'threat';
  action: string;
  details: Record<string, any>;
  riskScore: number;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    lat?: number;
    lon?: number;
  };
}

export interface ThreatDetectionRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  riskThreshold: number;
  timeWindow: number; // milliseconds
  conditions: Array<{
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'contains' | 'regex';
    value: any;
  }>;
  actions: Array<'log' | 'alert' | 'block' | 'revoke_token' | 'lock_account'>;
}

export class SecurityMonitor {
  private static instance: SecurityMonitor;
  private eventBuffer: SecurityEvent[] = [];
  private detectionRules: ThreatDetectionRule[] = [];
  private alertCallbacks: ((event: SecurityEvent, rule: ThreatDetectionRule) => void)[] = [];

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
      SecurityMonitor.instance.initializeDefaultRules();
    }
    return SecurityMonitor.instance;
  }

  /**
   * Log security event and run threat detection
   */
  async logSecurityEvent(event: Partial<SecurityEvent>): Promise<void> {
    const fullEvent: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      tenantId: event.tenantId || 'unknown',
      eventType: event.eventType || 'access',
      action: event.action || 'unknown',
      details: event.details || {},
      riskScore: event.riskScore || 0,
      ipAddress: event.ipAddress || 'unknown',
      userAgent: event.userAgent || 'unknown',
      ...event
    };

    // Add to buffer
    this.eventBuffer.push(fullEvent);

    // Keep buffer manageable (last 10000 events)
    if (this.eventBuffer.length > 10000) {
      this.eventBuffer = this.eventBuffer.slice(-10000);
    }

    // Run threat detection
    await this.runThreatDetection(fullEvent);

    // Log to external systems
    await this.streamToSIEM(fullEvent);
  }

  /**
   * Run threat detection rules against event
   */
  private async runThreatDetection(event: SecurityEvent): Promise<void> {
    for (const rule of this.detectionRules) {
      if (!rule.enabled) continue;

      try {
        const isMatch = await this.evaluateRule(rule, event);
        if (isMatch) {
          console.warn(`[THREAT DETECTED] Rule: ${rule.name}, Event: ${event.id}`);
          await this.executeRuleActions(rule, event);
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
    }
  }

  /**
   * Evaluate if event matches threat detection rule
   */
  private async evaluateRule(rule: ThreatDetectionRule, event: SecurityEvent): Promise<boolean> {
    // Check basic conditions
    for (const condition of rule.conditions) {
      const fieldValue = this.getNestedValue(event, condition.field);
      if (!this.evaluateCondition(fieldValue, condition.operator, condition.value)) {
        return false;
      }
    }

    // Check time-based conditions (e.g., multiple events in time window)
    if (rule.timeWindow > 0) {
      const recentEvents = this.getRecentEvents(event, rule.timeWindow);
      const matchingEvents = recentEvents.filter(e => 
        rule.conditions.every(condition => 
          this.evaluateCondition(this.getNestedValue(e, condition.field), condition.operator, condition.value)
        )
      );

      // If rule requires multiple events in time window
      if (matchingEvents.length < 2) {
        return false;
      }
    }

    return event.riskScore >= rule.riskThreshold;
  }

  /**
   * Execute actions when threat is detected
   */
  private async executeRuleActions(rule: ThreatDetectionRule, event: SecurityEvent): Promise<void> {
    for (const action of rule.actions) {
      switch (action) {
        case 'log':
          console.log(`[SECURITY] ${rule.name}: ${JSON.stringify(event)}`);
          break;
        case 'alert':
          this.alertCallbacks.forEach(callback => callback(event, rule));
          break;
        case 'block':
          // TODO: Add to block list
          console.log(`[SECURITY] Blocking IP: ${event.ipAddress}`);
          break;
        case 'revoke_token':
          if (event.userId) {
            // TODO: Revoke user tokens
            console.log(`[SECURITY] Revoking tokens for user: ${event.userId}`);
          }
          break;
        case 'lock_account':
          if (event.userId) {
            // TODO: Lock user account
            console.log(`[SECURITY] Locking account: ${event.userId}`);
          }
          break;
      }
    }
  }

  /**
   * Initialize default threat detection rules
   */
  private initializeDefaultRules(): void {
    this.detectionRules = [
      {
        id: 'multiple-failed-logins',
        name: 'Multiple Failed Login Attempts',
        description: 'Detects multiple failed login attempts from same IP',
        enabled: true,
        riskThreshold: 70,
        timeWindow: 5 * 60 * 1000, // 5 minutes
        conditions: [
          { field: 'eventType', operator: 'eq', value: 'auth' },
          { field: 'action', operator: 'eq', value: 'login_failed' }
        ],
        actions: ['log', 'alert', 'block']
      },
      {
        id: 'impossible-travel',
        name: 'Impossible Travel Detection',
        description: 'Same user/device in multiple geographic locations impossibly fast',
        enabled: true,
        riskThreshold: 90,
        timeWindow: 60 * 60 * 1000, // 1 hour
        conditions: [
          { field: 'eventType', operator: 'eq', value: 'auth' },
          { field: 'action', operator: 'eq', value: 'login_success' }
        ],
        actions: ['log', 'alert', 'revoke_token']
      },
      {
        id: 'admin-after-hours',
        name: 'Admin Access After Hours',
        description: 'Admin access outside business hours',
        enabled: true,
        riskThreshold: 60,
        timeWindow: 0,
        conditions: [
          { field: 'eventType', operator: 'eq', value: 'admin' }
        ],
        actions: ['log', 'alert']
      },
      {
        id: 'data-exfiltration',
        name: 'Potential Data Exfiltration',
        description: 'Large data access patterns',
        enabled: true,
        riskThreshold: 80,
        timeWindow: 10 * 60 * 1000, // 10 minutes
        conditions: [
          { field: 'eventType', operator: 'eq', value: 'data' },
          { field: 'details.recordCount', operator: 'gt', value: 1000 }
        ],
        actions: ['log', 'alert']
      }
    ];
  }

  /**
   * Stream events to SIEM/external logging
   */
  private async streamToSIEM(event: SecurityEvent): Promise<void> {
    // TODO: Implement streaming to external SIEM
    // Examples: Splunk, Datadog, Elastic, CloudWatch

    if (process.env.SECURITY_LOG_WEBHOOK) {
      try {
        await fetch(process.env.SECURITY_LOG_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        });
      } catch (error) {
        console.error('Failed to stream to SIEM:', error);
      }
    }

    // Log to console for development
    if (event.riskScore > 50) {
      console.log(`[SECURITY EVENT] ${event.eventType}:${event.action} - Risk: ${event.riskScore}`);
    }
  }

  // Helper methods
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private evaluateCondition(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'eq': return value === expected;
      case 'ne': return value !== expected;
      case 'gt': return Number(value) > Number(expected);
      case 'lt': return Number(value) < Number(expected);
      case 'contains': return String(value).includes(String(expected));
      case 'regex': return new RegExp(expected).test(String(value));
      default: return false;
    }
  }

  private getRecentEvents(event: SecurityEvent, timeWindow: number): SecurityEvent[] {
    const cutoff = event.timestamp.getTime() - timeWindow;
    return this.eventBuffer.filter(e => 
      e.timestamp.getTime() >= cutoff && 
      e.id !== event.id
    );
  }

  /**
   * Add alert callback
   */
  onThreatDetected(callback: (event: SecurityEvent, rule: ThreatDetectionRule) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Get security metrics
   */
  getSecurityMetrics(): {
    totalEvents: number;
    highRiskEvents: number;
    threatsDetected: number;
    topRiskSources: Array<{ ip: string; riskScore: number; count: number }>;
  } {
    const highRiskEvents = this.eventBuffer.filter(e => e.riskScore > 70);
    
    // Group by IP and calculate risk scores
    const ipRisks = this.eventBuffer.reduce((acc, event) => {
      if (!acc[event.ipAddress]) {
        acc[event.ipAddress] = { count: 0, totalRisk: 0 };
      }
      const ipData = acc[event.ipAddress];
      if (ipData) {
        ipData.count++;
        ipData.totalRisk += event.riskScore;
      }
      return acc;
    }, {} as Record<string, { count: number; totalRisk: number }>);

    const topRiskSources = Object.entries(ipRisks)
      .map(([ip, data]) => ({
        ip,
        riskScore: data.totalRisk / data.count,
        count: data.count
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    return {
      totalEvents: this.eventBuffer.length,
      highRiskEvents: highRiskEvents.length,
      threatsDetected: this.alertCallbacks.length, // Simplified metric
      topRiskSources
    };
  }
}

export const securityMonitor = SecurityMonitor.getInstance();
