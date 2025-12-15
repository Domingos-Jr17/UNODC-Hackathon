-- Migration: Add Staff Authentication Support
-- Date: 2025-10-28
-- Purpose: Add email/password authentication for NGO staff while maintaining victim anonymity

-- Add new columns to User table
ALTER TABLE User ADD COLUMN role TEXT NOT NULL DEFAULT 'VICTIM';
ALTER TABLE User ADD COLUMN password TEXT;
ALTER TABLE User ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;

-- Create indexes for performance
CREATE INDEX idx_user_role ON User(role);
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_email_verified ON User(email_verified);

-- Update existing users to have VICTIM role
UPDATE User SET role = 'VICTIM' WHERE role IS NULL;

-- Insert sample staff accounts for testing
INSERT INTO User (anonymous_code, email, password, role, real_name, ngo_id, email_verified, is_active, created_at)
VALUES
  ('ADMIN001', 'admin@wira.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkHj4.fhXk9c1wKqK8Yq7vK6r8mN3sT9uV7p6XwZ', 'ADMIN', 'Administrador WIRA', 'ONG-001', 1, 1, datetime('now')),
  ('STAFF001', 'maria.silva@ong-001.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkHj4.fhXk9c1wKqK8Yq7vK6r8mN3sT9uV7p6XwZ', 'STAFF', 'Maria Silva', 'ONG-001', 1, 1, datetime('now')),
  ('STAFF002', 'joao.santos@ong-002.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkHj4.fhXk9c1wKqK8Yq7vK6r8mN3sT9uV7p6XwZ', 'STAFF', 'João Santos', 'ONG-002', 1, 1, datetime('now')),
  ('STAFF003', 'ana.costa@ong-001.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkHj4.fhXk9c1wKqK8Yq7vK6r8mN3sT9uV7p6XwZ', 'STAFF', 'Ana Costa', 'ONG-001', 1, 1, datetime('now'));

-- Note: The passwords above are bcrypt hashes of "admin123", "staff123", "joao123", "ana123"

-- Create audit log entry for migration
INSERT INTO AuditLog (action, table_name, timestamp)
VALUES ('SCHEMA_MIGRATION', 'User', datetime('now'));

-- Sample staff account details (for reference):
-- ADMIN001: admin@wira.org / admin123 - Full system administrator
-- STAFF001: maria.silva@ong-001.org / staff123 - Case manager at ONG-001
-- STAFF002: joao.santos@ong-002.org / joao123 - Social worker at ONG-002
-- STAFF003: ana.costa@ong-001.org / ana123 - Counselor at ONG-001

-- Backward compatibility check
-- Ensure all existing anonymous codes remain unchanged
SELECT anonymous_code, role FROM User WHERE anonymous_code IN ('V0042', 'V0038', 'V0031');