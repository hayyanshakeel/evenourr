import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/enterprise-auth';

interface EnrollStartRequest {
  email: string;
  displayName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, displayName }: EnrollStartRequest = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate WebAuthn challenge
    const challenge = EnterpriseAuthService.generateChallenge();
    const challengeId = await EnterpriseAuthService.storeChallenge(
      email,
      challenge,
      'registration'
    );

    // WebAuthn PublicKeyCredentialCreationOptions
    const options = {
      challenge: challenge.toString('base64url'),
      rp: {
        name: 'JSevEnour Enterprise',
        id: process.env.WEBAUTHN_RP_ID || 'localhost',
      },
      user: {
        id: Buffer.from(email).toString('base64url'),
        name: email,
        displayName: displayName || email,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        residentKey: 'preferred',
      },
      attestation: 'direct',
      timeout: 60000,
      excludeCredentials: [],
      // Include challenge ID for finish endpoint
      extensions: {
        challengeId
      }
    };

    // Log enrollment start
    await EnterpriseAuthService.logAuditEvent({
      actorEmail: email,
      actorIp: request.headers.get('x-forwarded-for') || 'unknown',
      action: 'enrollment_started',
      resourceType: 'user',
      resourceId: email,
      success: true,
      details: { challengeId },
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      options,
      challengeId
    });

  } catch (error) {
    console.error('Enrollment start error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
