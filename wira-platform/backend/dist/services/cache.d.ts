import { Course, UserProgress, USSDSession, CacheStats, RateLimitResult } from '@/types';
declare class CacheService {
    private client;
    private isConnected;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isReady(): boolean;
    set<T = any>(key: string, value: T, ttl?: number): Promise<boolean>;
    get<T = any>(key: string): Promise<T | null>;
    del(key: string): Promise<boolean>;
    exists(key: string): Promise<boolean>;
    hSet(key: string, field: string, value: any, ttl?: number): Promise<boolean>;
    hGet<T = any>(key: string, field: string): Promise<T | null>;
    hGetAll(key: string): Promise<Record<string, any>>;
    warmCoursesCache(courses: Course[]): Promise<void>;
    warmUserProgressCache(userCode: string, progressData: UserProgress[]): Promise<void>;
    invalidateUserCache(userCode: string): Promise<void>;
    invalidateCourseCache(courseId: string): Promise<void>;
    setUSSDSession(sessionId: string, sessionData: USSDSession, ttl?: number): Promise<boolean>;
    getUSSDSession(sessionId: string): Promise<USSDSession | null>;
    deleteUSSDSession(sessionId: string): Promise<boolean>;
    checkRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
    getStats(): Promise<CacheStats>;
    private parseMemoryInfo;
    private parseKeyspaceInfo;
    healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        latency?: number;
        error?: string;
    }>;
    clearAll(): Promise<boolean>;
    getKeysByPattern(pattern: string): Promise<string[]>;
    mSet(entries: Array<{
        key: string;
        value: any;
        ttl?: number;
    }>): Promise<boolean>;
    mGet(keys: string[]): Promise<Array<any | null>>;
}
declare const cacheService: CacheService;
export default cacheService;
export { CacheService };
//# sourceMappingURL=cache.d.ts.map