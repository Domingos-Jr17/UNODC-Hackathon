import rateLimit from 'express-rate-limit'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import winston from 'winston'
import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@/types'

// Logger configuration
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
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/app.log'
    })
  ]
})

// Rate limiting middleware factory
const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        route: req.path
      })

      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      })
    }
  })
}

// Different rate limits for different endpoints
export const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per 15 minutes
  'Muitas tentativas de login. Tente novamente em 15 minutos.'
)

export const generalLimiter = createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per 15 minutes
  'Muitas requisições. Tente novamente mais tarde.'
)

export const ussdLimiter = createRateLimit(
  5 * 60 * 1000, // 5 minutes
  20, // 20 USSD requests per 5 minutes
  'Muitas requisições USSD. Tente novamente em 5 minutos.'
)

// Input validation rules
export const validateLogin: ValidationChain[] = [
  body('code')
    .matches(/^V\d{4}$/i)
    .withMessage('Código de acesso deve estar no formato V#### (ex: V0042)')
    .isLength({ min: 5, max: 5 })
    .withMessage('Código deve ter exatamente 5 caracteres')
]

export const validateCertificateGeneration: ValidationChain[] = [
  body('anonymousCode')
    .matches(/^V\d{4}$/i)
    .withMessage('Código anônimo inválido'),
  body('courseId')
    .isIn(['costura', 'culinaria', 'agricultura'])
    .withMessage('ID de curso inválido'),
  body('score')
    .isInt({ min: 0, max: 100 })
    .withMessage('Pontuação deve ser entre 0 e 100')
]

export const validateQuizSubmission: ValidationChain[] = [
  body('code')
    .matches(/^V\d{4}$/i)
    .withMessage('Código de acesso inválido'),
  body('courseId')
    .isIn(['costura', 'culinaria', 'agricultura'])
    .withMessage('ID de curso inválido'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Respostas devem ser um array com pelo menos um elemento'),
  body('answers.*')
    .isInt({ min: 0 })
    .withMessage('Cada resposta deve ser um número inteiro')
]

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    logger.warn('Validation error', {
      errors: errors.array(),
      ip: req.ip,
      route: req.path
    })

    res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array().map((err: any) => ({
        field: err.param || err.path,
        message: err.msg,
        value: err.value
      }))
    })
    return
  }

  next()
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start

    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    })
  })

  next()
}

// CORS configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
    const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',')

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      logger.warn('CORS violation', {
        origin,
        ip: (req as any).ip
      })
      callback(new Error('Não permitido por CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

// JWT Authentication middleware
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({
      error: 'Token de autenticação não fornecido'
    })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err: any, user: any) => {
    if (err) {
      logger.warn('Invalid token attempt', {
        error: err.message,
        ip: req.ip,
        token: token.substring(0, 10) + '...'
      })

      res.status(403).json({
        error: 'Token inválido ou expirado'
      })
      return
    }

    req.user = user
    next()
  })
}

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string).trim()
      }
    })
  }

  // Sanitize body parameters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = (req.body[key] as string).trim()
      }
    })
  }

  next()
}

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Remove Express-powered-by header
  res.removeHeader('X-Powered-By')

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  next()
}

// Request ID middleware for tracking
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  req.id = Math.random().toString(36).substring(2, 15)
  res.setHeader('X-Request-ID', req.id)
  next()
}

// Error logging middleware
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: (req as any).id
  })

  next(err)
}

// Development error handler
export const developmentErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (process.env.NODE_ENV === 'development') {
    res.status(err.status || 500).json({
      error: 'Erro interno do servidor',
      message: err.message,
      stack: err.stack,
      requestId: (req as any).id
    })
  } else {
    next(err)
  }
}

// Production error handler
export const productionErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (process.env.NODE_ENV === 'production') {
    res.status(err.status || 500).json({
      error: 'Erro interno do servidor',
      requestId: (req as any).id
    })
  } else {
    next(err)
  }
}

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn('404 Not Found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  })
}

// Rate limiting by user (for authenticated routes)
export const userRateLimit = (max: number, windowMs: number) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next()
    }

    // In a real implementation, you would use Redis or a database to track user requests
    // For now, we'll use a simple in-memory approach for demonstration
    const userKey = `user_rate_limit_${req.user.anonymousCode}_${Math.floor(Date.now() / windowMs)}`

    // This would typically be stored in Redis
    // For demo purposes, we'll skip the actual implementation

    next()
  }
}

// IP-based rate limiting for sensitive operations
export const ipRateLimit = (max: number, windowMs: number) => {
  return createRateLimit(windowMs, max, 'Muitas tentativas deste IP. Tente novamente mais tarde.')
}

// Validate anonymous code format
export const validateAnonymousCode = (code: string): boolean => {
  return /^V\d{4}$/i.test(code.toUpperCase())
}

// Mask sensitive data for logging
export const maskSensitiveData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const masked = { ...data }

  // Mask common sensitive fields
  const sensitiveFields = ['password', 'token', 'key', 'secret', 'real_name', 'phone', 'email']

  sensitiveFields.forEach(field => {
    if (masked[field]) {
      const value = String(masked[field])
      if (value.length > 4) {
        masked[field] = value.substring(0, 2) + '***' + value.substring(value.length - 2)
      } else {
        masked[field] = '***'
      }
    }
  })

  return masked
}

// Export logger for use in other modules