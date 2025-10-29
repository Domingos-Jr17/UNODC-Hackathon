import { Course, Progress, USSDSession, CacheStats, RateLimitResult } from '../types';
declare class CacheService {
    private readonly isRedisEnabled;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, _value: string, _expireInSeconds?: number): Promise<boolean>;
    del(key: string): Promise<boolean>;
    exists(key: string): Promise<boolean>;
    expire(key: string, seconds: number): Promise<boolean>;
    ttl(key: string): Promise<number>;
    hGet(key: string, field: string): Promise<string | null>;
    hSet(key: string, field: string, value: string): Promise<boolean>;
    hDel(key: string, field: string): Promise<boolean>;
    hGetAll(key: string): Promise<Record<string, string>>;
    getJSON<T>(key: string): Promise<T | null>;
    setJSON<T>(key: string, value: T, expireInSeconds?: number): Promise<boolean>;
    lPush(key: string, ...values: string[]): Promise<number>;
    rPop(key: string): Promise<string | null>;
    lRange(key: string, start: number, stop: number): Promise<string[]>;
    sAdd(key: string, ...members: string[]): Promise<number>;
    sRem(key: string, ...members: string[]): Promise<number>;
    sMembers(key: string): Promise<string[]>;
    cacheCourse(courseId: string, course: Course, expireInSeconds?: number): Promise<boolean>;
    getCachedCourse(courseId: string): Promise<Course | null>;
    cacheProgress(userCode: string, courseId: string, progress: Progress, expireInSeconds?: number): Promise<boolean>;
    getCachedProgress(userCode: string, courseId: string): Promise<Progress | null>;
    cacheUSSDSession(sessionId: string, session: USSDSession, expireInSeconds?: number): Promise<boolean>;
    getCachedUSSDSession(sessionId: string): Promise<USSDSession | null>;
    invalidateUserCache(userCode: string): Promise<boolean>;
    invalidateCourseCache(courseId: string): Promise<boolean>;
    invalidatePattern(pattern: string): Promise<boolean>;
    checkRateLimit(identifier: string, limit: number, windowMs: number): Promise<RateLimitResult>;
    healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        message: string;
    }>;
    getStats(): Promise<CacheStats>;
    flushAll(): Promise<boolean>;
    ping(): Promise<boolean>;
    getClient(): null;
    isRedisConnected(): boolean;
    warmupCache(): Promise<void>;
}
declare const cacheService: CacheService;
export default cacheService;
//# sourceMappingURL=cache.d.ts.map