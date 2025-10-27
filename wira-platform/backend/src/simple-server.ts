import express from 'express';
import cors from 'cors';
import {
  APIResponse,
  CourseData,
  UserData,
  ProgressData,
  CertificateData,
  DashboardStats
} from './types/ussd';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Dados em memória para demonstração
const users: Record<string, UserData> = {
  'V0042': {
    anonymous_code: 'V0042',
    ngo_id: 1,
    real_name: 'Maria Silva',
    phone: '+258841234567',
    email: 'maria@demo.wira',
    created_at: new Date().toISOString()
  },
  'V0038': {
    anonymous_code: 'V0038',
    ngo_id: 1,
    real_name: 'Ana Costa',
    phone: '+258849876543',
    email: 'ana@demo.wira',
    created_at: new Date().toISOString()
  },
  'V0031': {
    anonymous_code: 'V0031',
    ngo_id: 1,
    real_name: 'João Matos',
    phone: '+258845555444',
    email: 'joao@demo.wira',
    created_at: new Date().toISOString()
  }
};

const courses: CourseData[] = [
  {
    id: 'costura',
    name: 'Costura Avançada',
    title: 'Costura Avançada',
    description: 'Curso completo de costura industrial para produção de uniformes escolares',
    duration_hours: 40,
    modules_count: 8,
    level: 'Intermediário',
    status: 'active'
  },
  {
    id: 'culinaria',
    name: 'Culinária Profissional',
    title: 'Culinária Profissional',
    description: 'Técnicas profissionais de cozinha moçambicana',
    duration_hours: 35,
    modules_count: 7,
    level: 'Básico',
    status: 'active'
  },
  {
    id: 'agricultura',
    name: 'Agricultura Sustentável',
    title: 'Agricultura Sustentável',
    description: 'Cultivo de milho e hortaliças com técnicas modernas',
    duration_hours: 30,
    modules_count: 6,
    level: 'Básico',
    status: 'active'
  }
];

const progress: Record<string, Record<string, ProgressData>> = {
  'V0042': {
    'costura': { completed_modules: [1, 2, 3], percentage: 37.5, hours_completed: 15 }
  },
  'V0038': {
    'culinaria': { completed_modules: [1], percentage: 14, hours_completed: 5 }
  },
  'V0031': {
    'costura': { completed_modules: [1, 2, 3, 4, 5, 6, 7, 8], percentage: 100, hours_completed: 40 }
  }
};

const certificates: Record<string, CertificateData[]> = {
  'V0031': [
    {
      id: 'cert_001',
      course_id: 'costura',
      course_name: 'Costura Avançada',
      issued_at: new Date().toISOString(),
      certificate_code: 'WIRA-V0031-COSTURA-2025'
    }
  ]
};

// USSD Sessions (em memória para demonstração)
const ussdSessions = new Map<string, {
  step: string;
  userCode: string | null;
  lastActivity: number;
}>();

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0-simple-ts',
    services: {
      api: 'online',
      ussd: 'online',
      database: 'connected (memory)',
      encryption: 'disabled (demo mode)'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'WIRA Platform API - Simple Demo (TypeScript)',
    version: '3.0.0-simple-ts',
    description: 'Backend simplificado para demonstração do hackathon UNODC',
    status: 'running',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Login com código anônimo',
        'POST /api/auth/validate': 'Validar token JWT',
        'GET /api/auth/check/:code': 'Verificar disponibilidade de código'
      },
      courses: {
        'GET /api/courses': 'Listar cursos ativos',
        'GET /api/courses/:id': 'Obter detalhes do curso',
        'GET /api/courses/:id/modules': 'Listar módulos do curso'
      },
      ussd: {
        'POST /api/ussd': 'Processar requisição USSD',
        'GET /api/ussd/status': 'Status do serviço USSD'
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

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { code } = req.body;
  const normalizedCode = code ? code.toUpperCase() : '';

  console.log('Login attempt:', { anonymousCode: normalizedCode, ip: req.ip });

  if (!users[normalizedCode]) {
    console.log('Login attempt with invalid code:', normalizedCode);
    return res.status(401).json({
      error: 'Código de acesso inválido'
    });
  }

  // Token JWT simples (sem criptografia real para demo)
  const token = Buffer.from(JSON.stringify({
    anonymousCode: users[normalizedCode].anonymous_code,
    ngoId: users[normalizedCode].ngo_id,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
  })).toString('base64');

  const safeUser = {
    anonymousCode: users[normalizedCode].anonymous_code,
    ngoId: users[normalizedCode].ngo_id,
    createdAt: users[normalizedCode].created_at
  };

  console.log('Successful login:', { anonymousCode: normalizedCode, ngoId: safeUser.ngoId });

  const response: APIResponse = {
    success: true,
    token,
    user: safeUser,
    expiresIn: '24h'
  };

  res.json(response);
});

