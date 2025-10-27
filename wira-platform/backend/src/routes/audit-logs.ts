import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/security';
import AuditLogController from '../controllers/AuditLogController';

const router = express.Router();

// Get all audit logs with filtering
router.get('/', authenticateToken, AuditLogController.getAll);

// Get audit logs by user
router.get('/user/:userCode', authenticateToken, AuditLogController.getByUser);

// Get audit logs by action
router.get('/action/:action', authenticateToken, AuditLogController.getByAction);

// Get audit logs by table
router.get('/table/:tableName', authenticateToken, AuditLogController.getByTable);

// Create audit log
router.post('/', authenticateToken, AuditLogController.create);

// Get audit log statistics
router.get('/stats', authenticateToken, AuditLogController.getStats);

export default router;