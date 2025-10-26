const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const winston = require('winston');

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
});

// Rate limiting middleware
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        route: req.path
      });

      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per 15 minutes
  'Muitas tentativas de login. Tente novamente em 15 minutos.'
);

const generalLimiter = createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per 15 minutes
  'Muitas requisições. Tente novamente mais tarde.'
);

const ussdLimiter = createRateLimit(
  5 * 60 * 1000, // 5 minutes
  20, // 20 USSD requests per 5 minutes
  'Muitas requisições USSD. Tente novamente em 5 minutos.'
);

// Input validation rules
const validateLogin = [
  body('code')
    .matches(/^V\d{4}$/i)
    .withMessage('Código de acesso deve estar no formato V#### (ex: V0042)')
    .isLength({ min: 5, max: 5 })
    .withMessage('Código deve ter exatamente 5 caracteres'),
];

const validateCertificateGeneration = [
  body('anonymousCode')
    .matches(/^V\d{4}$/i)
    .withMessage('Código anônimo inválido'),
  body('courseId')
    .isIn(['costura', 'culinaria', 'agricultura'])
    .withMessage('ID de curso inválido'),
  body('score')
    .isInt({ min: 0, max: 100 })
    .withMessage('Pontuação deve ser entre 0 e 100'),
];

const validateQuizSubmission = [
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
    .withMessage('Cada resposta deve ser um número inteiro'),
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn('Validation error', {
      errors: errors.array(),
      ip: req.ip,
      route: req.path
    });

    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }

  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });

  next();
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn('CORS violation', {
        origin,
        ip: req.ip
      });
      callback(new Error('Não permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = {
  logger,
  authLimiter,
  generalLimiter,
  ussdLimiter,
  validateLogin,
  validateCertificateGeneration,
  validateQuizSubmission,
  handleValidationErrors,
  requestLogger,
  corsOptions
};