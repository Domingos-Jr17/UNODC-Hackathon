import express from 'express';
import cors from 'cors';
import {
  USSDRequest,
  USSDResponse,
  USSDSession,
  USSDStep,
  UserData,
  CourseData,
  SMSRecord,
  CourseProgress,
  USSDServiceStats,
  USSDHealthCheck,
  APIResponse,
  DemoSequenceResponse,
  HealthCheckResponse
} from './types/ussd';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock SMS Service
class SMSService {
  private sentMessages: SMSRecord[] = [];
  private readonly mockDelay = 1000; // 1 second delay

  async sendSMS(phoneNumber: string, message: string): Promise<SMSRecord> {
    console.log(`📱 Sending SMS to ${phoneNumber}: "${message}"`);

    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, this.mockDelay));

    const smsRecord: SMSRecord = {
      id: Date.now(),
      to: phoneNumber,
      message: message,
      sentAt: new Date().toISOString(),
      status: 'sent',
      provider: 'mock-sms-provider'
    };

    this.sentMessages.push(smsRecord);
    console.log(`✅ SMS sent successfully! ID: ${smsRecord.id}`);

    return smsRecord;
  }

  getSentMessages(): SMSRecord[] {
    return this.sentMessages;
  }

  // SMS Templates for different scenarios
  getWelcomeMessage(userName: string): string {
    return `Bem-vinda ${userName} ao WIRA! 📚\n\nSeu acesso foi ativado.\nUse *123# para acessar seus cursos.\n\nSupport: +258 84 123 4567`;
  }

  getProgressMessage(userName: string, courses: CourseProgress[]): string {
    let message = `📊 Seu Progresso - WIRA\n\nOlá ${userName}!\n\n`;

    courses.forEach(course => {
      message += `${course.name}: ${course.percentage}%\n`;
    });

    message += `\nContinue estudando! 💪\n*123# para detalhes`;

    return message;
  }

  getCertificateMessage(userName: string, courseName: string): string {
    return `🎉 PARABÉNS ${userName}!\n\nVocê completou ${courseName}!\n\nSeu certificado está disponível.\nAcesse via app ou *123#\n\nWIRA - Capacitação Profissional`;
  }

  getReminderMessage(userName: string, lastActivity: string): string {
    return `📚 Lembrete WIRA\n\nOlá ${userName}!\n\nSua última atividade: ${lastActivity}\n\nContinue seus cursos!\n*123# para acessar`;
  }
}

// Enhanced USSD Service
class USSDService {
  private sessions: Map<string, USSDSession> = new Map();
  private smsService = new SMSService();
  private readonly sessionTimeout = 5 * 60 * 1000; // 5 minutes

  createSession(sessionId: string, phoneNumber: string): USSDSession {
    const session: USSDSession = {
      sessionId,
      phoneNumber,
      step: USSDStep.WELCOME,
      userCode: undefined,
      userData: undefined,
      lastActivity: Date.now(),
      startTime: Date.now()
    };

    this.sessions.set(sessionId, session);
    console.log(`📱 New USSD session: ${sessionId} for ${phoneNumber}`);
    return session;
  }

  getSession(sessionId: string): USSDSession | null {
    const session = this.sessions.get(sessionId);
    if (session && (Date.now() - session.lastActivity) > this.sessionTimeout) {
      this.sessions.delete(sessionId);
      console.log(`🗑️ Session expired: ${sessionId}`);
      return null;
    }
    return session;
  }

