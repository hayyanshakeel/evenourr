import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/enterprise-auth';

interface EnrollFinishRequest {
  challengeId: string;
  credential: {
    id: string;
    rawId: string;
    response: {
      attestationObject: string;
      clientDataJSON: string;
    };
    type: string;
    clientExtensionResults?: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { challengeId, credential }: EnrollFinishRequest = await request.json();

    if (!challengeId || !credential) {
      return NextResponse.json(
        { error: 'Challenge ID and credential are required' },
        { status: 400 }
      );
    }

    // Retrieve and consume challenge
    const challengeData = await EnterpriseAuthService.consumeChallenge(challengeId);
    if (!challengeData || challengeData.challengeType !== 'registration') {
      return NextResponse.json(
        { error: 'Invalid or expired challenge' },
        { status: 400 }
      );
    }

    const { challenge, userEmail } = challengeData;

    // Decode WebAuthn response
    const attestationObject = Buffer.from(credential.response.attestationObject, 'base64url');
    const clientDataJSON = Buffer.from(credential.response.clientDataJSON, 'base64url');

    // Verify attestation
    const origin = process.env.WEBAUTHN_ORIGIN || `https://${request.headers.get('host')}`;
    const verification = await EnterpriseAuthService.verifyAttestation(
      attestationObject,
      clientDataJSON,
      challenge,
      origin
    );

    if (!verification.verified || !verification.publicKey) {
      await EnterpriseAuthService.logAuditEvent({
        actorEmail: userEmail,
        actorIp: request.headers.get('x-forwarded-for') || 'unknown',
        action: 'enrollment_failed',
        resourceType: 'user',
        resourceId: userEmail,
        success: false,
        errorCode: 'ATTESTATION_VERIFICATION_FAILED',
        details: { challengeId },
        userAgent: request.headers.get('user-agent') || 'unknown'
      });

      return NextResponse.json(
        { error: 'Credential verification failed' },
        { status: 400 }
      );
    }

    // Register the device
    const device = await EnterpriseAuthService.registerDevice(
      userEmail,
      'platform', // Assume platform authenticator for now
      verification.publicKey,
      'ES256', // Default to ES256
      verification.aaguid,
      'internal', // Platform authenticator transport
      {
        credentialId: credential.id,
        rawId: credential.rawId,
        attestationObject: credential.response.attestationObject
      }
    );

    // Generate initial tokens
    const tokens = await EnterpriseAuthService.generateTokens(
      userEmail,
      device.id,
      {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    );

    // Log successful enrollment
    await EnterpriseAuthService.logAuditEvent({
      actorEmail: userEmail,
      actorDevice: device.id,
      actorIp: request.headers.get('x-forwarded-for') || 'unknown',
      action: 'enrollment_completed',
      resourceType: 'device',
      resourceId: device.id,
      success: true,
      details: { deviceId: device.id, pubkeyAlgo: 'ES256' },
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      device: {
        id: device.id,
        type: device.deviceType,
        status: device.status
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
      user: {
        email: userEmail,
        id: userEmail, // Use email as ID for simplicity
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Enrollment finish error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
