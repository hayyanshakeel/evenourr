import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/enterprise-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthFinishRequest {
  challengeId: string;
  credential: {
    id: string;
    rawId: string;
    response: {
      authenticatorData: string;
      clientDataJSON: string;
      signature: string;
    };
    type: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { challengeId, credential }: AuthFinishRequest = await request.json();

    if (!challengeId || !credential) {
      return NextResponse.json(
        { error: 'Challenge ID and credential are required' },
        { status: 400 }
      );
    }

    // Retrieve and consume challenge
    const challengeData = await EnterpriseAuthService.consumeChallenge(challengeId);
    if (!challengeData || challengeData.challengeType !== 'authentication') {
      return NextResponse.json(
        { error: 'Invalid or expired challenge' },
        { status: 400 }
      );
    }

    const { challenge, userEmail } = challengeData;

    // Find the device that matches the credential ID
    const devices = await EnterpriseAuthService.getUserDevices(userEmail);
    const device = devices.find(d => d.id === credential.id);

    if (!device) {
      await EnterpriseAuthService.logAuditEvent({
        actorEmail: userEmail,
        actorIp: request.headers.get('x-forwarded-for') || 'unknown',
        action: 'authentication_failed',
        resourceType: 'user',
        resourceId: userEmail,
        success: false,
        errorCode: 'DEVICE_NOT_FOUND',
        details: { challengeId, credentialId: credential.id },
        userAgent: request.headers.get('user-agent') || 'unknown'
      });

      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    // Decode WebAuthn response
    const authenticatorData = Buffer.from(credential.response.authenticatorData, 'base64url');
    const clientDataJSON = Buffer.from(credential.response.clientDataJSON, 'base64url');
    const signature = Buffer.from(credential.response.signature, 'base64url');

    // Verify assertion
    const origin = process.env.WEBAUTHN_ORIGIN || `https://${request.headers.get('host')}`;
    const verification = await EnterpriseAuthService.verifyAssertion(
      authenticatorData,
      clientDataJSON,
      signature,
      challenge,
      origin,
      device.publicKey,
      device.counter
    );

    if (!verification.verified) {
      await EnterpriseAuthService.logAuditEvent({
        actorEmail: userEmail,
        actorDevice: device.id,
        actorIp: request.headers.get('x-forwarded-for') || 'unknown',
        action: 'authentication_failed',
        resourceType: 'device',
        resourceId: device.id,
        success: false,
        errorCode: 'ASSERTION_VERIFICATION_FAILED',
        details: { challengeId },
        userAgent: request.headers.get('user-agent') || 'unknown'
      });

      return NextResponse.json(
        { error: 'Credential verification failed' },
        { status: 400 }
      );
    }

    // Update device counter and last seen
    if (verification.counter !== undefined) {
      await prisma.$executeRaw`
        UPDATE auth_devices 
        SET counter = ${verification.counter}, last_seen = ${new Date()}
        WHERE id = ${device.id}
      `;
    }

    // Generate tokens
    const tokens = await EnterpriseAuthService.generateTokens(
      userEmail,
      device.id,
      {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    );

    // Log successful authentication
    await EnterpriseAuthService.logAuditEvent({
      actorEmail: userEmail,
      actorDevice: device.id,
      actorIp: request.headers.get('x-forwarded-for') || 'unknown',
      action: 'authentication_succeeded',
      resourceType: 'session',
      resourceId: tokens.sessionId,
      success: true,
      details: { 
        deviceId: device.id, 
        sessionId: tokens.sessionId,
        counter: verification.counter 
      },
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
      user: {
        email: userEmail,
        id: userEmail, // Use email as ID for simplicity
        emailVerified: true
      },
      device: {
        id: device.id,
        type: device.deviceType,
        lastSeen: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Authentication finish error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
