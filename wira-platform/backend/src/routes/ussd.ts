import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/security';

const router = express.Router();

/**
 * USSD Main Endpoint
 * POST /api/ussd
 * Process USSD requests from telecom operators
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, serviceCode: _serviceCode, phoneNumber: _phoneNumber, text: _text } = req.body;

    // In a real implementation, this would process the USSD request
    // For now, we'll send a mock response

    const response = `CON WIRA - Women's Integrated Reintegration Academy
  
Bem-vinda ao WIRA!
  
Seu código de acesso (ex: V0042):`;

    res.json({
      success: true,
      response,
      sessionId: sessionId || 'mock-session-id',
      step: 'welcome'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro no processamento USSD'
    });
  }
});

/**
 * USSD Status Endpoint
 * GET /api/ussd/status
 * Get USSD service status
 */
router.get('/status', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    service: 'WIRA USSD Service',
    status: 'Online',
    shortcode: '*123#',
    sessionTimeout: '5 minutos',
    activeSessions: 0,
    timestamp: new Date().toISOString()
  });
});

/**
 * SMS Status Endpoint
 * GET /api/sms/status
 * Get SMS service status
 */
router.get('/sms/status', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    service: 'WIRA SMS Service',
    status: 'Online (Mock)',
    totalSent: 0,
    recentMessages: [],
    timestamp: new Date().toISOString()
  });
});

/**
 * Send SMS Endpoint
 * POST /api/sms/send
 * Send an SMS message
 */
router.post('/sms/send', authenticateToken, (req: Request, res: Response): void => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    res.status(400).json({
      success: false,
      error: 'phoneNumber and message are required'
    });
    return;
  }

  // In a real implementation, this would send an actual SMS
  // For now, we'll simulate the response

  res.json({
    success: true,
    message: 'SMS sent successfully (mock)',
    sms: {
      id: Date.now(),
      to: phoneNumber,
      message: message,
      sentAt: new Date().toISOString(),
      status: 'sent (mock)',
      provider: 'mock-sms-provider'
    }
  });
});

export default router;
