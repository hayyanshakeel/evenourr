import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/enterprise-auth';

interface AuthStartRequest {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email }: AuthStartRequest = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get user's registered devices
    const devices = await EnterpriseAuthService.getUserDevices(email);
    
    if (devices.length === 0) {
      return NextResponse.json(
        { error: 'No registered devices found. Please enroll a device first.' },
        { status: 404 }
      );
    }

    // Generate WebAuthn challenge
    const challenge = EnterpriseAuthService.generateChallenge();
    const challengeId = await EnterpriseAuthService.storeChallenge(
      email,
      challenge,
      'authentication'
    );

    // Create allowCredentials list from registered devices
    const allowCredentials = devices.map(device => ({
      id: device.id,
      type: 'public-key' as const,
      transports: device.transports ? device.transports.split(',') : ['internal']
    }));

    // WebAuthn PublicKeyCredentialRequestOptions
    const options = {
      challenge: challenge.toString('base64url'),
      timeout: 60000,
      rpId: process.env.WEBAUTHN_RP_ID || 'localhost',
      allowCredentials,
      userVerification: 'preferred',
      extensions: {
        challengeId
      }
    };

    // Log authentication start
    await EnterpriseAuthService.logAuditEvent({
      actorEmail: email,
      actorIp: request.headers.get('x-forwarded-for') || 'unknown',
      action: 'authentication_started',
      resourceType: 'user',
      resourceId: email,
      success: true,
      details: { challengeId, deviceCount: devices.length },
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      options,
      challengeId
    });

  } catch (error) {
    console.error('Authentication start error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