  updateSession(sessionId: string, updates: Partial<USSDSession>): USSDSession | null {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
      session.lastActivity = Date.now();
    }
    return session;
  }

  async processRequest(sessionId: string, phoneNumber: string, text: string, serviceCode = '*123#'): Promise<USSDResponse> {
    console.log(`📱 USSD Request: Session=${sessionId}, Phone=${phoneNumber}, Text="${text}", Service=${serviceCode}`);

    // Get or create session
    let session = this.getSession(sessionId);
    if (!session) {
      session = this.createSession(sessionId, phoneNumber);
    }

    let response = '';
    let shouldEndSession = false;

    // Process based on current step
    switch (session.step) {
      case USSDStep.WELCOME:
        if (!text || text === '') {
          response = `CON Bem-vinda a WIRA - Women's Integrated Reintegration Academy

Seu código de acesso (ex: V0042):`;
          session.step = USSDStep.LOGIN;
        }
        break;

      case USSDStep.LOGIN:
        const normalizedCode = text.toUpperCase().trim();

        if (/^V\d{4}$/.test(normalizedCode)) {
          // Check if code exists in our user database
          const user = this.getUserData(normalizedCode);
          if (user) {
            session.userCode = normalizedCode;
            session.userData = user;
            session.step = USSDStep.MAIN_MENU;

            response = `CON Bem-vinda, ${user.real_name.split(' ')[0]}! 👋

Como podemos ajudar?
1. Meus Cursos
2. Meu Progresso
3. Ajuda
4. Sair`;

            // Send welcome SMS
            await this.smsService.sendSMS(phoneNumber, this.smsService.getWelcomeMessage(user.real_name.split(' ')[0]));
          } else {
            response = `CON Código não encontrado.

Tente novamente ou contate sua ONG.
Código (V####):`;
          }
        } else {
          response = `CON Código inválido.

Use formato V#### (ex: V0042):
1. Tentar novamente
2. Ajuda`;
        }
        break;

      case USSDStep.MAIN_MENU:
        switch (text) {
          case '1':
            session.step = USSDStep.COURSES_LIST;
            response = this.getCoursesList(session);
            break;
          case '2':
            session.step = USSDStep.PROGRESS_OVERVIEW;
            response = this.getProgressOverview(session);
            break;
          case '3':
            session.step = USSDStep.HELP;
            response = this.getHelpMenu();
            break;
          case '4':
            response = `END Obrigada por usar WIRA! 🎓

Até logo e continue capacitando-se!`;
            shouldEndSession = true;
            break;
          default:
            response = `CON Opção inválida.

1. Meus Cursos
2. Meu Progresso
3. Ajuda
4. Sair`;
        }
        break;

      case USSDStep.COURSES_LIST:
        if (text === '0') {
          session.step = USSDStep.MAIN_MENU;
          response = `CON Menu Principal

1. Meus Cursos
2. Meu Progresso
3. Ajuda
4. Sair`;
        } else if (['1', '2', '3'].includes(text)) {
          const courses = ['costura', 'culinaria', 'agricultura'];
          const course = courses[parseInt(text) - 1];
          session.selectedCourse = course;
          session.step = USSDStep.COURSE_DETAILS;
          response = this.getCourseDetails(session, course);
        } else {
          response = this.getCoursesList(session);
        }
        break;

      case USSDStep.COURSE_DETAILS:
        if (text === '0') {
          session.step = USSDStep.COURSES_LIST;
          response = this.getCoursesList(session);
        } else if (text === '1') {
          response = `CON 📚 Continuar Curso

Para continuar seus estudos, use:
• App WIRA (internet)
• Computador (site wira.org)

Ou visite sua ONG para acesso.

0. Voltar`;
        } else if (text === '2') {
          response = this.getCertificateStatus(session);
        } else {
          response = this.getCourseDetails(session, session.selectedCourse!);
        }
        break;

      case USSDStep.PROGRESS_OVERVIEW:
        response = this.getProgressOverview(session);
        break;

      case USSDStep.HELP:
        if (text === '0') {
          session.step = USSDStep.MAIN_MENU;
          response = `CON Menu Principal

1. Meus Cursos
2. Meu Progresso
3. Ajuda
4. Sair`;
        } else {
          response = this.getHelpMenu();
        }
        break;
    }

    // Update session
    this.updateSession(sessionId, { lastResponse: response });

    // Send progress reminder SMS if viewing progress
    if (session.step === USSDStep.PROGRESS_OVERVIEW) {
      await this.smsService.sendSMS(
        phoneNumber,
        this.smsService.getProgressMessage(
          session.userData!.real_name.split(' ')[0],
          this.getUserCoursesProgress(session.userCode!)
        )
      );
    }

    return {
      response,
      sessionId,
      step: session.step,
      shouldEndSession
    };
  }

  private getUserData(code: string): UserData | null {
    const users: Record<string, UserData> = {
      'V0042': {
        anonymous_code: 'V0042',
        real_name: 'Maria Silva',
        phone: '+258841234567',
        email: 'maria@demo.wira',
        ngo_id: 1,
        created_at: new Date().toISOString()
      },
      'V0038': {
        anonymous_code: 'V0038',
        real_name: 'Ana Costa',
        phone: '+258849876543',
        email: 'ana@demo.wira',
        ngo_id: 1,
        created_at: new Date().toISOString()
      },
      'V0031': {
        anonymous_code: 'V0031',
        real_name: 'João Matos',
        phone: '+258845555444',
        email: 'joao@demo.wira',
        ngo_id: 1,
        created_at: new Date().toISOString()
      }
    };
    return users[code] || null;
  }

  private getCoursesList(session: USSDSession): string {
    const courses = this.getUserCourses(session.userCode!);
    let response = `CON SEUS CURSOS:\n\n`;

    courses.forEach((course, index) => {
      response += `${index + 1}. ${course.name}\n`;
      response += `   Progresso: ${course.percentage}%\n`;
      response += `   Módulos: ${course.completedModules}/${course.totalModules}\n\n`;
    });

    response += `0. Voltar ao menu`;
    return response;
  }

  private getCourseDetails(session: USSDSession, courseId: string): string {
    const courses: Record<string, CourseData> = {
      'costura': {
        id: 'costura',
        name: 'Costura - Uniformes Escolares',
        percentage: 37,
        modules: 8,
        completedModules: 3,
        duration: '40 horas'
      },
      'culinaria': {
        id: 'culinaria',
        name: 'Culinária Profissional',
        percentage: 14,
        modules: 7,
        completedModules: 1,
        duration: '35 horas'
      },
      'agricultura': {
        id: 'agricultura',
        name: 'Agricultura Sustentável',
        percentage: 0,
        modules: 6,
        completedModules: 0,
        duration: '30 horas'
      }
    };

    const course = courses[courseId];
    if (!course) {
      return `CON Curso não encontrado

0. Voltar`;
    }

    return `CON ${course.name}

Progresso: ${course.percentage}% completo
Módulos: ${course.completedModules}/${course.modules}
Duração: ${course.duration}

Opções:
1. Continuar curso
2. Ver certificado
0. Voltar`;
  }

  private getProgressOverview(session: USSDSession): string {
    const courses = this.getUserCoursesProgress(session.userCode!);
    const totalCourses = courses.length;
    const completedModules = courses.reduce((sum, course) => sum + course.completedModules, 0);
    const totalModules = courses.reduce((sum, course) => sum + course.totalModules, 0);
    const overallProgress = Math.round((completedModules / totalModules) * 100);

    let response = `CON PROGRESSO GERAL - ${session.userCode}

📊 Estatísticas:
• Cursos Ativos: ${totalCourses}
• Módulos Completos: ${completedModules}/${totalModules}
• Progresso Geral: ${overallProgress}%

📚 Seus Cursos:`;

    courses.forEach(course => {
      const status = course.percentage === 100 ? '✅ Concluído' : `${course.percentage}%`;
      response += `\n• ${course.name}: ${status}`;
    });

    response += `\n\n0. Voltar ao menu`;
    return response;
  }

  private getCertificateStatus(session: USSDSession): string {
    // Check if user has completed any courses
    const completedCourses = this.getUserCompletedCourses(session.userCode!);

    if (completedCourses.length === 0) {
      return `CON 📜 CERTIFICADOS

Você ainda não completou nenhum curso.

Continue estudando! 💪

0. Voltar`;
    }

    let response = `CON 📜 SEUS CERTIFICADOS\n\n`;
    completedCourses.forEach((course, index) => {
      response += `${index + 1}. ${course.name}\n`;
      response += `   Código: ${course.certificateCode}\n`;
      response += `   Emitido: ${course.issuedDate}\n\n`;
    });

    response += `Parabéns! 🎉

0. Voltar`;
    return response;
  }

  private getHelpMenu(): string {
    return `CON WIRA - CENTRAL DE AJUDA

📞 Suporte:
• Telefone: +258 84 123 4567
• WhatsApp: +258 84 123 4567
• Email: ajuda@wira.org

🏢 Códigos de Acesso:
• Formato: V#### (ex: V0042)
• Fornecido pela sua ONG

⏰ Horário: Seg-Sex, 8h-17h

0. Voltar ao menu principal`;
  }

  private getUserCourses(userCode: string): CourseProgress[] {
    // Mock data based on user
    const userCourses: Record<string, CourseProgress[]> = {
      'V0042': [
        {
          name: 'Costura - Uniformes Escolares',
          percentage: 37,
          completedModules: 3,
          totalModules: 8
        },
        {
          name: 'Culinária Profissional',
          percentage: 14,
          completedModules: 1,
          totalModules: 7
        }
      ],
      'V0038': [
        {
          name: 'Culinária Profissional',
          percentage: 14,
          completedModules: 1,
          totalModules: 7
        }
      ],
      'V0031': [
        {
          name: 'Costura - Uniformes Escolares',
          percentage: 100,
          completedModules: 8,
          totalModules: 8
        }
      ]
    };

    return userCourses[userCode] || [];
  }

  private getUserCoursesProgress(userCode: string): CourseProgress[] {
    return this.getUserCourses(userCode);
  }

  private getUserCompletedCourses(userCode: string): Array<{
    name: string;
    certificateCode: string;
    issuedDate: string;
  }> {
    const allCourses = this.getUserCourses(userCode);
    return allCourses.filter(course => course.percentage === 100).map(course => ({
      name: course.name,
      certificateCode: `WIRA-${userCode}-${course.name.split(' ')[0].toUpperCase()}-2025`,
      issuedDate: new Date().toISOString().split('T')[0]
    }));
  }

  getActiveSessions(): number {
    const now = Date.now();
    let activeCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if ((now - session.lastActivity) <= this.sessionTimeout) {
        activeCount++;
      }
    }

    return activeCount;
  }

  getSessionStats(): USSDServiceStats {
    return {
      totalSessions: this.sessions.size,
      activeSessions: this.getActiveSessions(),
      smsSent: this.smsService.sentMessages.length
    };
  }

  // Cleanup expired sessions
  cleanupExpiredSessions(): number {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      if ((now - session.lastActivity) > this.sessionTimeout) {
        expiredSessions.push(sessionId);
      }
    }

    expiredSessions.forEach(sessionId => {
      this.sessions.delete(sessionId);
      console.log(`🗑️ Cleaned up expired session: ${sessionId}`);
    });

    return expiredSessions.length;
  }
}