app.post('/api/auth/validate', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: 'Token não fornecido'
    });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());

    if (decoded.exp < Date.now()) {
      return res.status(401).json({
        error: 'Token expirado'
      });
    }

    res.json({
      success: true,
      valid: true,
      user: {
        anonymousCode: decoded.anonymousCode,
        ngoId: decoded.ngoId
      }
    });
  } catch (error) {
    res.status(401).json({
      error: 'Token inválido'
    });
  }
});

app.get('/api/auth/check/:code', (req, res) => {
  const { code } = req.params;
  const normalizedCode = code.toUpperCase();

  if (!/^V\d{4}$/i.test(normalizedCode)) {
    return res.status(400).json({
      error: 'Código deve estar no formato V####'
    });
  }

  const user = users[normalizedCode];
  res.json({
    success: true,
    available: !user,
    code: normalizedCode,
    exists: !!user,
    createdAt: user?.created_at || null
  });
});

// Courses routes
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    data: courses
  });
});

app.get('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  const course = courses.find(c => c.id === id);

  if (!course) {
    return res.status(404).json({
      error: 'Curso não encontrado'
    });
  }

  res.json({
    success: true,
    data: course
  });
});

app.get('/api/courses/:id/modules', (req, res) => {
  const { id } = req.params;

  const modules: Record<string, Array<{
    id: number;
    title: string;
    duration: number;
    completed: boolean;
  }>> = {
    'costura': [
      { id: 1, title: 'Preparação de Máquina Industrial', duration: 45, completed: true },
      { id: 2, title: 'Técnicas de Costura Reta', duration: 60, completed: true },
      { id: 3, title: 'Costura de Bolsos', duration: 50, completed: false },
      { id: 4, title: 'Montagem de Camisas', duration: 75, completed: false },
      { id: 5, title: 'Acabamentos Profissionais', duration: 40, completed: false },
      { id: 6, title: 'Controle de Qualidade', duration: 30, completed: false },
      { id: 7, title: 'Produtividade e Prazos', duration: 35, completed: false },
      { id: 8, title: 'Avaliação Final', duration: 60, completed: false }
    ],
    'culinaria': [
      { id: 1, title: 'Higiene e Segurança Alimentar', duration: 30, completed: true },
      { id: 2, title: 'Técnicas de Corte', duration: 45, completed: false },
      { id: 3, title: 'Moqueca Tradicional', duration: 60, completed: false },
      { id: 4, title: 'Matapa', duration: 50, completed: false },
      { id: 5, title: 'Frango à Zambeziana', duration: 55, completed: false },
      { id: 6, title: 'Gestão de Cozinha', duration: 40, completed: false },
      { id: 7, title: 'Avaliação Final', duration: 60, completed: false }
    ],
    'agricultura': [
      { id: 1, title: 'Preparação do Solo', duration: 40, completed: false },
      { id: 2, title: 'Seleção de Sementes', duration: 30, completed: false },
      { id: 3, title: 'Plantio de Milho', duration: 45, completed: false },
      { id: 4, title: 'Irrigação', duration: 35, completed: false },
      { id: 5, title: 'Controle de Pragas', duration: 40, completed: false },
      { id: 6, title: 'Colheita e Armazenamento', duration: 50, completed: false }
    ]
  };

  const courseModules = modules[id];
  if (!courseModules) {
    return res.status(404).json({
      error: 'Módulos não encontrados para este curso'
    });
  }

  res.json({
    success: true,
    data: courseModules
  });
});

