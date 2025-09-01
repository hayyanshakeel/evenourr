/**
 * Enterprise Device Posture and Policy Enforcement
 * Integrates with Cloudflare Zero Trust for device compliance
 */

export interface DevicePosture {
  deviceId: string;
  platform: 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'unknown';
  osVersion: string;
  isJailbroken?: boolean;
  isRooted?: boolean;
  hasScreenLock: boolean;
  antivirusStatus: 'active' | 'inactive' | 'unknown';
  diskEncryption: boolean;
  lastScan?: Date;
  complianceScore: number; // 0-100
  trustedDevice: boolean;
  managementStatus: 'managed' | 'unmanaged' | 'byod';
  certificateStatus: 'valid' | 'expired' | 'missing';
}

export interface PosturePolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number; // 1-10, higher = more important
  requirements: {
    minOsVersion?: string;
    requireEncryption: boolean;
    requireAntivirus: boolean;
    requireScreenLock: boolean;
    blockJailbroken: boolean;
    requireManaged: boolean;
    minComplianceScore: number;
  };
  actions: {
    onCompliance: 'allow' | 'allow_limited' | 'monitor';
    onViolation: 'deny' | 'quarantine' | 'require_remediation' | 'monitor';
  };
  applicableRoles: string[];
  applicableTenants: string[];
}

export class DevicePostureManager {
  private static instance: DevicePostureManager;
  private policies: PosturePolicy[] = [];
  private postureCache: Map<string, { posture: DevicePosture; expires: number }> = new Map();

  static getInstance(): DevicePostureManager {
    if (!DevicePostureManager.instance) {
      DevicePostureManager.instance = new DevicePostureManager();
      DevicePostureManager.instance.initializeDefaultPolicies();
    }
    return DevicePostureManager.instance;
  }

  /**
   * Check device posture from various sources
   */
  async checkDevicePosture(
    deviceId: string, 
    userAgent?: string, 
    cfDevicePosture?: any
  ): Promise<DevicePosture> {
    // Check cache first
    const cached = this.postureCache.get(deviceId);
    if (cached && cached.expires > Date.now()) {
      return cached.posture;
    }

    const posture: DevicePosture = {
      deviceId,
      platform: this.detectPlatform(userAgent),
      osVersion: this.detectOsVersion(userAgent),
      hasScreenLock: false, // Default, would be populated by device check
      antivirusStatus: 'unknown',
      diskEncryption: false,
      complianceScore: 50, // Default neutral score
      trustedDevice: false,
      managementStatus: 'unmanaged',
      certificateStatus: 'missing'
    };

    // Integrate with Cloudflare Zero Trust device posture
    if (cfDevicePosture) {
      posture.hasScreenLock = cfDevicePosture.screenLock || false;
      posture.diskEncryption = cfDevicePosture.diskEncryption || false;
      posture.antivirusStatus = cfDevicePosture.antivirus?.status || 'unknown';
      posture.isJailbroken = cfDevicePosture.jailbroken;
      posture.isRooted = cfDevicePosture.rooted;
      posture.managementStatus = cfDevicePosture.managed ? 'managed' : 'unmanaged';
    }

    // Calculate compliance score
    posture.complianceScore = this.calculateComplianceScore(posture);

    // Cache for 5 minutes
    this.postureCache.set(deviceId, {
      posture,
      expires: Date.now() + 5 * 60 * 1000
    });

    return posture;
  }

  /**
   * Evaluate device against posture policies
   */
  async evaluateDeviceCompliance(
    posture: DevicePosture,
    userRole: string,
    tenantId: string
  ): Promise<{
    compliant: boolean;
    violations: string[];
    requiredActions: string[];
    allowedAccess: 'full' | 'limited' | 'denied';
    policy: PosturePolicy | null;
  }> {
    const applicablePolicies = this.policies
      .filter(p => p.enabled)
      .filter(p => p.applicableRoles.includes(userRole) || p.applicableRoles.includes('*'))
      .filter(p => p.applicableTenants.includes(tenantId) || p.applicableTenants.includes('*'))
      .sort((a, b) => b.priority - a.priority);

    if (applicablePolicies.length === 0) {
      return {
        compliant: true,
        violations: [],
        requiredActions: [],
        allowedAccess: 'full',
        policy: null
      };
    }

    // Use highest priority policy
    const policy = applicablePolicies[0];
    if (!policy) {
      return {
        compliant: true,
        violations: [],
        requiredActions: [],
        allowedAccess: 'full',
        policy: null
      };
    }
    
    const violations: string[] = [];
    const requiredActions: string[] = [];

    // Check compliance
    if (policy.requirements.requireEncryption && !posture.diskEncryption) {
      violations.push('Disk encryption required');
      requiredActions.push('Enable full disk encryption');
    }

    if (policy.requirements.requireAntivirus && posture.antivirusStatus !== 'active') {
      violations.push('Active antivirus required');
      requiredActions.push('Install and activate antivirus software');
    }

    if (policy.requirements.requireScreenLock && !posture.hasScreenLock) {
      violations.push('Screen lock required');
      requiredActions.push('Enable device screen lock/PIN');
    }

    if (policy.requirements.blockJailbroken && (posture.isJailbroken || posture.isRooted)) {
      violations.push('Jailbroken/rooted devices not allowed');
      requiredActions.push('Use a non-jailbroken/rooted device');
    }

    if (policy.requirements.requireManaged && posture.managementStatus !== 'managed') {
      violations.push('Device must be enterprise managed');
      requiredActions.push('Enroll device in enterprise management');
    }

    if (posture.complianceScore < policy.requirements.minComplianceScore) {
      violations.push(`Compliance score too low: ${posture.complianceScore}/${policy.requirements.minComplianceScore}`);
      requiredActions.push('Improve device security configuration');
    }

    if (policy.requirements.minOsVersion && 
        !this.checkMinOsVersion(posture.osVersion, policy.requirements.minOsVersion)) {
      violations.push('Operating system version too old');
      requiredActions.push('Update operating system');
    }

    const compliant = violations.length === 0;
    let allowedAccess: 'full' | 'limited' | 'denied';

    if (compliant) {
      allowedAccess = policy.actions.onCompliance === 'allow' ? 'full' : 'limited';
    } else {
      allowedAccess = policy.actions.onViolation === 'deny' ? 'denied' : 'limited';
    }

    return {
      compliant,
      violations,
      requiredActions,
      allowedAccess,
      policy
    };
  }

