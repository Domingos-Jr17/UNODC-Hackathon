"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        })
    ]
});
class EncryptionService {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.key = this.getEncryptionKey();
        if (!this.key) {
            throw new Error('ENCRYPTION_KEY environment variable is required');
        }
    }
    getEncryptionKey() {
        const key = process.env.ENCRYPTION_KEY;
        if (!key) {
            logger.error('ENCRYPTION_KEY not set in environment variables');
            return null;
        }
        return crypto_1.default.scryptSync(key, 'salt', 32);
    }
    encrypt(text) {
        try {
            if (!text)
                return null;
            const iv = crypto_1.default.randomBytes(16);
            const cipher = crypto_1.default.createCipher(this.algorithm, this.key);
            cipher.setAAD(Buffer.from('wira-platform', 'utf8'));
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
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
        }
        catch (error) {
            logger.error('Encryption error', {
                error: error.message,
                stack: error.stack
            });
            throw new Error('Falha ao criptografar dados');
        }
    }
    decrypt(encryptedData) {
        try {
            if (!encryptedData || !encryptedData.iv || !encryptedData.tag || !encryptedData.encryptedData) {
                return null;
            }
            const decipher = crypto_1.default.createDecipher(this.algorithm, this.key);
            decipher.setAAD(Buffer.from('wira-platform', 'utf8'));
            decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
            let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            logger.debug('Data decrypted successfully', {
                resultLength: decrypted.length
            });
            return decrypted;
        }
        catch (error) {
            logger.error('Decryption error', {
                error: error.message,
                stack: error.stack
            });
            throw new Error('Falha ao descriptografar dados');
        }
    }
    encryptUserData(user) {
        try {
            const encryptedUser = { ...user };
            if (user.real_name) {
                encryptedUser.real_name = JSON.stringify(this.encrypt(user.real_name));
            }
            if (user.phone) {
                encryptedUser.phone = JSON.stringify(this.encrypt(user.phone));
            }
            if (user.email) {
                encryptedUser.email = JSON.stringify(this.encrypt(user.email));
            }
            delete encryptedUser.traffic_history;
            delete encryptedUser.family_contacts;
            delete encryptedUser.exact_address;
            logger.info('User data encrypted', {
                anonymousCode: user.anonymous_code,
                fieldsEncrypted: ['real_name', 'phone', 'email'].filter(field => user[field])
            });
            return encryptedUser;
        }
        catch (error) {
            logger.error('User data encryption error', {
                error: error.message,
                anonymousCode: user.anonymous_code
            });
            throw error;
        }
    }
    decryptUserData(encryptedUser) {
        try {
            const user = { ...encryptedUser };
            if (encryptedUser.real_name) {
                try {
                    const encrypted = JSON.parse(encryptedUser.real_name);
                    user.real_name = this.decrypt(encrypted);
                }
                catch {
                    user.real_name = '[DECRYPT_ERROR]';
                }
            }
            if (encryptedUser.phone) {
                try {
                    const encrypted = JSON.parse(encryptedUser.phone);
                    user.phone = this.decrypt(encrypted);
                }
                catch {
                    user.phone = '[DECRYPT_ERROR]';
                }
            }
            if (encryptedUser.email) {
                try {
                    const encrypted = JSON.parse(encryptedUser.email);
                    user.email = this.decrypt(encrypted);
                }
                catch {
                    user.email = '[DECRYPT_ERROR]';
                }
            }
            return user;
        }
        catch (error) {
            logger.error('User data decryption error', {
                error: error.message,
                anonymousCode: encryptedUser.anonymous_code
            });
            throw error;
        }
    }
    generateSecureCode(prefix = 'V', length = 4) {
        const digits = crypto_1.default.randomInt(0, Math.pow(10, length));
        return `${prefix}${digits.toString().padStart(length, '0')}`;
    }
    hashIdentifier(identifier) {
        if (!identifier)
            return null;
        return crypto_1.default
            .createHash('sha256')
            .update(identifier + (process.env.ENCRYPTION_KEY || ''))
            .digest('hex')
            .substring(0, 16);
    }
    validateKeyStrength() {
        const key = process.env.ENCRYPTION_KEY;
        if (!key)
            return false;
        return key.length >= 32 && /[A-Za-z]/.test(key) && /\d/.test(key);
    }
    static generateTestKey() {
        return crypto_1.default.randomBytes(32).toString('hex');
    }
    generateOneTimeToken(expiresIn = 3600) {
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        return { token, expiresAt };
    }
    secureCompare(data1, data2) {
        if (data1.length !== data2.length) {
            return false;
        }
        return crypto_1.default.timingSafeEqual(Buffer.from(data1), Buffer.from(data2));
    }
    getAlgorithmInfo() {
        return {
            name: this.algorithm,
            keyLength: this.key.length * 8,
            ivLength: 16,
            tagLength: 16
        };
    }
}
exports.EncryptionService = EncryptionService;
const encryptionService = new EncryptionService();
exports.default = encryptionService;
//# sourceMappingURL=encryption.js.map