import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/security';
import CertificateController from '../controllers/CertificateController';

const router = express.Router();

// Generate certificate
router.post('/generate', authenticateToken, CertificateController.generate);

// Verify certificate
router.get('/verify/:code', CertificateController.verify);

// Revoke certificate
router.post('/revoke/:code', authenticateToken, CertificateController.revoke);

// Get certificate by user and course
router.get('/user/:anonymousCode/course/:courseId', authenticateToken, CertificateController.getByUserAndCourse);

// Admin routes
router.post('/', authenticateToken, CertificateController.create);
router.put('/:code', authenticateToken, CertificateController.update);
router.delete('/:code', authenticateToken, CertificateController.delete);

export default router;