// Progress routes
app.get('/api/users/:code/progress', (req, res) => {
  const { code } = req.params;
  const userProgress = progress[code.toUpperCase()];

  if (!userProgress) {
    return res.status(404).json({
      error: 'Progresso não encontrado'
    });
  }

  res.json({
    success: true,
    data: userProgress
  });
});

// Certificates routes
app.get('/api/users/:code/certificates', (req, res) => {
  const { code } = req.params;
  const userCertificates = certificates[code.toUpperCase()] || [];

  res.json({
    success: true,
    data: userCertificates
  });
});

// USSD Route (simplificado para demonstração)
app.post('/api/ussd', (req, res) => {
  const { text, sessionId } = req.body;

  console.log('USSD Request:', { text, sessionId, ip: req.ip });

  // Criar sessão se não existir
  if (!ussdSessions.has(sessionId)) {
    ussdSessions.set(sessionId, {
      step: 'welcome',
      userCode: null,
      lastActivity: Date.now()
    });
  }

  const session = ussdSessions.get(sessionId)!;
  session.lastActivity = Date.now();

  let response = '';

  if (!text || text === '') {
    // Menu inicial
    response = `CON Bem-vinda ao WIRA! 📚
1. Meus Cursos
2. Meu Progresso
3. Sair`;
    session.step = 'menu';
  } else if (text === '1') {
    // Lista de cursos
    response = `CON Seus Cursos:
1. Costura Avançada
2. Culinária Profissional
3. Agricultura Sustentável
0. Voltar`;
    session.step = 'courses';
  } else if (text === '2') {
    // Progresso
    response = `CON Seu Progresso:
📚 Costura: 37% completo (3/8 módulos)
🍳 Culinária: 14% completo (1/7 módulos)
0. Voltar`;
    session.step = 'progress';
  } else if (text === '0') {
    // Voltar ao menu
    response = `CON Bem-vinda ao WIRA! 📚
1. Meus Cursos
2. Meu Progresso
3. Sair`;
    session.step = 'menu';
  } else {
    // Opção inválida
    response = `CON Opção inválida.
1. Meus Cursos
2. Meu Progresso
3. Sair`;
  }

  res.json({
    success: true,
    response,
    sessionId,
    step: session.step
  });
});

app.get('/api/ussd/status', (req, res) => {
  // Limpar sessões expiradas (5 minutos)
  const now = Date.now();
  const timeout = 5 * 60 * 1000; // 5 minutos

  for (const [sessionId, session] of ussdSessions.entries()) {
    if (now - session.lastActivity > timeout) {
      ussdSessions.delete(sessionId);
    }
  }

  res.json({
    success: true,
    status: 'online',
    activeSessions: ussdSessions.size,
    shortcode: '*123#',
    timeout: '5 minutos'
  });
});

// Dashboard data route
app.get('/api/dashboard/stats', (req, res) => {
  const totalUsers = Object.keys(users).length;
  const totalCourses = courses.length;
  const totalCertificates = Object.values(certificates).reduce((sum, certs) => sum + certs.length, 0);
  const activeProgress = Object.keys(progress).length;

  const dashboardStats: DashboardStats = {
    totalUsers,
    totalCourses,
    totalCertificates,
    activeProgress,
    users: Object.entries(progress).map(([code, userProgress]) => ({
      code,
      courses: Object.keys(userProgress),
      progress: userProgress,
      hasCertificate: !!certificates[code]
    }))
  };

  res.json({
    success: true,
    data: dashboardStats
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    availableEndpoints: [
      'GET /health',
      'GET /api',
      'POST /api/auth/login',
      'GET /api/courses',
      'POST /api/ussd',
      'GET /api/dashboard/stats'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WIRA Simple Server (TypeScript) started on port ${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   USSD: http://localhost:${PORT}/api/ussd`);
  console.log(`   Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`\n📱 Demo codes: V0042, V0038, V0031`);
  console.log(`📞 USSD Test: curl -X POST http://localhost:${PORT}/api/ussd -H "Content-Type: application/json" -d '{"text":"","sessionId":"test"}'`);
});

export default app;