// Initialize services
const ussdService = new USSDService();

// Health check
app.get('/health', (req, res) => {
  const healthResponse: HealthCheckResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0-ussd-enhanced-ts',
    services: {
      api: 'online',
      ussd: 'online',
      sms: 'online (mock)',
      database: 'connected (memory)'
    }
  };

  res.json(healthResponse);
});

// Main USSD endpoint (for production with telecom operators)
app.post('/api/ussd', async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  try {
    const result = await ussdService.processRequest(
      sessionId || `session_${Date.now()}`,
      phoneNumber || '+258840000000',
      text || '',
      serviceCode || '*123#'
    );

    res.json({
      success: true,
      response: result.response,
      sessionId: result.sessionId,
      step: result.step
    });
  } catch (error) {
    console.error('USSD Error:', error);
    res.status(500).json({
      success: false,
      error: 'Serviço temporariamente indisponível'
    });
  }
});

// Test endpoint for local development
app.post('/api/ussd/test', async (req, res) => {
  const { phoneNumber, text } = req.body;
  const sessionId = `test_${Date.now()}`;

  try {
    const result = await ussdService.processRequest(
      sessionId,
      phoneNumber || '+258840000000',
      text || ''
    );

    res.json({
      success: true,
      response: result.response,
      sessionId: result.sessionId,
      step: result.step,
      phoneNumber: phoneNumber || '+258840000000'
    });
  } catch (error) {
    console.error('USSD Test Error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro no teste USSD'
    });
  }
});

