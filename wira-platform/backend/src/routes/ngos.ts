import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/security';
import NGOController from '../controllers/NGOController';

const router = express.Router();

// Get all NGOs
router.get('/', authenticateToken, NGOController.getAll);

// Get NGO by ID
router.get('/:id', authenticateToken, NGOController.getById);

// Create NGO
router.post('/', authenticateToken, NGOController.create);

// Update NGO
router.put('/:id', authenticateToken, NGOController.update);

// Deactivate NGO
router.patch('/:id/deactivate', authenticateToken, NGOController.deactivate);

// Delete NGO
router.delete('/:id', authenticateToken, NGOController.delete);

export default router;