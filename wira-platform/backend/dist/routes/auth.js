"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const security_1 = require("../middleware/security");
const database_1 = require("../database");
const router = express_1.default.Router();
router.post('/login', security_1.authLimiter, security_1.validateLogin, security_1.handleValidationErrors, async (req, res) => {
    const { code } = req.body;
    const normalizedCode = code.toUpperCase();
    security_1.logger.info('Login attempt', {
        anonymousCode: normalizedCode,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    try {
        const row = await (0, database_1.get)('SELECT * FROM users WHERE anonymous_code = ?', [normalizedCode]);
        if (!row) {
            security_1.logger.warn('Login attempt with invalid code', {
                anonymousCode: normalizedCode,
                ip: req.ip
            });
            res.status(401).json({
                error: 'Código de acesso inválido'
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            anonymousCode: row.anonymous_code,
            ngoId: row.ngo_id,
            sessionId: Math.random().toString(36).substring(2, 15)
        }, process.env.JWT_SECRET, {
            expiresIn: '24h',
            issuer: 'wira-platform',
            audience: 'wira-app'
        });
        const safeUser = {
            anonymousCode: row.anonymous_code,
            ngoId: row.ngo_id,
            createdAt: row.created_at
        };
        security_1.logger.info('Successful login', {
            anonymousCode: normalizedCode,
            ngoId: row.ngo_id,
            ip: req.ip
        });
        const response = {
            success: true,
            token,
            user: safeUser,
            expiresIn: '24h'
        };
        res.json(response);
    }
    catch (error) {
        security_1.logger.error('Database error during login', {
            error: error.message,
            anonymousCode: normalizedCode
        });
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});
router.post('/validate', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({
            error: 'Token não fornecido'
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        security_1.logger.info('Token validation successful', {
            anonymousCode: decoded.anonymousCode,
            sessionId: decoded.sessionId
        });
        res.json({
            success: true,
            valid: true,
            user: {
                anonymousCode: decoded.anonymousCode,
                ngoId: decoded.ngoId
            }
        });
    }
    catch (error) {
        security_1.logger.warn('Invalid token validation attempt', {
            error: error.message,
            ip: req.ip
        });
        res.status(401).json({
            error: 'Token inválido ou expirado'
        });
    }
});
router.post('/refresh', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({
            error: 'Token não fornecido'
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: true
        });
        const newToken = jsonwebtoken_1.default.sign({
            anonymousCode: decoded.anonymousCode,
            ngoId: decoded.ngoId,
            sessionId: Math.random().toString(36).substring(2, 15)
        }, process.env.JWT_SECRET, {
            expiresIn: '24h',
            issuer: 'wira-platform',
            audience: 'wira-app'
        });
        security_1.logger.info('Token refreshed', {
            anonymousCode: decoded.anonymousCode,
            ip: req.ip
        });
        res.json({
            success: true,
            token: newToken,
            expiresIn: '24h'
        });
    }
    catch (error) {
        security_1.logger.warn('Token refresh failed', {
            error: error.message,
            ip: req.ip
        });
        res.status(401).json({
            error: 'Token inválido'
        });
    }
});
router.delete('/logout', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            security_1.logger.info('User logout', {
                anonymousCode: decoded.anonymousCode,
                ip: req.ip
            });
        }
        catch (error) {
            security_1.logger.warn('Logout with invalid token', {
                error: error.message,
                ip: req.ip
            });
        }
    }
    res.json({
        success: true,
        message: 'Logout realizado com sucesso'
    });
});
router.get('/check/:code', async (req, res) => {
    const { code } = req.params;
    const normalizedCode = code.toUpperCase();
    if (!/^V\d{4}$/i.test(normalizedCode)) {
        res.status(400).json({
            error: 'Código deve estar no formato V####'
        });
        return;
    }
    try {
        const row = await (0, database_1.get)('SELECT anonymous_code, created_at FROM users WHERE anonymous_code = ?', [normalizedCode]);
        res.json({
            success: true,
            available: !row,
            code: normalizedCode,
            exists: !!row,
            createdAt: row?.created_at || null
        });
    }
    catch (error) {
        security_1.logger.error('Database error checking code', {
            error: error.message,
            code: normalizedCode
        });
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map