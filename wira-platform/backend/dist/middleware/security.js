"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.maskSensitiveData = exports.validateAnonymousCode = exports.ipRateLimit = exports.userRateLimit = exports.notFoundHandler = exports.productionErrorHandler = exports.developmentErrorHandler = exports.errorLogger = exports.requestId = exports.securityHeaders = exports.sanitizeInput = exports.authenticateToken = exports.corsOptions = exports.requestLogger = exports.handleValidationErrors = exports.validateQuizSubmission = exports.validateCertificateGeneration = exports.validateLogin = exports.ussdLimiter = exports.generalLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_validator_1 = require("express-validator");
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston_1.default.transports.File({
            filename: 'logs/app.log'
        })
    ]
});
exports.logger = logger;
const createRateLimit = (windowMs, max, message) => {
    return (0, express_rate_limit_1.default)({
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
exports.authLimiter = createRateLimit(15 * 60 * 1000, 5, 'Muitas tentativas de login. Tente novamente em 15 minutos.');
exports.generalLimiter = createRateLimit(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), 'Muitas requisições. Tente novamente mais tarde.');
exports.ussdLimiter = createRateLimit(5 * 60 * 1000, 20, 'Muitas requisições USSD. Tente novamente em 5 minutos.');
exports.validateLogin = [
    (0, express_validator_1.body)('code')
        .matches(/^V\d{4}$/i)
        .withMessage('Código de acesso deve estar no formato V#### (ex: V0042)')
        .isLength({ min: 5, max: 5 })
        .withMessage('Código deve ter exatamente 5 caracteres')
];
exports.validateCertificateGeneration = [
    (0, express_validator_1.body)('anonymousCode')
        .matches(/^V\d{4}$/i)
        .withMessage('Código anônimo inválido'),
    (0, express_validator_1.body)('courseId')
        .isIn(['costura', 'culinaria', 'agricultura'])
        .withMessage('ID de curso inválido'),
    (0, express_validator_1.body)('score')
        .isInt({ min: 0, max: 100 })
        .withMessage('Pontuação deve ser entre 0 e 100')
];
exports.validateQuizSubmission = [
    (0, express_validator_1.body)('code')
        .matches(/^V\d{4}$/i)
        .withMessage('Código de acesso inválido'),
    (0, express_validator_1.body)('courseId')
        .isIn(['costura', 'culinaria', 'agricultura'])
        .withMessage('ID de curso inválido'),
    (0, express_validator_1.body)('answers')
        .isArray({ min: 1 })
        .withMessage('Respostas devem ser um array com pelo menos um elemento'),
    (0, express_validator_1.body)('answers.*')
        .isInt({ min: 0 })
        .withMessage('Cada resposta deve ser um número inteiro')
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation error', {
            errors: errors.array(),
            ip: req.ip,
            route: req.path
        });
        res.status(400).json({
            error: 'Dados inválidos',
            details: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        });
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
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
exports.requestLogger = requestLogger;
exports.corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
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
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            error: 'Token de autenticação não fornecido'
        });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET || '', (err, user) => {
        if (err) {
            logger.warn('Invalid token attempt', {
                error: err.message,
                ip: req.ip,
                token: token.substring(0, 10) + '...'
            });
            res.status(403).json({
                error: 'Token inválido ou expirado'
            });
            return;
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const sanitizeInput = (req, res, next) => {
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }
    next();
};
exports.sanitizeInput = sanitizeInput;
const securityHeaders = (req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
};
exports.securityHeaders = securityHeaders;
const requestId = (req, res, next) => {
    req.id = Math.random().toString(36).substring(2, 15);
    res.setHeader('X-Request-ID', req.id);
    next();
};
exports.requestId = requestId;
const errorLogger = (err, req, res, next) => {
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestId: req.id
    });
    next(err);
};
exports.errorLogger = errorLogger;
const developmentErrorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        res.status(err.status || 500).json({
            error: 'Erro interno do servidor',
            message: err.message,
            stack: err.stack,
            requestId: req.id
        });
    }
    else {
        next(err);
    }
};
exports.developmentErrorHandler = developmentErrorHandler;
const productionErrorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        res.status(err.status || 500).json({
            error: 'Erro interno do servidor',
            requestId: req.id
        });
    }
    else {
        next(err);
    }
};
exports.productionErrorHandler = productionErrorHandler;
const notFoundHandler = (req, res) => {
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
};
exports.notFoundHandler = notFoundHandler;
const userRateLimit = (max, windowMs) => {
    return async (req, res, next) => {
        if (!req.user) {
            return next();
        }
        const userKey = `user_rate_limit_${req.user.anonymousCode}_${Math.floor(Date.now() / windowMs)}`;
        next();
    };
};
exports.userRateLimit = userRateLimit;
const ipRateLimit = (max, windowMs) => {
    return createRateLimit(windowMs, max, 'Muitas tentativas deste IP. Tente novamente mais tarde.');
};
exports.ipRateLimit = ipRateLimit;
const validateAnonymousCode = (code) => {
    return /^V\d{4}$/i.test(code.toUpperCase());
};
exports.validateAnonymousCode = validateAnonymousCode;
const maskSensitiveData = (data) => {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    const masked = { ...data };
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'real_name', 'phone', 'email'];
    sensitiveFields.forEach(field => {
        if (masked[field]) {
            const value = String(masked[field]);
            if (value.length > 4) {
                masked[field] = value.substring(0, 2) + '***' + value.substring(value.length - 2);
            }
            else {
                masked[field] = '***';
            }
        }
    });
    return masked;
};
exports.maskSensitiveData = maskSensitiveData;
//# sourceMappingURL=security.js.map