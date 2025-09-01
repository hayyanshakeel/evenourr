-- Enterprise Authentication Schema Migration
-- Creates tables for WebAuthn/FIDO2 enterprise authentication system
-- This replaces the EVR authentication system with production-ready enterprise auth

BEGIN;

-- Users table for enterprise authentication
CREATE TABLE IF NOT EXISTS auth_users (
  id TEXT PRIMARY KEY,        -- UUID v4
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  tenant_id TEXT,             -- for multi-tenant setups
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- WebAuthn devices (authenticators)
CREATE TABLE IF NOT EXISTS auth_devices (
  id TEXT PRIMARY KEY,        -- UUID
  user_email TEXT NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'platform', -- platform | roaming | server | service
  public_key BLOB NOT NULL,   -- COSE/CBOR public key from WebAuthn
  pubkey_algo TEXT NOT NULL,  -- ES256, RS256, etc.
  aaguid TEXT,                -- Authenticator AAGUID
  transports TEXT,            -- USB, NFC, BLE, internal
  attestation JSON,           -- attestation metadata
  counter INTEGER DEFAULT 0, -- signature counter for replay protection
  last_used DATETIME,
  status TEXT DEFAULT 'enrolled', -- enrolled | revoked | compromised
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES auth_users(email)
);

-- Authentication sessions with token binding
CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,         -- UUID
  user_email TEXT NOT NULL,
  device_id TEXT NOT NULL,
  tenant_id TEXT,
  access_token_hash TEXT NOT NULL,  -- SHA256 of the access token
  access_token_kid TEXT NOT NULL,   -- signing key identifier
  access_token_expires_at DATETIME NOT NULL,
  refresh_token_hash TEXT,          -- SHA256 of refresh token (rotated)
  refresh_token_expires_at DATETIME,
  token_bound_key_hash TEXT,        -- hash of device public key for token binding
  client_ip TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT 0,
  metadata JSON,
  FOREIGN KEY (user_email) REFERENCES auth_users(email),
  FOREIGN KEY (device_id) REFERENCES auth_devices(id)
);

-- WebAuthn challenges (temporary storage for enrollment/authentication)
CREATE TABLE IF NOT EXISTS auth_webauthn_challenges (
  id TEXT PRIMARY KEY,         -- UUID
  user_email TEXT NOT NULL,
  challenge BLOB NOT NULL,     -- random bytes challenge
  challenge_type TEXT NOT NULL, -- enrollment | authentication
  expires_at DATETIME NOT NULL,
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Revoked tokens for immediate revocation
CREATE TABLE IF NOT EXISTS auth_revoked_tokens (
  token_hash TEXT PRIMARY KEY, -- SHA256 of revoked token
  revoked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reason TEXT,
  revoked_by TEXT              -- admin/user who revoked it
);

-- Audit log for security events and compliance
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  actor_email TEXT,
  actor_device TEXT,
  actor_ip TEXT,
  action TEXT NOT NULL,        -- enrollment, login, token_refresh, revocation, etc.
  resource_type TEXT,          -- user, device, session, token
  resource_id TEXT,
  success BOOLEAN NOT NULL,
  error_code TEXT,
  details JSON,                -- additional context
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_auth_devices_user_email ON auth_devices(user_email);
CREATE INDEX IF NOT EXISTS idx_auth_devices_status ON auth_devices(status);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_email ON auth_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_device_id ON auth_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_access_token_hash ON auth_sessions(access_token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_revoked ON auth_sessions(revoked);
CREATE INDEX IF NOT EXISTS idx_auth_webauthn_challenges_user_email ON auth_webauthn_challenges(user_email);
CREATE INDEX IF NOT EXISTS idx_auth_webauthn_challenges_expires_at ON auth_webauthn_challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_revoked_tokens_revoked_at ON auth_revoked_tokens(revoked_at);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_actor_email ON auth_audit_log(actor_email);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_action ON auth_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_timestamp ON auth_audit_log(timestamp);

COMMIT;
