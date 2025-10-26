const encryptionService = require('../../src/services/encryption');

describe('Encryption Service', () => {
  describe('encrypt/decrypt', () => {
    test('should encrypt and decrypt text correctly', () => {
      const plainText = 'Maria Silva';
      const encrypted = encryptionService.encrypt(plainText);
      const decrypted = encryptionService.decrypt(encrypted);

      expect(encrypted).toBeDefined();
      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('tag');
      expect(encrypted).toHaveProperty('encryptedData');
      expect(decrypted).toBe(plainText);
    });

    test('should handle null/undefined inputs', () => {
      expect(encryptionService.encrypt(null)).toBeNull();
      expect(encryptionService.encrypt(undefined)).toBeNull();
      expect(encryptionService.decrypt(null)).toBeNull();
      expect(encryptionService.decrypt(undefined)).toBeNull();
    });

    test('should encrypt empty string', () => {
      const encrypted = encryptionService.encrypt('');
      const decrypted = encryptionService.decrypt(encrypted);
      expect(decrypted).toBe('');
    });

    test('should encrypt sensitive characters', () => {
      const sensitiveText = 'João @ Sitoe +25884';
      const encrypted = encryptionService.encrypt(sensitiveText);
      const decrypted = encryptionService.decrypt(encrypted);
      expect(decrypted).toBe(sensitiveText);
    });
  });

  describe('encryptUserData', () => {
    test('should encrypt user sensitive fields', () => {
      const user = {
        anonymous_code: 'V0042',
        real_name: 'Maria Silva',
        phone: '+258841234567',
        email: 'maria@example.com',
        ngo_id: 'ong-001'
      };

      const encryptedUser = encryptionService.encryptUserData(user);

      expect(encryptedUser.anonymous_code).toBe('V0042');
      expect(encryptedUser.ngo_id).toBe('ong-001');
      expect(encryptedUser.real_name).toMatch(/^\{.*\}$/); // Should be JSON string
      expect(encryptedUser.phone).toMatch(/^\{.*\}$/);
      expect(encryptedUser.email).toMatch(/^\{.*\}$/);
      expect(encryptedUser.traffic_history).toBeUndefined();
      expect(encryptedUser.family_contacts).toBeUndefined();
    });

    test('should handle user without sensitive data', () => {
      const user = {
        anonymous_code: 'V0042',
        ngo_id: 'ong-001'
      };

      const encryptedUser = encryptionService.encryptUserData(user);

      expect(encryptedUser).toEqual(user);
    });
  });

  describe('decryptUserData', () => {
    test('should decrypt user sensitive fields', () => {
      const user = {
        anonymous_code: 'V0042',
        real_name: JSON.stringify(encryptionService.encrypt('Maria Silva')),
        phone: JSON.stringify(encryptionService.encrypt('+258841234567')),
        email: JSON.stringify(encryptionService.encrypt('maria@example.com')),
        ngo_id: 'ong-001'
      };

      const decryptedUser = encryptionService.decryptUserData(user);

      expect(decryptedUser.anonymous_code).toBe('V0042');
      expect(decryptedUser.ngo_id).toBe('ong-001');
      expect(decryptedUser.real_name).toBe('Maria Silva');
      expect(decryptedUser.phone).toBe('+258841234567');
      expect(decryptedUser.email).toBe('maria@example.com');
    });

    test('should handle decryption errors gracefully', () => {
      const user = {
        anonymous_code: 'V0042',
        real_name: '{"invalid":"json"}',
        ngo_id: 'ong-001'
      };

      const decryptedUser = encryptionService.decryptUserData(user);

      expect(decryptedUser.anonymous_code).toBe('V0042');
      expect(decryptedUser.real_name).toBe('[DECRYPT_ERROR]');
    });
  });

  describe('generateSecureCode', () => {
    test('should generate code with correct format', () => {
      const code = encryptionService.generateSecureCode('V', 4);
      expect(code).toMatch(/^V\d{4}$/);
    });

    test('should generate different codes', () => {
      const code1 = encryptionService.generateSecureCode('V', 4);
      const code2 = encryptionService.generateSecureCode('V', 4);
      expect(code1).not.toBe(code2);
    });

    test('should support custom prefix and length', () => {
      const code = encryptionService.generateSecureCode('X', 6);
      expect(code).toMatch(/^X\d{6}$/);
    });
  });

  describe('hashIdentifier', () => {
    test('should generate consistent hash for same input', () => {
      const id = 'V0042';
      const hash1 = encryptionService.hashIdentifier(id);
      const hash2 = encryptionService.hashIdentifier(id);
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(16);
    });

    test('should generate different hashes for different inputs', () => {
      const hash1 = encryptionService.hashIdentifier('V0042');
      const hash2 = encryptionService.hashIdentifier('V0038');
      expect(hash1).not.toBe(hash2);
    });

    test('should handle null/undefined input', () => {
      expect(encryptionService.hashIdentifier(null)).toBeNull();
      expect(encryptionService.hashIdentifier(undefined)).toBeNull();
    });
  });
});