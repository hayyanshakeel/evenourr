/**
 * WebAuthn Client Helper
 * Simplified WebAuthn operations for browser clients
 */

interface WebAuthnCredential {
  id: string;
  rawId: string;
  response: {
    attestationObject?: string;
    clientDataJSON: string;
    authenticatorData?: string;
    signature?: string;
  };
  type: string;
}

export class WebAuthnClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if WebAuthn is supported in this browser
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 
           'navigator' in window && 
           'credentials' in navigator &&
           typeof navigator.credentials.create === 'function' &&
           typeof navigator.credentials.get === 'function';
  }

  /**
   * Convert base64url string to Uint8Array
   */
  private base64urlToUint8Array(base64url: string): Uint8Array {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Convert Uint8Array to base64url string
   */
  private uint8ArrayToBase64url(bytes: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...bytes));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Convert PublicKeyCredential to JSON format
   */
  private credentialToJSON(credential: PublicKeyCredential): WebAuthnCredential {
    const response = credential.response;
    
    if (response instanceof AuthenticatorAttestationResponse) {
      return {
        id: credential.id,
        rawId: this.uint8ArrayToBase64url(new Uint8Array(credential.rawId)),
        response: {
          attestationObject: this.uint8ArrayToBase64url(new Uint8Array(response.attestationObject)),
          clientDataJSON: this.uint8ArrayToBase64url(new Uint8Array(response.clientDataJSON))
        },
        type: credential.type
      };
    } else if (response instanceof AuthenticatorAssertionResponse) {
      return {
        id: credential.id,
        rawId: this.uint8ArrayToBase64url(new Uint8Array(credential.rawId)),
        response: {
          authenticatorData: this.uint8ArrayToBase64url(new Uint8Array(response.authenticatorData)),
          clientDataJSON: this.uint8ArrayToBase64url(new Uint8Array(response.clientDataJSON)),
          signature: this.uint8ArrayToBase64url(new Uint8Array(response.signature))
        },
        type: credential.type
      };
    }

    throw new Error('Unknown response type');
  }

  /**
   * Start WebAuthn enrollment
   */
  async startEnrollment(email: string, displayName?: string): Promise<{
    success: boolean;
    challengeId?: string;
    options?: PublicKeyCredentialCreationOptions;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/enroll/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName })
      });

      const data = await response.json();
      
      if (!data.success) {
        return { success: false, error: data.error };
      }

      // Convert base64url challenge to Uint8Array
      const options = {
        ...data.options,
        challenge: this.base64urlToUint8Array(data.options.challenge),
        user: {
          ...data.options.user,
          id: this.base64urlToUint8Array(data.options.user.id)
        }
      };

      return {
        success: true,
        challengeId: data.challengeId,
        options
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  /**
   * Complete WebAuthn enrollment
   */
  async completeEnrollment(challengeId: string, credential: PublicKeyCredential): Promise<{
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
    user?: any;
    error?: string;
  }> {
    try {
      const credentialJSON = this.credentialToJSON(credential);

      const response = await fetch(`${this.baseUrl}/api/auth/enroll/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          credential: credentialJSON
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  /**
   * Start WebAuthn authentication
   */
  async startAuthentication(email: string): Promise<{
    success: boolean;
    challengeId?: string;
    options?: PublicKeyCredentialRequestOptions;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/authenticate/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!data.success) {
        return { success: false, error: data.error };
      }

      // Convert base64url values to Uint8Array
      const options = {
        ...data.options,
        challenge: this.base64urlToUint8Array(data.options.challenge),
        allowCredentials: data.options.allowCredentials?.map((cred: any) => ({
          ...cred,
          id: this.base64urlToUint8Array(cred.id)
        }))
      };

      return {
        success: true,
        challengeId: data.challengeId,
        options
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  /**
   * Complete WebAuthn authentication
   */
  async completeAuthentication(challengeId: string, credential: PublicKeyCredential): Promise<{
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
    user?: any;
    device?: any;
    error?: string;
  }> {
    try {
      const credentialJSON = this.credentialToJSON(credential);

      const response = await fetch(`${this.baseUrl}/api/auth/authenticate/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          credential: credentialJSON
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  /**
   * Full WebAuthn enrollment flow
   */
  async enroll(email: string, displayName?: string): Promise<{
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
    user?: any;
    error?: string;
  }> {
    if (!WebAuthnClient.isSupported()) {
      return { success: false, error: 'WebAuthn is not supported in this browser' };
    }

    try {
      // Start enrollment
      const startResult = await this.startEnrollment(email, displayName);
      if (!startResult.success || !startResult.options || !startResult.challengeId) {
        return { success: false, error: startResult.error };
      }

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: startResult.options
      }) as PublicKeyCredential;

      if (!credential) {
        return { success: false, error: 'Failed to create credential' };
      }

      // Complete enrollment
      return await this.completeEnrollment(startResult.challengeId, credential);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'WebAuthn enrollment failed' 
      };
    }
  }

  /**
   * Full WebAuthn authentication flow
   */
  async authenticate(email: string): Promise<{
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
    user?: any;
    device?: any;
    error?: string;
  }> {
    if (!WebAuthnClient.isSupported()) {
      return { success: false, error: 'WebAuthn is not supported in this browser' };
    }

    try {
      // Start authentication
      const startResult = await this.startAuthentication(email);
      if (!startResult.success || !startResult.options || !startResult.challengeId) {
        return { success: false, error: startResult.error };
      }

      // Get credential
      const credential = await navigator.credentials.get({
        publicKey: startResult.options
      }) as PublicKeyCredential;

      if (!credential) {
        return { success: false, error: 'Failed to get credential' };
      }

      // Complete authentication
      return await this.completeAuthentication(startResult.challengeId, credential);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'WebAuthn authentication failed' 
      };
    }
  }
}
