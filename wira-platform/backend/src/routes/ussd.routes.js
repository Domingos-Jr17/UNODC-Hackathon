const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Armazenamento de sessões USSD em memória (produção: Redis/Memcached)
const ussdSessions = new Map();

// Helper function para gerar menu USSD
function generateMenu(title, options, isEnd = false) {
  const prefix = isEnd ? 'END ' : 'CON ';
  let menu = `${prefix}${title}\n`;
  options.forEach((option, index) => {
    menu += `${index + 1}. ${option}\n`;
  });
  return menu.trim();
}

// Helper function para limpar input
function cleanInput(text) {
  return text ? text.trim() : '';
}

// Helper function para formatar progresso
function formatProgress(percentage) {
  return `${percentage}% completo`;
}

// Helper function para validar código de acesso
function validateAccessCode(code) {
  return /^V\d{4}$/.test(code);
}

// Endpoint principal USSD
router.post('/', (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  console.log(`📱 USSD Request: Session=${sessionId}, Phone=${phoneNumber}, Text="${text}"`);

  try {
    // Parse do input do usuário
    const input = cleanInput(text);
    const inputs = input.split('*').filter(item => item);

    // Recuperar ou criar sessão
    let session = ussdSessions.get(sessionId);
    if (!session) {
      session = {
        phoneNumber,
        step: 'welcome',
        data: {},
        createdAt: new Date()
      };
      ussdSessions.set(sessionId, session);
      console.log(`🆕 Nova sessão USSD: ${sessionId}`);
    }

    let response = '';

    // Máquina de estados USSD
    switch (session.step) {
      case 'welcome':
        response = handleWelcome(session, inputs);
        break;

      case 'access_code':
        response = handleAccessCode(session, inputs);
        break;

      case 'main_menu':
        response = handleMainMenu(session, inputs);
        break;

      case 'courses_list':
        response = handleCoursesList(session, inputs);
        break;

      case 'course_detail':
        response = handleCourseDetail(session, inputs);
        break;

      case 'progress_menu':
        response = handleProgressMenu(session, inputs);
        break;

      case 'help_menu':
        response = handleHelpMenu(session, inputs);
        break;

      default:
        response = 'END Ocorreu um erro. Tente novamente.';
    }

    console.log(`📤 USSD Response: ${response.substring(0, 50)}...`);
    res.set('Content-Type', 'text/plain');
    res.send(response);

  } catch (error) {
    console.error('❌ Erro USSD:', error);
    res.send('END Serviço temporariamente indisponível. Tente mais tarde.');
  }
});

// Bem-vindo e solicitar código de acesso
function handleWelcome(session, inputs) {
  if (inputs.length === 0) {
    session.step = 'access_code';
    return 'CON Bem-vinda a WIRA - Women\'s Integrated Reintegration Academy\n\nDigite seu código de acesso (ex: V0042):';
  }

  // Input direto na primeira tela
  session.data.accessCode = inputs[0];
  return processAccessCode(session, inputs[0]);
}

// Validar código de acesso
function handleAccessCode(session, inputs) {
  if (inputs.length === 0) {
    return 'END Código não pode ser vazio. Tente novamente.';
  }

  const code = inputs[0].toUpperCase();
  session.data.accessCode = code;

  return processAccessCode(session, code);
}

// Processar código de acesso
function processAccessCode(session, code) {
  if (!validateAccessCode(code)) {
    session.step = 'access_code';
    return 'CON Código inválido. Use formato V#### (ex: V0042)\n\nTente novamente:';
  }

  // Verificar no banco de dados
  db.get(
    'SELECT * FROM users WHERE anonymous_code = ?',
    [code],
    (err, user) => {
      if (err) {
        console.error('Erro DB:', err);
        return;
      }

      if (!user) {
        session.step = 'access_code';
        return 'END Código não encontrado. Verifique com sua ONG.';
      }

      // Usuário autenticado
      session.data.user = user;
      session.step = 'main_menu';
      session.lastActivity = new Date();

      console.log(`✅ Usuário autenticado: ${code}`);
    }
  );

  // Para demo, assumimos que o código existe
  session.data.user = { anonymous_code: code };
  session.step = 'main_menu';

  return generateMenu(
    `Bem-vinda, ${code}!\n\nComo podemos ajudar?`,
    [
      'Meus Cursos',
      'Meu Progresso',
      'Ajuda',
      'Sair'
    ]
  );
}

// Menu principal
function handleMainMenu(session, inputs) {
  if (inputs.length === 0) {
    return 'CON Selecione uma opção válida:';
  }

  const choice = parseInt(inputs[0]);

  switch (choice) {
    case 1: // Meus Cursos
      session.step = 'courses_list';
      return handleCoursesList(session, []);

    case 2: // Meu Progresso
      session.step = 'progress_menu';
      return handleProgressMenu(session, []);

    case 3: // Ajuda
      session.step = 'help_menu';
      return handleHelpMenu(session, []);

    case 4: // Sair
      ussdSessions.delete(session.phoneNumber);
      return 'END Obrigada por usar WIRA! Volte sempre.';

    default:
      return generateMenu(
        'Opção inválida. Tente novamente:',
        [
          'Meus Cursos',
          'Meu Progresso',
          'Ajuda',
          'Sair'
        ]
      );
  }
}

