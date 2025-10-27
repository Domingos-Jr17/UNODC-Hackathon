import { User, EncryptedData, EncryptionResult } from '../types';
declare class EncryptionService {
    private readonly algorithm;
    private readonly key;
    constructor();
    private getEncryptionKey;
    encrypt(text: string): EncryptionResult | null;
    decrypt(encryptedData: EncryptedData): string | null;
    encryptUserData(user: Partial<User>): Partial<User>;
    decryptUserData(encryptedUser: Partial<User>): Partial<User>;
    generateSecureCode(prefix?: string, length?: number): string;
    hashIdentifier(identifier: string): string | null;
    validateKeyStrength(): boolean;
    static generateTestKey(): string;
    generateOneTimeToken(expiresIn?: number): {
        token: string;
        expiresAt: Date;
    };
    secureCompare(data1: string, data2: string): boolean;
    getAlgorithmInfo(): {
        name: string;
        keyLength: number;
        ivLength: number;
        tagLength: number;
    };
}
declare const encryptionService: EncryptionService;
export default encryptionService;
export { EncryptionService };
//# sourceMappingURL=encryption.d.ts.map