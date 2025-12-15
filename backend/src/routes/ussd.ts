import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/security';
import { get, all } from '../database';

const router = express.Router();

// Mock session storage (in production, use Redis)
const sessions = new Map<string, any>();

// USSD session timeout (5 minutes)
const SESSION_TIMEOUT = 5 * 60 * 1000;

// Helper functions
function cleanExpiredSessions(): void {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_TIMEOUT) {
      sessions.delete(sessionId);
    }
  }
}

function createOrGetSession(phoneNumber: string): any {
  cleanExpiredSessions();

  // Try to find existing session for this phone number
  let existingSession = null;
  for (const [, session] of sessions.entries()) {
    if (session.phoneNumber === phoneNumber) {
      existingSession = session;
      break;
    }
  }

  if (existingSession) {
    existingSession.lastActivity = Date.now();
    return existingSession;
  }

  // Create new session if none exists
  const sessionId = `session_${phoneNumber}_${Date.now()}`;
  const session = {
    sessionId,
    phoneNumber,
    step: 'welcome',
    userCode: null,
    lastActivity: Date.now()
  };
  sessions.set(sessionId, session);
  return session;
}

async function validateUserCode(userCode: string): Promise<any> {
  try {
    const user = await get('SELECT anonymous_code, real_name FROM users WHERE anonymous_code = ?', [userCode]);
    return user;
  } catch (error) {
    return null;
  }
}

async function getUserProgress(userCode: string): Promise<any[]> {
  try {
    const progress = await all(`
      SELECT p.*, c.title, c.modules_count, c.duration_hours
      FROM progress p
      JOIN courses c ON p.course_id = c.id
      WHERE p.user_code = ?
    `, [userCode]);
    return progress;
  } catch (error) {
    return [];
  }
}

/**
 * USSD Test Endpoint
 * POST /api/ussd/test
 * Simulate USSD requests for testing
 */
router.post('/test', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber = '+258840000000', text = '' } = req.body;

    // Create or get session
    const session = createOrGetSession(phoneNumber);

    let response = '';
    const inputs = text ? text.split('*') : [];

    if (inputs.length === 0 || !inputs[0]) {
      // Welcome screen
      response = `CON WIRA - Women's Integrated Reintegration Academy

Bem-vinda ao WIRA!

Seu código de acesso (ex: V0042):`;
      session.step = 'login';

    } else if (session.step === 'login' || (inputs.length === 1 && inputs[0].toUpperCase().startsWith('V'))) {
      // Login validation
      const userCode = inputs[0].toUpperCase();
      const user = await validateUserCode(userCode);

      if (user) {
        session.userCode = userCode;
        session.step = 'main_menu';

        response = `CON Bem-vinda, ${userCode}!

Como podemos ajudar?
1. Meus Cursos
2. Meu Progresso
3. Ajuda
4. Sair`;
      } else {
        response = `CON Código inválido!

Tente novamente (ex: V0042):
Ou digite 4 para Sair`;
      }

    } else if ((session.step === 'main_menu' || session.step === 'courses_menu' || session.step === 'progress_menu' || session.step === 'help_menu') && inputs.length >= 2) {
      const choice = inputs[inputs.length - 1];

      switch (choice) {
        case '1':
          // Courses menu
          const progress = await getUserProgress(session.userCode);

          if (progress.length > 0) {
            response = `CON SEUS CURSOS:\n\n`;
            progress.forEach((course, index) => {
              response += `${index + 1}. ${course.title}\n`;
              response += `   Progresso: ${course.percentage}% completo\n\n`;
            });
            response += `0. Voltar ao menu principal`;
          } else {
            response = `CON Você ainda não tem cursos.\n\nEntre contato com sua ONG.\n\n0. Voltar`;
          }
          session.step = 'courses_menu';
          break;

        case '2':
          // Progress overview
          const userProgress = await getUserProgress(session.userCode);
          const totalModules = userProgress.reduce((sum, p) => sum + (p.completed_modules ? JSON.parse(p.completed_modules).length : 0), 0);
          const totalCourses = userProgress.length;
          const avgProgress = totalCourses > 0 ? Math.round(userProgress.reduce((sum, p) => sum + p.percentage, 0) / totalCourses) : 0;

          response = `CON PROGRESSO GERAL - ${session.userCode}

Cursos Ativos: ${totalCourses}
Módulos Completos: ${totalModules}
Progresso Médio: ${avgProgress}%

Última atividade: Hoje

0. Voltar ao menu`;
          session.step = 'progress_menu';
          break;

        case '3':
          // Help menu
          response = `CON WIRA - CENTRAL DE AJUDA

Estamos aqui para ajudar!

Códigos de Acesso:
• Formato: V#### (ex: V0042)
• Fornecido pela sua ONG

Suporte:
• Telefone: +258 84 123 4567
• WhatsApp: +258 84 123 4567
• Email: ajuda@wira.org

Horário: Seg-Sex, 8h-17h

0. Voltar ao menu principal`;
          session.step = 'help_menu';
          break;

        case '4':
          // Exit
          response = `END Obrigado por usar WIRA!

Para capacitação profissional e
reintegração econômica.

WIRA - Transformando vidas`;
          sessions.delete(session.sessionId);
          break;

        default:
          response = `CON Opção inválida!

Como podemos ajudar?
1. Meus Cursos
2. Meu Progresso
3. Ajuda
4. Sair`;
          break;
      }

    } else {
      // Handle other menu navigations
      const choice = inputs[inputs.length - 1];

      if (choice === '0') {
        // Go back to main menu
        response = `CON Bem-vinda, ${session.userCode}!

Como podemos ajudar?
1. Meus Cursos
2. Meu Progresso
3. Ajuda
4. Sair`;
        session.step = 'main_menu';
      } else {
        response = `END Sessão expirada.

Digite *123# para começar novamente.`;
        sessions.delete(session.sessionId);
      }
    }

    // Update session
    sessions.set(session.sessionId, session);

    res.json({
      success: true,
      response,
      sessionId: session.sessionId,
      step: session.step,
      userCode: session.userCode
    });

  } catch (error) {
    console.error('USSD Test Error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro no processamento USSD'
    });
  }
});

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
router.post('/sms/send', (req: Request, res: Response): void => {
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