// Lista de cursos
function handleCoursesList(session, inputs) {
  // Simulação de cursos - em produção, buscar do BD
  const courses = [
    { id: 'costura', title: 'Costura - Uniformes Escolares', progress: 37 },
    { id: 'culinaria', title: 'Culinária Profissional', progress: 0 },
    { id: 'agricultura', title: 'Agricultura Sustentável', progress: 15 }
  ];

  let menuText = 'SEUS CURSOS:\n\n';
  courses.forEach((course, index) => {
    menuText += `${index + 1}. ${course.title}\n   Progresso: ${formatProgress(course.progress)}\n\n`;
  });
  menuText += '0. Voltar ao menu principal';

  if (inputs.length === 0) {
    return `CON ${menuText}`;
  }

  const choice = parseInt(inputs[0]);

  if (choice === 0) {
    session.step = 'main_menu';
    return handleMainMenu(session, ['0']);
  }

  if (choice >= 1 && choice <= courses.length) {
    session.data.selectedCourse = courses[choice - 1];
    session.step = 'course_detail';
    return handleCourseDetail(session, []);
  }

  return `CON ${menuText}`;
}

// Detalhes do curso
function handleCourseDetail(session, inputs) {
  const course = session.data.selectedCourse;

  if (!course) {
    session.step = 'courses_list';
    return 'CON Curso não encontrado. Selecionando novamente...';
  }

  let courseInfo = `${course.title}\n\n`;
  courseInfo += `Progresso: ${formatProgress(course.progress)}\n`;
  courseInfo += `Módulos: 8/8\n`;
  courseInfo += `Duração: 40 horas\n\n`;
  courseInfo += `Opções:\n`;
  courseInfo += `1. Continuar curso\n`;
  courseInfo += `2. Ver certificado\n`;
  courseInfo += `0. Voltar`;

  if (inputs.length === 0) {
    return `CON ${courseInfo}`;
  }

  const choice = parseInt(inputs[0]);

  switch (choice) {
    case 1: // Continuar curso
      return 'END Link enviado para seu acesso ao curso. Verifique seu SMS.';

    case 2: // Ver certificado
      if (course.progress >= 100) {
        return 'END Certificado disponível! Código: CERT-WIRA-2024-XXXX';
      } else {
        return 'END Certificado disponível após completar 100% do curso.';
      }

    case 0: // Voltar
      session.step = 'courses_list';
      return handleCoursesList(session, []);

    default:
      return `CON ${courseInfo}`;
  }
}

// Menu de progresso
function handleProgressMenu(session, inputs) {
  const user = session.data.user;

  let progressInfo = `PROGRESSO GERAL - ${user.anonymous_code}\n\n`;
  progressInfo += `Cursos Ativos: 3\n`;
  progressInfo += `Módulos Completos: 12/24\n`;
  progressInfo += `Horas de Estudo: 127\n`;
  progressInfo += `Última Atividade: Hoje\n\n`;
  progressInfo += `Estatísticas:\n`;
  progressInfo += `• Costura: 37% completo\n`;
  progressInfo += `• Culinária: Novo\n`;
  progressInfo += `• Agricultura: 15% completo\n\n`;
  progressInfo += `0. Voltar ao menu`;

  if (inputs.length === 0) {
    return `CON ${progressInfo}`;
  }

  session.step = 'main_menu';
  return handleMainMenu(session, ['0']);
}

// Menu de ajuda
function handleHelpMenu(session, inputs) {
  let helpInfo = `WIRA - CENTRAL DE AJUDA\n\n`;
  helpInfo += `Estamos aqui para ajudar!\n\n`;
  helpInfo += `Códigos de Acesso:\n`;
  helpInfo += `• Formato: V#### (ex: V0042)\n`;
  helpInfo += `• Fornecido pela sua ONG\n\n`;
  helpInfo += `Suporte:\n`;
  helpInfo += `• Telefone: +258 84 123 4567\n`;
  helpInfo += `• WhatsApp: +258 84 123 4567\n`;
  helpInfo += `• Email: ajuda@wira.org\n\n`;
  helpInfo += `Horário: Seg-Sex, 8h-17h\n\n`;
  helpInfo += `0. Voltar ao menu principal`;

  if (inputs.length === 0) {
    return `CON ${helpInfo}`;
  }

  session.step = 'main_menu';
  return handleMainMenu(session, ['0']);
}

// Limpar sessões antigas (timeout de 5 minutos)
setInterval(() => {
  const now = new Date();
  for (const [sessionId, session] of ussdSessions.entries()) {
    const sessionAge = (now - session.createdAt) / 1000; // segundos
    if (sessionAge > 300) { // 5 minutos
      ussdSessions.delete(sessionId);
      console.log(`🗑️ Sessão expirada: ${sessionId}`);
    }
  }
}, 60000); // Verificar a cada minuto

// Endpoint para testes (simulação USSD)
router.post('/test', (req, res) => {
  const { phoneNumber, text } = req.body;

  // Simular requisição USSD
  const mockUssdRequest = {
    sessionId: `test_${Date.now()}`,
    serviceCode: '*123#',
    phoneNumber: phoneNumber || '+258840000000',
    text: text || ''
  };

  // Processar como USSD normal
  req.body = mockUssdRequest;

  console.log('🧪 TESTE USSD:', mockUssdRequest);

  return router.handle(req, res);
});

// Endpoint para verificar status
router.get('/status', (req, res) => {
  const activeSessions = ussdSessions.size;
  res.json({
    service: 'WIRA USSD Service',
    status: 'Online',
    activeSessions,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;