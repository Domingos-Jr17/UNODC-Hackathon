require('dotenv').config(); // Load environment variables first

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import secure routes and middleware
const authRoutes = require('./routes/auth.routes.secure');
const coursesRoutes = require('./routes/courses.routes');
const progressRoutes = require('./routes/progress.routes');
const certificatesRoutes = require('./routes/certificates.routes');
const ussdRoutes = require('./routes/ussd.routes');

// Import secure database and middleware
const { db, logAudit } = require('./database/db.secure');
const {
  logger,
  generalLimiter,
  ussdLimiter,
  requestLogger,
  corsOptions
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

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
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// General rate limiting for all API routes
app.use('/api/', generalLimiter);

// Routes with specific rate limiting
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/ussd', ussdLimiter, ussdRoutes);

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
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
  };

  // Check database connection
  db.get('SELECT 1 as test', [], (err) => {
    if (err) {
      healthCheck.services.database = 'error';
      healthCheck.status = 'DEGRADED';
      healthCheck.databaseError = err.message;
    }

    const statusCode = healthCheck.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  });
});

// Security information endpoint (for monitoring)
app.get('/api/security/info', (req, res) => {
  res.json({
    security: {
      rateLimiting: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
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
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'WIRA Platform API',
    version: '2.0.0',
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
        'GET /api/courses/:id/quiz': 'Obter quiz do curso'
      },
      certificates: {
        'POST /api/certificates/generate': 'Gerar certificado',
        'GET /api/certificates/:code/verify': 'Verificar certificado'
      },
      progress: {
        'GET /api/progress/:code': 'Obter progresso do usuário',
        'POST /api/progress/update': 'Atualizar progresso'
      },
      ussd: {
        'POST /api/ussd': 'Endpoint USSD principal',
        'POST /api/ussd/test': 'Testar USSD',
        'GET /api/ussd/status': 'Status do serviço USSD'
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
      validation: 'Strict'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn('404 Not Found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: 'Erro interno do servidor',
    message: isDevelopment ? err.message : 'Ocorreu um erro inesperado',
    requestId: req.id,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}, starting graceful shutdown`);

  server.close(() => {
    logger.info('HTTP server closed');

    // Close database connection
    db.close((err) => {
      if (err) {
        logger.error('Error closing database', { error: err.message });
      } else {
        logger.info('Database connection closed');
      }

      process.exit(0);
    });
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Start server
const server = app.listen(PORT, () => {
  logger.info('🚀 WIRA Platform Secure Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    memory: process.memoryUsage()
  });

  logger.info('📊 Service endpoints available', {
    health: `http://localhost:${PORT}/health`,
    api: `http://localhost:${PORT}/api`,
    ussdTest: `http://localhost:${PORT}/api/ussd/test`,
    securityInfo: `http://localhost:${PORT}/api/security/info`
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason.toString(),
    promise: promise.toString()
  });
  process.exit(1);
});

module.exports = app;