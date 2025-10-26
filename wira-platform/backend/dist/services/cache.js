"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const redis_1 = require("redis");
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
class CacheService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.connect();
    }
    async connect() {
        try {
            const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
            this.client = (0, redis_1.createClient)({
                url: redisUrl,
                password: process.env.REDIS_PASSWORD || undefined,
                retry_strategy: (options) => {
                    if (options.error && options.error.code === 'ECONNREFUSED') {
                        logger.error('Redis server connection refused');
                        return new Error('Redis connection refused');
                    }
                    if (options.total_retry_time > 1000 * 60 * 60) {
                        logger.error('Redis retry time exhausted');
                        return new Error('Retry time exhausted');
                    }
                    if (options.attempt > 10) {
                        logger.error('Redis max retry attempts reached');
                        return undefined;
                    }
                    return Math.min(options.attempt * 100, 3000);
                }
            });
            this.client.on('connect', () => {
                logger.info('Redis client connected');
                this.isConnected = true;
            });
            this.client.on('error', (err) => {
                logger.error('Redis connection error', { error: err.message });
                this.isConnected = false;
            });
            this.client.on('ready', () => {
                logger.info('Redis client ready');
            });
            this.client.on('end', () => {
                logger.warn('Redis connection ended');
                this.isConnected = false;
            });
            await this.client.connect();
        }
        catch (error) {
            logger.error('Failed to connect to Redis', { error: error.message });
            this.isConnected = false;
        }
    }
    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.isConnected = false;
        }
    }
    isReady() {
        return this.isConnected && this.client && this.client.isOpen;
    }
    async set(key, value, ttl = 3600) {
        try {
            if (!this.isReady()) {
                logger.warn('Redis not ready, skipping cache set', { key });
                return false;
            }
            const serializedValue = JSON.stringify(value);
            await this.client.setEx(key, ttl, serializedValue);
            logger.debug('Cache set successfully', { key, ttl });
            return true;
        }
        catch (error) {
            logger.error('Cache set error', { error: error.message, key });
            return false;
        }
    }
    async get(key) {
        try {
            if (!this.isReady()) {
                logger.warn('Redis not ready, skipping cache get', { key });
                return null;
            }
            const value = await this.client.get(key);
            if (!value) {
                logger.debug('Cache miss', { key });
                return null;
            }
            const parsedValue = JSON.parse(value);
            logger.debug('Cache hit', { key });
            return parsedValue;
        }
        catch (error) {
            logger.error('Cache get error', { error: error.message, key });
            return null;
        }
    }
    async del(key) {
        try {
            if (!this.isReady()) {
                logger.warn('Redis not ready, skipping cache delete', { key });
                return false;
            }
            const result = await this.client.del(key);
            logger.debug('Cache deleted', { key, deleted: result > 0 });
            return result > 0;
        }
        catch (error) {
            logger.error('Cache delete error', { error: error.message, key });
            return false;
        }
    }
    async exists(key) {
        try {
            if (!this.isReady()) {
                return false;
            }
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            logger.error('Cache exists check error', { error: error.message, key });
            return false;
        }
    }
    async hSet(key, field, value, ttl = 3600) {
        try {
            if (!this.isReady()) {
                return false;
            }
            await this.client.hSet(key, field, JSON.stringify(value));
            if (ttl > 0) {
                await this.client.expire(key, ttl);
            }
            return true;
        }
        catch (error) {
            logger.error('Cache hSet error', { error: error.message, key, field });
            return false;
        }
    }
    async hGet(key, field) {
        try {
            if (!this.isReady()) {
                return null;
            }
            const value = await this.client.hGet(key, field);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            logger.error('Cache hGet error', { error: error.message, key, field });
            return null;
        }
    }
    async hGetAll(key) {
        try {
            if (!this.isReady()) {
                return {};
            }
            const hash = await this.client.hGetAll(key);
            const parsed = {};
            for (const [field, value] of Object.entries(hash)) {
                try {
                    parsed[field] = JSON.parse(value);
                }
                catch {
                    parsed[field] = value;
                }
            }
            return parsed;
        }
        catch (error) {
            logger.error('Cache hGetAll error', { error: error.message, key });
            return {};
        }
    }
    async warmCoursesCache(courses) {
        try {
            const promises = courses.map(course => this.set(`course:${course.id}`, course, 1800));
            await Promise.all(promises);
            logger.info('Courses cache warmed', { count: courses.length });
        }
        catch (error) {
            logger.error('Error warming courses cache', { error: error.message });
        }
    }
    async warmUserProgressCache(userCode, progressData) {
        try {
            await this.set(`progress:${userCode}`, progressData, 600);
            logger.debug('User progress cache warmed', { userCode });
        }
        catch (error) {
            logger.error('Error warming user progress cache', { error: error.message, userCode });
        }
    }
    async invalidateUserCache(userCode) {
        try {
            const pattern = `*:${userCode}:*`;
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
                logger.info('User cache invalidated', { userCode, keysDeleted: keys.length });
            }
        }
        catch (error) {
            logger.error('Error invalidating user cache', { error: error.message, userCode });
        }
    }
    async invalidateCourseCache(courseId) {
        try {
            const keys = [
                `course:${courseId}`,
                `course:${courseId}:modules`,
                `course:${courseId}:quiz`
            ];
            await this.client.del(keys);
            logger.info('Course cache invalidated', { courseId });
        }
        catch (error) {
            logger.error('Error invalidating course cache', { error: error.message, courseId });
        }
    }
    async setUSSDSession(sessionId, sessionData, ttl = 300) {
        return this.hSet(`ussd:${sessionId}`, 'data', sessionData, ttl);
    }
    async getUSSDSession(sessionId) {
        return this.hGet(`ussd:${sessionId}`, 'data');
    }
    async deleteUSSDSession(sessionId) {
        return this.del(`ussd:${sessionId}`);
    }
    async checkRateLimit(key, limit, windowMs) {
        try {
            if (!this.isReady()) {
                return { allowed: true, remaining: limit };
            }
            const current = await this.client.incr(key);
            if (current === 1) {
                await this.client.expire(key, Math.ceil(windowMs / 1000));
            }
            const ttl = await this.client.ttl(key);
            const remaining = Math.max(0, limit - current);
            return {
                allowed: current <= limit,
                remaining,
                resetTime: Date.now() + (ttl * 1000)
            };
        }
        catch (error) {
            logger.error('Rate limit check error', { error: error.message, key });
            return { allowed: true, remaining: limit };
        }
    }
    async getStats() {
        try {
            if (!this.isReady()) {
                return { connected: false };
            }
            const info = await this.client.info('memory');
            const keyspace = await this.client.info('keyspace');
            return {
                connected: true,
                memory: this.parseMemoryInfo(info),
                keyspace: this.parseKeyspaceInfo(keyspace)
            };
        }
        catch (error) {
            logger.error('Error getting Redis stats', { error: error.message });
            return { connected: false, error: error.message };
        }
    }
    parseMemoryInfo(info) {
        const memory = {};
        const lines = info.split('\r\n');
        for (const line of lines) {
            if (line.startsWith('used_memory_human:')) {
                memory.used = line.split(':')[1];
            }
            else if (line.startsWith('used_memory_peak_human:')) {
                memory.peak = line.split(':')[1];
            }
        }
        return memory.used && memory.peak ? memory : undefined;
    }
    parseKeyspaceInfo(info) {
        const keyspace = {};
        const lines = info.split('\r\n');
        for (const line of lines) {
            if (line.startsWith('db')) {
                const [db, stats] = line.split(':');
                const matches = stats.match(/keys=(\d+),expires=(\d+)/);
                if (matches) {
                    keyspace[db] = {
                        keys: parseInt(matches[1]),
                        expires: parseInt(matches[2])
                    };
                }
            }
        }
        return Object.keys(keyspace).length > 0 ? keyspace : undefined;
    }
    async healthCheck() {
        try {
            if (!this.isReady()) {
                return { status: 'unhealthy', error: 'Redis not connected' };
            }
            const start = Date.now();
            await this.client.ping();
            const latency = Date.now() - start;
            return { status: 'healthy', latency };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
    async clearAll() {
        try {
            if (!this.isReady()) {
                return false;
            }
            await this.client.flushDb();
            logger.info('All cache cleared');
            return true;
        }
        catch (error) {
            logger.error('Error clearing cache', { error: error.message });
            return false;
        }
    }
    async getKeysByPattern(pattern) {
        try {
            if (!this.isReady()) {
                return [];
            }
            return await this.client.keys(pattern);
        }
        catch (error) {
            logger.error('Error getting keys by pattern', { error: error.message, pattern });
            return [];
        }
    }
    async mSet(entries) {
        try {
            if (!this.isReady()) {
                return false;
            }
            const pipeline = this.client.multi();
            entries.forEach(({ key, value, ttl }) => {
                const serializedValue = JSON.stringify(value);
                pipeline.setEx(key, ttl || 3600, serializedValue);
            });
            await pipeline.exec();
            logger.debug('Batch cache set successful', { count: entries.length });
            return true;
        }
        catch (error) {
            logger.error('Batch cache set error', { error: error.message });
            return false;
        }
    }
    async mGet(keys) {
        try {
            if (!this.isReady()) {
                return keys.map(() => null);
            }
            const values = await this.client.mGet(keys);
            return values.map(value => {
                if (!value)
                    return null;
                try {
                    return JSON.parse(value);
                }
                catch {
                    return value;
                }
            });
        }
        catch (error) {
            logger.error('Batch cache get error', { error: error.message });
            return keys.map(() => null);
        }
    }
}
exports.CacheService = CacheService;
const cacheService = new CacheService();
exports.default = cacheService;
//# sourceMappingURL=cache.js.map