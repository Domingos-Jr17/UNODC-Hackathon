import express, { Request, Response } from 'express';
import { 
  authLimiter, 
  validateLogin, 
  handleValidationErrors 
} from '../middleware/security';
import AuthController from '../controllers/AuthController';

const router = express.Router();

/**
 * Login with anonymous code
 * POST /api/auth/login
 */
router.post('/login', authLimiter, validateLogin, handleValidationErrors, AuthController.login);

/**
 * Validate JWT token
 * POST /api/auth/validate
 */
router.post('/validate', AuthController.validate);

/**
 * Refresh token
 * POST /api/auth/refresh
 */
router.post('/refresh', AuthController.refresh);

/**
 * Logout
 * DELETE /api/auth/logout
 */
router.delete('/logout', AuthController.logout);

/**
 * Check if code is available (for admin use)
 * GET /api/auth/check/:code
 */
router.get('/check/:code', AuthController.checkAvailability);

export default router;