// USSD Status endpoint
app.get('/api/ussd/status', (req, res) => {
  const stats = ussdService.getSessionStats();

  const ussdHealth: USSDHealthCheck = {
    service: 'WIRA USSD Service',
    status: 'Online',
    shortcode: '*123#',
    sessionTimeout: '5 minutos',
    ...stats,
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    ...ussdHealth
  });
});

// SMS endpoints
app.get('/api/sms/status', (req, res) => {
  const messages = ussdService.smsService.getSentMessages();

  res.json({
    success: true,
    service: 'WIRA SMS Service',
    status: 'Online (Mock)',
    totalSent: messages.length,
    recentMessages: messages.slice(-5),
    timestamp: new Date().toISOString()
  });
});

// Send test SMS
app.post('/api/sms/send', async (req, res) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({
      success: false,
      error: 'phoneNumber and message are required'
    });
  }

  try {
    const smsResult = await ussdService.smsService.sendSMS(phoneNumber, message);

    res.json({
      success: true,
      message: 'SMS sent successfully',
      sms: smsResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send SMS'
    });
  }
});

// Get all SMS
app.get('/api/sms/all', (req, res) => {
  const messages = ussdService.smsService.getSentMessages();

  res.json({
    success: true,
    totalMessages: messages.length,
    messages: messages
  });
});

