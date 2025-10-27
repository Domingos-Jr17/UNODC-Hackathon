import { createClient, RedisClientType } from 'redis'
import winston from 'winston'
import { Course, Progress, USSDSession, CacheStats, RateLimitResult } from '../types'

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
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

class CacheService {
  private client: RedisClientType | null = null
  private isConnected: boolean = false

  constructor () {
    this.connect()
  }

  async connect (): Promise<void> {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

      const clientOptions: any = {
        url: redisUrl
      }

      if (process.env.REDIS_PASSWORD) {
        clientOptions.password = process.env.REDIS_PASSWORD
      }

      this.client = createClient(clientOptions)

      this.client.on('connect', () => {
        logger.info('Redis client connected')
        this.isConnected = true
      })

      this.client.on('error', (err) => {
        logger.error('Redis connection error', { error: err.message })
        this.isConnected = false
      })

      this.client.on('ready', () => {
        logger.info('Redis client ready')
      })

      this.client.on('end', () => {
        logger.warn('Redis connection ended')
        this.isConnected = false
      })

      await this.client.connect()
    } catch (error) {
      logger.error('Failed to connect to Redis', { error: (error as Error).message })
      this.isConnected = false
    }
  }

  async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.quit()
      this.isConnected = false
    }
  }

  isReady (): boolean {
    return !!(this.isConnected && this.client && this.client.isOpen)
  }

  // Basic cache operations
  async set<T = any> (key: string, value: T, ttl: number = 3600): Promise<boolean> {
    try {
      if (!this.isReady()) {
        logger.warn('Redis not ready, skipping cache set', { key })
        return false
      }

      const serializedValue = JSON.stringify(value)
      await this.client!.setEx(key, ttl, serializedValue)

      logger.debug('Cache set successfully', { key, ttl })
      return true
    } catch (error) {
      logger.error('Cache set error', { error: (error as Error).message, key })
      return false
    }
  }

  async get<T = any> (key: string): Promise<T | null> {
    try {
      if (!this.isReady()) {
        logger.warn('Redis not ready, skipping cache get', { key })
        return null
      }

      const value = await this.client!.get(key)

      if (!value) {
        logger.debug('Cache miss', { key })
        return null
      }

      const parsedValue = JSON.parse(value) as T
      logger.debug('Cache hit', { key })
      return parsedValue
    } catch (error) {
      logger.error('Cache get error', { error: (error as Error).message, key })
      return null
    }
  }

  async del (key: string): Promise<boolean> {
    try {
      if (!this.isReady()) {
        logger.warn('Redis not ready, skipping cache delete', { key })
        return false
      }

      const result = await this.client!.del(key)
      logger.debug('Cache deleted', { key, deleted: result > 0 })
      return result > 0
    } catch (error) {
      logger.error('Cache delete error', { error: (error as Error).message, key })
      return false
    }
  }

  async exists (key: string): Promise<boolean> {
    try {
      if (!this.isReady()) {
        return false
      }

      const result = await this.client!.exists(key)
      return result === 1
    } catch (error) {
      logger.error('Cache exists check error', { error: (error as Error).message, key })
      return false
    }
  }

  // Hash operations for complex data
  async hSet (key: string, field: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      if (!this.isReady()) {
        return false
      }

      await this.client!.hSet(key, field, JSON.stringify(value))

      if (ttl > 0) {
        await this.client!.expire(key, ttl)
      }

      return true
    } catch (error) {
      logger.error('Cache hSet error', { error: (error as Error).message, key, field })
      return false
    }
  }

  async hGet<T = any> (key: string, field: string): Promise<T | null> {
    try {
      if (!this.isReady()) {
        return null
      }

      const value = await this.client!.hGet(key, field)
      return value ? JSON.parse(value) as T : null
    } catch (error) {
      logger.error('Cache hGet error', { error: (error as Error).message, key, field })
      return null
    }
  }

  async hGetAll (key: string): Promise<Record<string, any>> {
    try {
      if (!this.isReady()) {
        return {}
      }

      const hash = await this.client!.hGetAll(key)
      const parsed: Record<string, any> = {}

      for (const [field, value] of Object.entries(hash)) {
        try {
          parsed[field] = JSON.parse(value)
        } catch {
          parsed[field] = value
        }
      }

      return parsed
    } catch (error) {
      logger.error('Cache hGetAll error', { error: (error as Error).message, key })
      return {}
    }
  }

  // Cache warming strategies
  async warmCoursesCache (courses: Course[]): Promise<void> {
    try {
      const promises = courses.map(course =>
        this.set(`course:${course.id}`, course, 1800) // 30 minutes
      )

      await Promise.all(promises)
      logger.info('Courses cache warmed', { count: courses.length })
    } catch (error) {
      logger.error('Error warming courses cache', { error: (error as Error).message })
    }
  }

  async warmUserProgressCache (userCode: string, progressData: Progress[]): Promise<void> {
    try {
      await this.set(`progress:${userCode}`, progressData, 600) // 10 minutes
      logger.debug('User progress cache warmed', { userCode })
    } catch (error) {
      logger.error('Error warming user progress cache', { error: (error as Error).message, userCode })
    }
  }

  // Cache invalidation
  async invalidateUserCache (userCode: string): Promise<void> {
    try {
      const pattern = `*:${userCode}:*`
      const keys = await this.client!.keys(pattern)

      if (keys.length > 0) {
        await this.client!.del(keys)
        logger.info('User cache invalidated', { userCode, keysDeleted: keys.length })
      }
    } catch (error) {
      logger.error('Error invalidating user cache', { error: (error as Error).message, userCode })
    }
  }

  async invalidateCourseCache (courseId: string): Promise<void> {
    try {
      const keys = [
        `course:${courseId}`,
        `course:${courseId}:modules`,
        `course:${courseId}:quiz`
      ]

      await this.client!.del(keys)
      logger.info('Course cache invalidated', { courseId })
    } catch (error) {
      logger.error('Error invalidating course cache', { error: (error as Error).message, courseId })
    }
  }

  // USSD session management
  async setUSSDSession (sessionId: string, sessionData: USSDSession, ttl: number = 300): Promise<boolean> {
    return this.hSet(`ussd:${sessionId}`, 'data', sessionData, ttl)
  }

  async getUSSDSession (sessionId: string): Promise<USSDSession | null> {
    return this.hGet<USSDSession>(`ussd:${sessionId}`, 'data')
  }

  async deleteUSSDSession (sessionId: string): Promise<boolean> {
    return this.del(`ussd:${sessionId}`)
  }

  // Rate limiting with Redis
  async checkRateLimit (key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    try {
      if (!this.isReady()) {
        return { allowed: true, remaining: limit }
      }

      const current = await this.client!.incr(key)

      if (current === 1) {
        await this.client!.expire(key, Math.ceil(windowMs / 1000))
      }

      const ttl = await this.client!.ttl(key)
      const remaining = Math.max(0, limit - current)

      return {
        allowed: current <= limit,
        remaining,
        resetTime: Date.now() + (ttl * 1000)
      }
    } catch (error) {
      logger.error('Rate limit check error', { error: (error as Error).message, key })
      return { allowed: true, remaining: limit }
    }
  }

  // Statistics and monitoring
  async getStats (): Promise<CacheStats> {
    try {
      if (!this.isReady()) {
        return { connected: false }
      }

      const info = await this.client!.info('memory')
      const keyspace = await this.client!.info('keyspace')

      const stats: CacheStats = {
        connected: true
      }

      const memoryInfo = this.parseMemoryInfo(info)
      if (memoryInfo) {
        stats.memory = memoryInfo
      }

      const keyspaceInfo = this.parseKeyspaceInfo(keyspace)
      if (keyspaceInfo) {
        stats.keyspace = keyspaceInfo
      }

      return stats
    } catch (error) {
      logger.error('Error getting Redis stats', { error: (error as Error).message })
      return { connected: false, error: (error as Error).message }
    }
  }

  private parseMemoryInfo (info: string): { used: string; peak: string } | undefined {
    const memory: { used?: string; peak?: string } = {}
    const lines = info.split('\r\n')

    for (const line of lines) {
      if (line.startsWith('used_memory_human:')) {
        memory.used = line.split(':')[1]
      } else if (line.startsWith('used_memory_peak_human:')) {
        memory.peak = line.split(':')[1]
      }
    }

    return memory.used && memory.peak ? { used: memory.used, peak: memory.peak } : undefined
  }

  private parseKeyspaceInfo (info: string): Record<string, { keys: number; expires: number }> | undefined {
    const keyspace: Record<string, { keys: number; expires: number }> = {}
    const lines = info.split('\r\n')

    for (const line of lines) {
      if (line.startsWith('db')) {
        const [db, stats] = line.split(':')
        const matches = stats.match(/keys=(\d+),expires=(\d+)/)
        if (matches) {
          keyspace[db] = {
            keys: parseInt(matches[1]),
            expires: parseInt(matches[2])
          }
        }
      }
    }

    return Object.keys(keyspace).length > 0 ? keyspace : undefined
  }

  // Health check for Redis
  async healthCheck (): Promise<{ status: 'healthy' | 'unhealthy'; latency?: number; error?: string }> {
    try {
      if (!this.isReady()) {
        return { status: 'unhealthy', error: 'Redis not connected' }
      }

      const start = Date.now()
      await this.client!.ping()
      const latency = Date.now() - start

      return { status: 'healthy', latency }
    } catch (error) {
      return {
        status: 'unhealthy',
        error: (error as Error).message
      }
    }
  }

  // Cache utilities
  async clearAll (): Promise<boolean> {
    try {
      if (!this.isReady()) {
        return false
      }

      await this.client!.flushDb()
      logger.info('All cache cleared')
      return true
    } catch (error) {
      logger.error('Error clearing cache', { error: (error as Error).message })
      return false
    }
  }

  async getKeysByPattern (pattern: string): Promise<string[]> {
    try {
      if (!this.isReady()) {
        return []
      }

      return await this.client!.keys(pattern)
    } catch (error) {
      logger.error('Error getting keys by pattern', { error: (error as Error).message, pattern })
      return []
    }
  }

  // Batch operations
  async mSet (entries: Array<{ key: string; value: any; ttl?: number }>): Promise<boolean> {
    try {
      if (!this.isReady()) {
        return false
      }

      const pipeline = this.client!.multi()

      entries.forEach(({ key, value, ttl }) => {
        const serializedValue = JSON.stringify(value)
        pipeline.setEx(key, ttl || 3600, serializedValue)
      })

      await pipeline.exec()
      logger.debug('Batch cache set successful', { count: entries.length })
      return true
    } catch (error) {
      logger.error('Batch cache set error', { error: (error as Error).message })
      return false
    }
  }

  async mGet (keys: string[]): Promise<Array<any | null>> {
    try {
      if (!this.isReady()) {
        return keys.map(() => null)
      }

      const values = await this.client!.mGet(keys)

      return values.map(value => {
        if (!value) return null
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      })
    } catch (error) {
      logger.error('Batch cache get error', { error: (error as Error).message })
      return keys.map(() => null)
    }
  }
}

// Singleton instance
const cacheService = new CacheService()

export default cacheService
export { CacheService }