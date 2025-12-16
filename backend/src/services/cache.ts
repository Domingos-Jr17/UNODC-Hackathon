import winston from 'winston'
import { Course, Progress, USSDSession, CacheStats, RateLimitResult } from '../types'

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

/**
 * Simplified CacheService - Redis Disabled
 *
 * Service maintains compatibility with existing code while Redis is disabled.
 * All cache operations return null/false to gracefully fall back to direct database queries.
 */
class CacheService {
  private readonly isRedisEnabled: boolean = false

  constructor() {
    logger.info('CacheService initialized (Redis disabled)')
  }

  // Connection methods (no-op)
  async connect(): Promise<void> {
    logger.debug('CacheService.connect() called (Redis disabled)')
    // No-op - Redis is disabled
  }

  async disconnect(): Promise<void> {
    logger.debug('CacheService.disconnect() called (Redis disabled)')
    // No-op - Redis is disabled
  }

  // Basic cache operations (no-op)
  async get(key: string): Promise<string | null> {
    logger.debug(`CacheService.get() called for key: ${key} (Redis disabled)`)
    return null
  }

  async set(key: string, _value: string, _expireInSeconds?: number): Promise<boolean> {
    logger.debug(`CacheService.set() called for key: ${key} (Redis disabled)`)
    return false
  }

  async del(key: string): Promise<boolean> {
    logger.debug(`CacheService.del() called for key: ${key} (Redis disabled)`)
    return false
  }

  async exists(key: string): Promise<boolean> {
    logger.debug(`CacheService.exists() called for key: ${key} (Redis disabled)`)
    return false
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    logger.debug(`CacheService.expire() called for key: ${key} (Redis disabled)`)
    return false
  }

  async ttl(key: string): Promise<number> {
    logger.debug(`CacheService.ttl() called for key: ${key} (Redis disabled)`)
    return -1
  }

  // Hash operations (no-op)
  async hGet(key: string, field: string): Promise<string | null> {
    logger.debug(`CacheService.hGet() called for key: ${key}, field: ${field} (Redis disabled)`)
    return null
  }

  async hSet(key: string, field: string, value: string): Promise<boolean> {
    logger.debug(`CacheService.hSet() called for key: ${key}, field: ${field} (Redis disabled)`)
    return false
  }

  async hDel(key: string, field: string): Promise<boolean> {
    logger.debug(`CacheService.hDel() called for key: ${key}, field: ${field} (Redis disabled)`)
    return false
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    logger.debug(`CacheService.hGetAll() called for key: ${key} (Redis disabled)`)
    return {}
  }

  // JSON operations (no-op)
  async getJSON<T>(key: string): Promise<T | null> {
    logger.debug(`CacheService.getJSON() called for key: ${key} (Redis disabled)`)
    return null
  }

  async setJSON<T>(key: string, value: T, expireInSeconds?: number): Promise<boolean> {
    logger.debug(`CacheService.setJSON() called for key: ${key} (Redis disabled)`)
    return false
  }

  // List operations (no-op)
  async lPush(key: string, ...values: string[]): Promise<number> {
    logger.debug(`CacheService.lPush() called for key: ${key} (Redis disabled)`)
    return 0
  }

  async rPop(key: string): Promise<string | null> {
    logger.debug(`CacheService.rPop() called for key: ${key} (Redis disabled)`)
    return null
  }

  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    logger.debug(`CacheService.lRange() called for key: ${key} (Redis disabled)`)
    return []
  }

  // Set operations (no-op)
  async sAdd(key: string, ...members: string[]): Promise<number> {
    logger.debug(`CacheService.sAdd() called for key: ${key} (Redis disabled)`)
    return 0
  }

  async sRem(key: string, ...members: string[]): Promise<number> {
    logger.debug(`CacheService.sRem() called for key: ${key} (Redis disabled)`)
    return 0
  }

  async sMembers(key: string): Promise<string[]> {
    logger.debug(`CacheService.sMembers() called for key: ${key} (Redis disabled)`)
    return []
  }

  // Cache-specific methods for WIRA (no-op)
  async cacheCourse(courseId: string, course: Course, expireInSeconds?: number): Promise<boolean> {
    logger.debug(`CacheService.cacheCourse() called for courseId: ${courseId} (Redis disabled)`)
    return false
  }

  async getCachedCourse(courseId: string): Promise<Course | null> {
    logger.debug(`CacheService.getCachedCourse() called for courseId: ${courseId} (Redis disabled)`)
    return null
  }

  async cacheProgress(userCode: string, courseId: string, progress: Progress, expireInSeconds?: number): Promise<boolean> {
    logger.debug(`CacheService.cacheProgress() called for userCode: ${userCode}, courseId: ${courseId} (Redis disabled)`)
    return false
  }

  async getCachedProgress(userCode: string, courseId: string): Promise<Progress | null> {
    logger.debug(`CacheService.getCachedProgress() called for userCode: ${userCode}, courseId: ${courseId} (Redis disabled)`)
    return null
  }

  async cacheUSSDSession(sessionId: string, session: USSDSession, expireInSeconds?: number): Promise<boolean> {
    logger.debug(`CacheService.cacheUSSDSession() called for sessionId: ${sessionId} (Redis disabled)`)
    return false
  }

  async getCachedUSSDSession(sessionId: string): Promise<USSDSession | null> {
    logger.debug(`CacheService.getCachedUSSDSession() called for sessionId: ${sessionId} (Redis disabled)`)
    return null
  }

  async invalidateUserCache(userCode: string): Promise<boolean> {
    logger.debug(`CacheService.invalidateUserCache() called for userCode: ${userCode} (Redis disabled)`)
    return false
  }

  async invalidateCourseCache(courseId: string): Promise<boolean> {
    logger.debug(`CacheService.invalidateCourseCache() called for courseId: ${courseId} (Redis disabled)`)
    return false
  }

  async invalidatePattern(pattern: string): Promise<boolean> {
    logger.debug(`CacheService.invalidatePattern() called for pattern: ${pattern} (Redis disabled)`)
    return false
  }

  // Rate limiting (no-op - returns allowed: true)
  async checkRateLimit(identifier: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    logger.debug(`CacheService.checkRateLimit() called for identifier: ${identifier} (Redis disabled)`)
    return {
      allowed: true,
      remaining: limit,
      resetTime: Date.now() + windowMs
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
    return {
      status: 'unhealthy',
      message: 'Redis cache is disabled'
    }
  }

  // Cache statistics
  async getStats(): Promise<CacheStats> {
    return {
      connected: false,
      memory: {
        used: '0B',
        peak: '0B'
      }
    }
  }

  // Utility methods
  async flushAll(): Promise<boolean> {
    logger.debug('CacheService.flushAll() called (Redis disabled)')
    return false
  }

  async ping(): Promise<boolean> {
    logger.debug('CacheService.ping() called (Redis disabled)')
    return false
  }

  // Get Redis client info (returns null since Redis is disabled)
  getClient(): null {
    return null
  }

  // Check if Redis is connected
  isRedisConnected(): boolean {
    return false
  }

  // Warm up cache (no-op)
  async warmupCache(): Promise<void> {
    logger.debug('CacheService.warmupCache() called (Redis disabled)')
    // No-op - cache warming is disabled
  }
}

// Create and export singleton instance
const cacheService = new CacheService()

export default cacheService