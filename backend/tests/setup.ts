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
process.env.DATABASE_URL = `file:${path.join(__dirname, '../data/test-wira.db')}`;
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
  // Setup test database by running Prisma migrations and initializing data
  try {
    // Ensure we have a clean test database
    const fs = require('fs');
    const testDbPath = process.env.DATABASE_PATH;

    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    // Run Prisma migrations to create schema
    const { execSync } = require('child_process');
    execSync('npx prisma migrate deploy --skip-generate', { stdio: 'inherit' });

    // Import database to trigger initialization and sample data
    void require('../src/database');

    // Wait for database initialization to complete
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.warn('Test database setup warning:', error);
  }
});

afterAll(async () => {
  // Cleanup test database with retry logic
  const fs = require('fs');
  const testDbPath = process.env.DATABASE_PATH;

  if (fs.existsSync(testDbPath)) {
    try {
      fs.unlinkSync(testDbPath);
    } catch (error: any) {
      if (error.code === 'EBUSY') {
        // File is locked, try again after a delay
        setTimeout(() => {
          try {
            fs.unlinkSync(testDbPath);
          } catch (retryError) {
            // Log but don't fail the test suite
            console.warn('Could not delete test database file:', retryError);
          }
        }, 1000);
      }
    }
  }
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});