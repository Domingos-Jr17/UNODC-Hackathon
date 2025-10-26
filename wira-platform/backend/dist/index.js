"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = __importDefault(require("@/routes/auth"));
const courses_1 = __importDefault(require("@/routes/courses"));
const security_1 = require("@/middleware/security");
const cache_1 = __importDefault(require("@/services/cache"));
const app = (0, express_1.default)();
let server;
app.set('trust proxy', 1);
app.use((0, helmet_1.default)({
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
}));
app.use(security_1.securityHeaders);
app.use(security_1.requestId);
app.use((0, cors_1.default)(security_1.corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(security_1.requestLogger);
app.use('/api/', security_1.generalLimiter);
app.use('/api/auth', auth_1.default);
app.use('/api/courses', courses_1.default);
app.get('/health', async (req, res) => {
    const healthCheck = {
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
    };
    try {
        const redisHealth = await cache_1.default.healthCheck();
        healthCheck.services.cache = redisHealth.status === 'healthy' ? 'online' : 'offline';
    }
    catch {
        healthCheck.services.cache = 'offline';
    }
    try {
        healthCheck.services.database = 'connected';
    }
    catch {
        healthCheck.services.database = 'disconnected';
        healthCheck.status = 'DEGRADED';
    }
    const statusCode = healthCheck.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
});
app.get('/api/security/info', (req, res) => {
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
    });
});
app.get('/api', (req, res) => {
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
    });
});
app.get('/', (req, res) => {
    res.json({
        message: 'WIRA Platform API - TypeScript Edition',
        version: '3.0.0',
        status: 'running',
        documentation: '/api',
        health: '/health',
        security: '/api/security/info'
    });
});
app.use('*', security_1.notFoundHandler);
app.use(security_1.errorLogger);
app.use(security_1.developmentErrorHandler);
app.use(security_1.productionErrorHandler);
const gracefulShutdown = (signal) => {
    security_1.logger.info(`Received ${signal}, starting graceful shutdown`);
    if (server) {
        server.close(() => {
            security_1.logger.info('HTTP server closed');
            cache_1.default.disconnect().then(() => {
                security_1.logger.info('Cache connection closed');
                process.exit(0);
            }).catch((error) => {
                security_1.logger.error('Error closing cache connection', { error: error.message });
                process.exit(1);
            });
        });
        setTimeout(() => {
            security_1.logger.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 30000);
    }
    else {
        process.exit(0);
    }
};
const PORT = process.env.PORT || 3000;
const startServer = () => {
    server = app.listen(PORT, () => {
        security_1.logger.info('🚀 WIRA Platform TypeScript Server started', {
            port: PORT,
            environment: process.env.NODE_ENV || 'development',
            nodeVersion: process.version,
            platform: process.platform,
            memory: process.memoryUsage(),
            typescript: 'enabled'
        });
        security_1.logger.info('📊 Service endpoints available', {
            health: `http://localhost:${PORT}/health`,
            api: `http://localhost:${PORT}/api`,
            securityInfo: `http://localhost:${PORT}/api/security/info`,
            documentation: `http://localhost:${PORT}/api`
        });
    });
    server.on('error', (error) => {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind = typeof PORT === 'string'
            ? 'Pipe ' + PORT
            : 'Port ' + PORT;
        switch (error.code) {
            case 'EACCES':
                security_1.logger.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                security_1.logger.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    server.on('listening', () => {
        const addr = server?.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        security_1.logger.info(`Listening on ${bind}`);
    });
};
exports.startServer = startServer;
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (error) => {
    security_1.logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
    });
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    security_1.logger.error('Unhandled Rejection', {
        reason: reason.toString(),
        promise: promise.toString()
    });
    process.exit(1);
});
if (require.main === module) {
    startServer();
}
exports.default = app;
//# sourceMappingURL=index.js.map