  /**
   * Initialize default enterprise posture policies
   */
  private initializeDefaultPolicies(): void {
    this.policies = [
      {
        id: 'admin-strict',
        name: 'Admin Strict Compliance',
        description: 'High security requirements for admin users',
        enabled: true,
        priority: 10,
        requirements: {
          requireEncryption: true,
          requireAntivirus: true,
          requireScreenLock: true,
          blockJailbroken: true,
          requireManaged: true,
          minComplianceScore: 85
        },
        actions: {
          onCompliance: 'allow',
          onViolation: 'deny'
        },
        applicableRoles: ['admin'],
        applicableTenants: ['*']
      },
      {
        id: 'user-standard',
        name: 'Standard User Compliance',
        description: 'Standard security requirements for regular users',
        enabled: true,
        priority: 5,
        requirements: {
          requireEncryption: true,
          requireAntivirus: false,
          requireScreenLock: true,
          blockJailbroken: true,
          requireManaged: false,
          minComplianceScore: 60
        },
        actions: {
          onCompliance: 'allow',
          onViolation: 'require_remediation'
        },
        applicableRoles: ['user'],
        applicableTenants: ['*']
      },
      {
        id: 'byod-limited',
        name: 'BYOD Limited Access',
        description: 'Minimal requirements for bring-your-own-device',
        enabled: true,
        priority: 1,
        requirements: {
          requireEncryption: false,
          requireAntivirus: false,
          requireScreenLock: true,
          blockJailbroken: true,
          requireManaged: false,
          minComplianceScore: 40
        },
        actions: {
          onCompliance: 'allow_limited',
          onViolation: 'quarantine'
        },
        applicableRoles: ['*'],
        applicableTenants: ['*']
      }
    ];
  }

  /**
   * Calculate overall compliance score based on posture
   */
  private calculateComplianceScore(posture: DevicePosture): number {
    let score = 0;
    let maxScore = 0;

    // Encryption (25 points)
    maxScore += 25;
    if (posture.diskEncryption) score += 25;

    // Screen lock (15 points)
    maxScore += 15;
    if (posture.hasScreenLock) score += 15;

    // Antivirus (20 points)
    maxScore += 20;
    if (posture.antivirusStatus === 'active') score += 20;
    else if (posture.antivirusStatus === 'inactive') score += 5;

    // Not jailbroken/rooted (20 points)
    maxScore += 20;
    if (!posture.isJailbroken && !posture.isRooted) score += 20;

    // Management status (15 points)
    maxScore += 15;
    if (posture.managementStatus === 'managed') score += 15;
    else if (posture.managementStatus === 'byod') score += 8;

    // Certificate status (5 points)
    maxScore += 5;
    if (posture.certificateStatus === 'valid') score += 5;

    return Math.round((score / maxScore) * 100);
  }

  // Helper methods
  private detectPlatform(userAgent?: string): DevicePosture['platform'] {
    if (!userAgent) return 'unknown';
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('windows')) return 'windows';
    if (ua.includes('macintosh') || ua.includes('mac os')) return 'macos';
    if (ua.includes('linux')) return 'linux';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
    if (ua.includes('android')) return 'android';
    
    return 'unknown';
  }

  private detectOsVersion(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    
    // Simple version extraction - would be more sophisticated in production
    const versionRegex = /(?:Windows NT|Mac OS X|Android|iPhone OS)\s+([\d._]+)/i;
    const match = userAgent.match(versionRegex);
    
    return match?.[1]?.replace(/_/g, '.') || 'unknown';
  }

  private checkMinOsVersion(current: string, required: string): boolean {
    if (current === 'unknown' || required === 'unknown') return false;
    
    const currentParts = current.split('.').map(Number);
    const requiredParts = required.split('.').map(Number);
    
    for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const requiredPart = requiredParts[i] || 0;
      
      if (currentPart > requiredPart) return true;
      if (currentPart < requiredPart) return false;
    }
    
    return true; // Equal versions
  }

  /**
   * Add custom posture policy
   */
  addPolicy(policy: PosturePolicy): void {
    this.policies.push(policy);
    this.policies.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get device posture summary
   */
  getPostureSummary(): {
    totalDevices: number;
    compliantDevices: number;
    avgComplianceScore: number;
    topViolations: Array<{ violation: string; count: number }>;
  } {
    const postureData = Array.from(this.postureCache.values()).map(cached => cached.posture);
    
    return {
      totalDevices: postureData.length,
      compliantDevices: postureData.filter(p => p.complianceScore >= 60).length,
      avgComplianceScore: postureData.reduce((sum, p) => sum + p.complianceScore, 0) / postureData.length || 0,
      topViolations: [] // Would calculate from actual violation tracking
    };
  }
}

export const devicePostureManager = DevicePostureManager.getInstance();
