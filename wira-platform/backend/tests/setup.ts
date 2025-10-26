// Test setup file for Jest
import path from 'path'

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-32-characters-long'
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-123456'
process.env.CORS_ORIGIN = 'http://localhost:3000'
process.env.RATE_LIMIT_WINDOW_MS = '900000'
process.env.RATE_LIMIT_MAX_REQUESTS = '100'
process.env.DATABASE_PATH = path.join(__dirname, '../data/test-wira.db')
process.env.LOG_LEVEL = 'error' // Reduce log noise during tests

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

// Global test timeout
jest.setTimeout(10000)

// Setup and teardown hooks
beforeAll(async (): Promise<void> => {
  // Setup test database
  // Dynamic import to avoid TypeScript errors during build
  try {
    const { default: db } = await import('../src/database')

    // Wait a bit for database initialization
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.warn('Database setup skipped for tests:', error)
  }
})

afterAll(async (): Promise<void> => {
  // Cleanup test database
  const fs = await import('fs')
  const testDbPath = process.env.DATABASE_PATH || ''

  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath)
  }
})

beforeEach((): void => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

// Global test utilities
export const createMockRequest = (overrides: any = {}) => ({
  ip: '127.0.0.1',
  get: jest.fn(),
  headers: {},
  body: {},
  params: {},
  query: {},
  ...overrides
})

export const createMockResponse = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.setHeader = jest.fn().mockReturnValue(res)
  return res
}

export const createMockNext = () => jest.fn()

// Mock Redis for tests
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    ping: jest.fn().mockResolvedValue('PONG'),
    get: jest.fn().mockResolvedValue(null),
    setEx: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    exists: jest.fn().mockResolvedValue(0),
    keys: jest.fn().mockResolvedValue([]),
    expire: jest.fn().mockResolvedValue(1),
    incr: jest.fn().mockResolvedValue(1),
    ttl: jest.fn().mockResolvedValue(3600),
    hSet: jest.fn().mockResolvedValue(1),
    hGet: jest.fn().mockResolvedValue(null),
    hGetAll: jest.fn().mockResolvedValue({}),
    info: jest.fn().mockResolvedValue(''),
    multi: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([])
    }),
    mGet: jest.fn().mockResolvedValue([]),
    flushDb: jest.fn().mockResolvedValue('OK'),
    quit: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    isOpen: true
  }))
}))

// Mock Winston logger
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn()
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn()
  }
}))

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}))

// Extend Jest matchers
expect.extend({
  toBeValidUser (received) {
    const pass = received &&
      typeof received.anonymous_code === 'string' &&
      /^V\d{4}$/.test(received.anonymous_code) &&
      typeof received.ngo_id === 'string'

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid user`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid user with anonymous_code (V####) and ngo_id`,
        pass: false
      }
    }
  },

  toBeValidCourse (received) {
    const pass = received &&
      typeof received.id === 'string' &&
      typeof received.title === 'string' &&
      typeof received.duration_hours === 'number' &&
      typeof received.modules_count === 'number'

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid course`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid course with id, title, duration_hours, and modules_count`,
        pass: false
      }
    }
  },

  toBeEncrypted (received) {
    const pass = received &&
      typeof received === 'object' &&
      typeof received.iv === 'string' &&
      typeof received.tag === 'string' &&
      typeof received.encryptedData === 'string'

    if (pass) {
      return {
        message: () => `expected ${received} not to be encrypted data`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be encrypted data with iv, tag, and encryptedData`,
        pass: false
      }
    }
  }
})

// Declare the custom matchers for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUser (): R
      toBeValidCourse (): R
      toBeEncrypted (): R
    }
  }
}