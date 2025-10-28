// Test setup file for Jest
import path from 'path';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-32-characters-long';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-123456';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';
process.env.DATABASE_PATH = path.join(__dirname, '../data/test-wira.db');
process.env.LOG_LEVEL = 'error'; // Reduce log noise during tests

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Global test timeout
jest.setTimeout(10000);

// Setup and teardown hooks
beforeAll(async () => {
  // Setup test database
  // Note: Database setup removed as it's causing issues - will be handled in individual tests if needed

  // Wait a bit for database initialization
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(async () => {
  // Cleanup test database
  const fs = require('fs');
  const testDbPath = process.env.DATABASE_PATH;

  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});