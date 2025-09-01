-- Enterprise Auth Schema Addition
-- 2025_09_01_add_enterprise_auth_tables.sql
-- This migration adds enterprise auth tables to existing schema
BEGIN;

-- Device registry for WebAuthn and mTLS clients
CREATE TABLE IF NOT EXISTS auth_devices (
  id TEXT PRIMARY KEY,        -- UUID
  user_email TEXT NOT NULL,   -- reference to User.email
  device_type TEXT NOT NULL,  -- platform | roaming | server | service
  public_key BLOB NOT NULL,   -- COSE/CBOR / PEM or raw bytes (WebAuthn pubKey)
  pubkey_algo TEXT NOT NULL,  -- ES256, EdDSA, RS256
  aaguid TEXT,               -- WebAuthn authenticator AAGUID
  transports TEXT,           -- WebAuthn transports (usb,nfc,ble,internal)
  attestation JSON,          -- attestation metadata
  counter INTEGER DEFAULT 0, -- WebAuthn signature counter
  last_seen DATETIME,
  status TEXT DEFAULT 'enrolled', -- enrolled | revoked | compromised
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Session management with token binding
CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,         -- UUID
  user_email TEXT NOT NULL,    -- reference to User.email
  device_id TEXT REFERENCES auth_devices(id) ON DELETE CASCADE,
  access_token_hash TEXT NOT NULL,      -- SHA256 of the token
  access_token_kid TEXT NOT NULL,       -- signing key id
  access_token_expires_at DATETIME NOT NULL,
  refresh_token_hash TEXT,              -- rotated server-side
  refresh_token_expires_at DATETIME,
  token_bound_key_hash TEXT,            -- hash of device public key or cert thumbprint
  client_ip TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT 0,
  revocation_reason TEXT,
  metadata JSON
);

-- Token revocation list
CREATE TABLE IF NOT EXISTS auth_revoked_tokens (
  token_hash TEXT PRIMARY KEY,
  session_id TEXT REFERENCES auth_sessions(id),
  revoked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reason TEXT NOT NULL,
  revoked_by TEXT              -- admin user email who revoked
);

-- WebAuthn challenges (temporary storage)
CREATE TABLE IF NOT EXISTS auth_webauthn_challenges (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  challenge BLOB NOT NULL,     -- raw challenge bytes
  challenge_type TEXT NOT NULL, -- registration | authentication
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Key management for rotation
CREATE TABLE IF NOT EXISTS auth_signing_keys (
  kid TEXT PRIMARY KEY,       -- key identifier
  algorithm TEXT NOT NULL,    -- ES256, EdDSA, RS256
  public_key BLOB NOT NULL,   -- public key for verification
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  status TEXT DEFAULT 'active', -- active | rotating | revoked
  metadata JSON
);

-- Enhanced audit log
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts DATETIME DEFAULT CURRENT_TIMESTAMP,
  actor_email TEXT,           -- user email
  actor_device TEXT,          -- device.id
  actor_ip TEXT,
  action TEXT NOT NULL,       -- login | logout | enroll | revoke | admin_action
  resource_type TEXT,         -- user | device | session | token
  resource_id TEXT,
  success BOOLEAN,
  error_code TEXT,
  details JSON,               -- structured action-specific data
  user_agent TEXT
);

-- Device posture and compliance
CREATE TABLE IF NOT EXISTS auth_device_posture (
  device_id TEXT REFERENCES auth_devices(id) ON DELETE CASCADE PRIMARY KEY,
  posture_score INTEGER DEFAULT 100,  -- 0-100 compliance score
  last_check DATETIME,
  compliance_data JSON,               -- OS version, encryption status, etc.
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_devices_user ON auth_devices(user_email);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_device ON auth_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(access_token_expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_revoked_tokens ON auth_revoked_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_actor ON auth_audit_log(actor_email);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_ts ON auth_audit_log(ts);
CREATE INDEX IF NOT EXISTS idx_auth_webauthn_challenges_expires ON auth_webauthn_challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_signing_keys_status ON auth_signing_keys(status);

-- Insert initial signing key (this would be replaced by proper key management)
INSERT OR IGNORE INTO auth_signing_keys (kid, algorithm, public_key, metadata) VALUES 
('default-2025-09-01', 'ES256', '', '{"description": "Initial signing key", "generated": "2025-09-01"}');

COMMIT;
