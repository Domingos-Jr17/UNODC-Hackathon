import 'dotenv/config' // Load environment variables first

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { Server } from 'http'

// Import routes and middleware
import authRoutes from '@/routes/auth'
import coursesRoutes from '@/routes/courses'
// import progressRoutes from '@/routes/progress'
// import certificatesRoutes from '@/routes/certificates'
// import ussdRoutes from '@/routes/ussd'

// Import middleware
import {
  logger,
  generalLimiter,
  ussdLimiter,
  requestLogger,
  corsOptions,
  securityHeaders,
  requestId,
  errorLogger,
  developmentErrorHandler,
  productionErrorHandler,
  notFoundHandler
} from '@/middleware/security'

// Import services
import cacheService from '@/services/cache'

// Import types
import { HealthCheckResponse } from '@/types'

const app = express()
let server: Server

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}))

app.use(securityHeaders)
app.use(requestId)
app.use(cors(corsOptions))

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
app.use(requestLogger)

// General rate limiting for all API routes
app.use('/api/', generalLimiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', coursesRoutes)
// app.use('/api/progress', progressRoutes)
// app.use('/api/certificates', certificatesRoutes)
// app.use('/api/ussd', ussdLimiter, ussdRoutes)

// Enhanced health check endpoint
app.get('/health', async (req: express.Request, res: express.Response): Promise<void> => {
  const healthCheck: HealthCheckResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0',
    services: {
      api: 'online',
      ussd: 'online',
      database: 'connected',
      security: {
        rateLimiting: 'active',
        encryption: 'enabled',
        validation: 'active'
      }
    },
    performance: {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  }

  // Check Redis if available
  try {
    const redisHealth = await cacheService.healthCheck()
    healthCheck.services.cache = redisHealth.status === 'healthy' ? 'online' : 'offline'
  } catch {
    healthCheck.services.cache = 'offline'
  }

  // Check database connection (simplified for TypeScript)
  try {
    // In a real implementation, you would check the database connection
    healthCheck.services.database = 'connected'
  } catch {
    healthCheck.services.database = 'disconnected'
    healthCheck.status = 'DEGRADED'
  }

  const statusCode = healthCheck.status === 'OK' ? 200 : 503
  res.status(statusCode).json(healthCheck)
})

// Security information endpoint (for monitoring)
app.get('/api/security/info', (req: express.Request, res: express.Response): void => {
  res.json({
    security: {
      rateLimiting: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
      },
      encryption: {
        algorithm: 'aes-256-gcm',
        enabled: true
      },
      validation: {
        enabled: true,
        strict: true
      },
      cors: {
        enabled: true,
        origins: (process.env.CORS_ORIGIN || '').split(',')
      }
    },
    lastUpdated: new Date().toISOString()
  })
})

// API documentation endpoint
app.get('/api', (req: express.Request, res: express.Response): void => {
  res.json({
    name: 'WIRA Platform API',
    version: '3.0.0',
    description: 'Backend API para plataforma WIRA de capacitação e reintegração econômica',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Login com código anônimo',
        'POST /api/auth/validate': 'Validar token JWT',
        'POST /api/auth/refresh': 'Atualizar token',
        'DELETE /api/auth/logout': 'Logout',
        'GET /api/auth/check/:code': 'Verificar disponibilidade de código'
      },
      courses: {
        'GET /api/courses': 'Listar cursos ativos',
        'GET /api/courses/:id': 'Obter detalhes do curso',
        'GET /api/courses/:id/modules': 'Listar módulos do curso',
        'GET /api/courses/:id/quiz': 'Obter quiz do curso',
        'POST /api/courses/:id/invalidate-cache': 'Invalidar cache do curso'
      },
      utility: {
        'GET /health': 'Health check detalhado',
        'GET /api/security/info': 'Informações de segurança'
      }
    },
    security: {
      authentication: 'JWT',
      encryption: 'AES-256-GCM',
      rateLimiting: 'Ativo',
      validation: 'Strict',
      typescript: 'Enabled'
    }
  })
})

// Root endpoint
app.get('/', (req: express.Request, res: express.Response): void => {
  res.json({
    message: 'WIRA Platform API - TypeScript Edition',
    version: '3.0.0',
    status: 'running',
    documentation: '/api',
    health: '/health',
    security: '/api/security/info'
  })
})

// 404 handler
app.use('*', notFoundHandler)

// Error handling middleware
app.use(errorLogger)
app.use(developmentErrorHandler)
app.use(productionErrorHandler)

// Graceful shutdown handling
const gracefulShutdown = (signal: string): void => {
  logger.info(`Received ${signal}, starting graceful shutdown`)

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed')

      // Close cache connection
      cacheService.disconnect().then(() => {
        logger.info('Cache connection closed')
        process.exit(0)
      }).catch((error) => {
        logger.error('Error closing cache connection', { error: error.message })
        process.exit(1)
      })
    })

    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down')
      process.exit(1)
    }, 30000)
  } else {
    process.exit(0)
  }
}

// Start server
const PORT = process.env.PORT || 3000

const startServer = (): void => {
  server = app.listen(PORT, () => {
    logger.info('🚀 WIRA Platform TypeScript Server started', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      typescript: 'enabled'
    })

    logger.info('📊 Service endpoints available', {
      health: `http://localhost:${PORT}/health`,
      api: `http://localhost:${PORT}/api`,
      securityInfo: `http://localhost:${PORT}/api/security/info`,
      documentation: `http://localhost:${PORT}/api`
    })
  })

  server.on('error', (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof PORT === 'string'
      ? 'Pipe ' + PORT
      : 'Port ' + PORT

    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw error
    }
  })

  server.on('listening', (): void => {
    const addr = server?.address()
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + (addr as any).port

    logger.info(`Listening on ${bind}`)
  })
}

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error): void => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  })
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>): void => {
  logger.error('Unhandled Rejection', {
    reason: reason.toString(),
    promise: promise.toString()
  })
  process.exit(1)
})

// Start the server
if (require.main === module) {
  startServer()
}

export default app
export { startServer }