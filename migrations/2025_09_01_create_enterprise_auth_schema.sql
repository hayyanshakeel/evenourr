-- Enterprise Auth Schema Migration
-- 2025_09_01_create_enterprise_auth_schema.sql
BEGIN;

-- Users table with enterprise features
CREATE TABLE users (
  id TEXT PRIMARY KEY,        -- UUID v4
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  tenant_id TEXT,             -- for multi-tenant setups
  status TEXT DEFAULT 'active', -- active | suspended | locked
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Device registry for WebAuthn and mTLS clients
CREATE TABLE devices (
  id TEXT PRIMARY KEY,        -- UUID
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
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
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,         -- UUID
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT REFERENCES devices(id) ON DELETE CASCADE,
  tenant_id TEXT,
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
CREATE TABLE revoked_tokens (
  token_hash TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id),
  revoked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reason TEXT NOT NULL,
  revoked_by TEXT              -- admin user id who revoked
);

-- WebAuthn challenges (temporary storage)
CREATE TABLE webauthn_challenges (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  challenge BLOB NOT NULL,     -- raw challenge bytes
  challenge_type TEXT NOT NULL, -- registration | authentication
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comprehensive audit log
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts DATETIME DEFAULT CURRENT_TIMESTAMP,
  actor_id TEXT,              -- user.id
  actor_device TEXT,          -- device.id
  actor_ip TEXT,
  action TEXT NOT NULL,       -- login | logout | enroll | revoke | admin_action
  resource_type TEXT,         -- user | device | session | token
  resource_id TEXT,
  tenant_id TEXT,
  success BOOLEAN,
  error_code TEXT,
  details JSON,               -- structured action-specific data
  user_agent TEXT
);

-- Key management for rotation
CREATE TABLE signing_keys (
  kid TEXT PRIMARY KEY,       -- key identifier
  algorithm TEXT NOT NULL,    -- ES256, EdDSA, RS256
  public_key BLOB NOT NULL,   -- public key for verification
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  status TEXT DEFAULT 'active', -- active | rotating | revoked
  metadata JSON
);

-- RBAC roles and permissions
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSON,           -- array of permission strings
  tenant_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
  granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  granted_by TEXT,
  PRIMARY KEY (user_id, role_id)
);

-- Device posture and compliance
CREATE TABLE device_posture (
  device_id TEXT REFERENCES devices(id) ON DELETE CASCADE PRIMARY KEY,
  posture_score INTEGER DEFAULT 100,  -- 0-100 compliance score
  last_check DATETIME,
  compliance_data JSON,               -- OS version, encryption status, etc.
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_devices_user ON devices(user_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_device ON sessions(device_id);
CREATE INDEX idx_sessions_expires ON sessions(access_token_expires_at);
CREATE INDEX idx_revoked_tokens ON revoked_tokens(token_hash);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_log_ts ON audit_log(ts);
CREATE INDEX idx_webauthn_challenges_expires ON webauthn_challenges(expires_at);
CREATE INDEX idx_signing_keys_status ON signing_keys(status);

-- Insert default roles
INSERT INTO roles (id, name, description, permissions) VALUES
('super_admin', 'Super Administrator', 'Full system access', '["*"]'),
('tenant_admin', 'Tenant Administrator', 'Full tenant access', '["tenant:*"]'),
('app_admin', 'Application Administrator', 'Application management', '["app:*", "user:read", "session:read"]'),
('developer', 'Developer', 'Development access', '["app:read", "logs:read"]'),
('auditor', 'Auditor', 'Read-only audit access', '["audit:read", "session:read", "user:read"]'),
('user', 'Standard User', 'Basic user access', '["self:read", "self:update"]');

COMMIT;
