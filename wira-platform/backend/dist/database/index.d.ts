import sqlite3 from 'sqlite3';
import { User } from '../types';
declare const DB_PATH: string;
declare const db: sqlite3.Database;
declare function insertSecureUser(userData: Partial<User>): Promise<number>;
declare function logAudit(userCode: string | undefined, action: string, tableName: string | undefined, recordId: string | undefined, oldValues: unknown, newValues: unknown, req: {
    ip?: string;
    get?: (header: string) => string | undefined;
} | undefined): void;
declare function get<T = unknown>(sql: string, params?: unknown[]): Promise<T | null>;
declare function all<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
declare function run(sql: string, params?: unknown[]): Promise<sqlite3.RunResult>;
export { db, insertSecureUser, logAudit, get, all, run, DB_PATH };
export default db;
//# sourceMappingURL=index.d.ts.map