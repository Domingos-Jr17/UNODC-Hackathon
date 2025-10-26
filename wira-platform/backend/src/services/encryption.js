const crypto = require('crypto');
const { logger } = require('../middleware/security');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.key = this.getEncryptionKey();

    if (!this.key) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
  }

  /**
   * Get encryption key from environment
   */
  getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      logger.error('ENCRYPTION_KEY not set in environment variables');
      return null;
    }

    // Ensure key is exactly 32 bytes for AES-256
    return crypto.scryptSync(key, 'salt', 32);
  }

  /**
   * Encrypt sensitive data
   * @param {string} text - Plain text to encrypt
   * @returns {Object} Encrypted data object with iv, tag, and encrypted data
   */
  encrypt(text) {
    try {
      if (!text) return null;

      // Generate random IV
      const iv = crypto.randomBytes(16);

      // Create cipher
      const cipher = crypto.createCipher(this.algorithm, this.key);
      cipher.setAAD(Buffer.from('wira-platform', 'utf8'));

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Get authentication tag
      const tag = cipher.getAuthTag();

      const result = {
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        encryptedData: encrypted
      };

      logger.debug('Data encrypted successfully', {
        dataLength: text.length,
        resultLength: JSON.stringify(result).length
      });

      return result;
    } catch (error) {
      logger.error('Encryption error', {
        error: error.message,
        stack: error.stack
      });
      throw new Error('Falha ao criptografar dados');
    }
  }

  /**
   * Decrypt sensitive data
   * @param {Object} encryptedData - Object with iv, tag, and encryptedData
   * @returns {string} Decrypted plain text
   */
  decrypt(encryptedData) {
    try {
      if (!encryptedData || !encryptedData.iv || !encryptedData.tag || !encryptedData.encryptedData) {
        return null;
      }

      // Create decipher
      const decipher = crypto.createDecipher(this.algorithm, this.key);
      decipher.setAAD(Buffer.from('wira-platform', 'utf8'));
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

      let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      logger.debug('Data decrypted successfully', {
        resultLength: decrypted.length
      });

      return decrypted;
    } catch (error) {
      logger.error('Decryption error', {
        error: error.message,
        stack: error.stack
      });
      throw new Error('Falha ao descriptografar dados');
    }
  }

  /**
   * Encrypt a user object
   * @param {Object} user - User object with sensitive data
   * @returns {Object} User object with encrypted sensitive fields
   */
  encryptUserData(user) {
    try {
      const encryptedUser = { ...user };

      // Encrypt sensitive fields
      if (user.real_name) {
        encryptedUser.real_name = JSON.stringify(this.encrypt(user.real_name));
      }

      if (user.phone) {
        encryptedUser.phone = JSON.stringify(this.encrypt(user.phone));
      }

      if (user.email) {
        encryptedUser.email = JSON.stringify(this.encrypt(user.email));
      }

      // Remove sensitive fields that shouldn't be stored
      delete encryptedUser.traffic_history;
      delete encryptedUser.family_contacts;
      delete encryptedUser.exact_address;

      logger.info('User data encrypted', {
        anonymousCode: user.anonymous_code,
        fieldsEncrypted: ['real_name', 'phone', 'email'].filter(field => user[field])
      });

      return encryptedUser;
    } catch (error) {
      logger.error('User data encryption error', {
        error: error.message,
        anonymousCode: user.anonymous_code
      });
      throw error;
    }
  }

  /**
   * Decrypt user data (for internal use only)
   * @param {Object} encryptedUser - User object with encrypted sensitive data
   * @returns {Object} User object with decrypted sensitive fields
   */
  decryptUserData(encryptedUser) {
    try {
      const user = { ...encryptedUser };

      // Decrypt sensitive fields
      if (encryptedUser.real_name) {
        try {
          const encrypted = JSON.parse(encryptedUser.real_name);
          user.real_name = this.decrypt(encrypted);
        } catch (e) {
          user.real_name = '[DECRYPT_ERROR]';
        }
      }

      if (encryptedUser.phone) {
        try {
          const encrypted = JSON.parse(encryptedUser.phone);
          user.phone = this.decrypt(encrypted);
        } catch (e) {
          user.phone = '[DECRYPT_ERROR]';
        }
      }

      if (encryptedUser.email) {
        try {
          const encrypted = JSON.parse(encryptedUser.email);
          user.email = this.decrypt(encrypted);
        } catch (e) {
          user.email = '[DECRYPT_ERROR]';
        }
      }

      return user;
    } catch (error) {
      logger.error('User data decryption error', {
        error: error.message,
        anonymousCode: encryptedUser.anonymous_code
      });
      throw error;
    }
  }

  /**
   * Generate secure random code
   * @param {string} prefix - Code prefix (e.g., 'V')
   * @param {number} length - Number of digits
   * @returns {string} Random code
   */
  generateSecureCode(prefix = 'V', length = 4) {
    const digits = crypto.randomInt(0, Math.pow(10, length));
    return `${prefix}${digits.toString().padStart(length, '0')}`;
  }

  /**
   * Hash sensitive identifiers for audit logs
   * @param {string} identifier - Sensitive identifier
   * @returns {string} Hashed identifier
   */
  hashIdentifier(identifier) {
    if (!identifier) return null;

    return crypto
      .createHash('sha256')
      .update(identifier + process.env.ENCRYPTION_KEY)
      .digest('hex')
      .substring(0, 16);
  }
}

// Singleton instance
const encryptionService = new EncryptionService();

module.exports = encryptionService;