// Enhanced demo endpoints
app.get('/api/demo/ussd/sequence', async (req, res) => {
  const phoneNumber = '+258840000000';
  const sessionId = `demo_${Date.now()}`;

  try {
    console.log('🎬 Starting USSD demo sequence...');

    // Step 1: Welcome
    const step1 = await ussdService.processRequest(sessionId, phoneNumber, '');

    // Step 2: Login
    await new Promise(resolve => setTimeout(resolve, 1000));
    const step2 = await ussdService.processRequest(sessionId, phoneNumber, 'V0042');

    // Step 3: Main menu
    await new Promise(resolve => setTimeout(resolve, 1000));
    const step3 = await ussdService.processRequest(sessionId, phoneNumber, '2');

    const demoResponse: DemoSequenceResponse = {
      success: true,
      demoSequence: [
        { step: 'Welcome', response: step1.response },
        { step: 'Login', response: step2.response },
        { step: 'Progress', response: step3.response }
      ],
      sessionId,
      phoneNumber
    };

    res.json(demoResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Demo failed'
    });
  }
});

// Cleanup expired sessions periodically
setInterval(() => {
  const cleaned = ussdService.cleanupExpiredSessions();
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired USSD sessions`);
  }
}, 60000); // Every minute

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WIRA USSD/SMS Enhanced Server (TypeScript) started on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`📱 USSD Test: curl -X POST http://localhost:${PORT}/api/ussd/test -H "Content-Type: application/json" -d '{"text":"V0042"}'`);
  console.log(`📧 SMS Status: http://localhost:${PORT}/api/sms/status`);
  console.log(`🎬 Demo Sequence: http://localhost:${PORT}/api/demo/ussd/sequence`);
  console.log(`\n📱 USSD Shortcode: *123#`);
  console.log(`📞 SMS Service: Online (Mock)`);
  console.log(`⏰ Session Timeout: 5 minutes`);
  console.log(`🔧 Language: TypeScript`);
});

export default app;