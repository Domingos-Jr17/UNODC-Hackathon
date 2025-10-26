const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { logger, handleValidationErrors } = require('../middleware/security');
const cacheService = require('../services/cache');

// Cache middleware
const cacheMiddleware = (ttl = 1800) => {
  return async (req, res, next) => {
    const cacheKey = `route:${req.method}:${req.originalUrl}`;

    try {
      const cached = await cacheService.get(cacheKey);

      if (cached) {
        logger.debug('Cache hit', { key: cacheKey });
        return res.json(cached);
      }

      // Store res.json to intercept response
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the response
        cacheService.set(cacheKey, data, ttl).catch(err => {
          logger.error('Failed to cache response', { error: err.message, key: cacheKey });
        });

        // Call original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', { error: error.message, key: cacheKey });
      next();
    }
  };
};

// Get all courses with caching
router.get('/', cacheMiddleware(1800), (req, res) => {
  const cacheKey = 'courses:all';

  db.all('SELECT * FROM courses WHERE is_active = 1', (err, rows) => {
    if (err) {
      logger.error('Database error fetching courses', { error: err.message });
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }

    const response = {
      success: true,
      courses: rows,
      cached: false
    };

    res.json(response);

    // Warm cache with individual courses
    rows.forEach(course => {
      cacheService.set(`course:${course.id}`, course, 1800).catch(err => {
        logger.error('Failed to warm course cache', { error: err.message, courseId: course.id });
      });
    });
  });
});

// Get course by ID with caching
router.get('/:id', cacheMiddleware(1800), (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
    if (err) {
      logger.error('Database error fetching course', { error: err.message, courseId: id });
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        error: 'Curso não encontrado'
      });
    }

    res.json({
      success: true,
      course: row,
      cached: false
    });
  });
});

// Get course modules with caching
router.get('/:id/modules', cacheMiddleware(3600), (req, res) => {
  const { id } = req.params;

  // Check cache first
  cacheService.get(`course:${id}:modules`).then(cachedModules => {
    if (cachedModules) {
      return res.json({
        success: true,
        modules: cachedModules,
        cached: true
      });
    }

    // Generate modules data
    const modules = {
      costura: [
        {
          id: 1,
          title: 'Preparação de Máquina Industrial',
          duration: '45 min',
          videoUrl: 'https://example.com/costura-mod1.mp4',
          downloadable: true,
          description: 'Aprenda a configurar e preparar máquinas industriais para costura de uniformes escolares.'
        },
        {
          id: 2,
          title: 'Técnicas de Costura Reta',
          duration: '60 min',
          videoUrl: 'https://example.com/costura-mod2.mp4',
          downloadable: true,
          description: 'Domine as técnicas fundamentais de costura reta em diferentes tipos de tecidos.'
        },
        {
          id: 3,
          title: 'Costura de Bolsos',
          duration: '50 min',
          videoUrl: 'https://example.com/costura-mod3.mp4',
          downloadable: true,
          description: 'Aprenda a costurar diferentes tipos de bolsos em uniformes escolares.'
        },
        {
          id: 4,
          title: 'Montagem de Camisas',
          duration: '75 min',
          videoUrl: 'https://example.com/costura-mod4.mp4',
          downloadable: true,
          description: 'Técnica completa de montagem de camisas escolares passo a passo.'
        },
        {
          id: 5,
          title: 'Acabamentos Profissionais',
          duration: '40 min',
          videoUrl: 'https://example.com/costura-mod5.mp4',
          downloadable: true,
          description: 'Acabamentos profissionais que elevam a qualidade dos uniformes escolares.'
        },
        {
          id: 6,
          title: 'Controle de Qualidade',
          duration: '30 min',
          videoUrl: 'https://example.com/costura-mod6.mp4',
          downloadable: true,
          description: 'Sistema de controle de qualidade para produção em massa de uniformes.'
        },
        {
          id: 7,
          title: 'Produtividade e Prazos',
          duration: '35 min',
          videoUrl: 'https://example.com/costura-mod7.mp4',
          downloadable: true,
          description: 'Técnicas para aumentar produtividade e cumprir prazos de entrega.'
        },
        {
          id: 8,
          title: 'Avaliação Final',
          duration: '60 min',
          videoUrl: 'https://example.com/costura-mod8.mp4',
          downloadable: true,
          description: 'Avaliação prática final do curso de costura avançada.'
        }
      ],
      culinaria: [
        {
          id: 1,
          title: 'Técnicas de Corte',
          duration: '40 min',
          videoUrl: 'https://example.com/culinaria-mod1.mp4',
          downloadable: true,
          description: 'Técnicas profissionais de corte de alimentos para cozinha moçambicana.'
        },
        {
          id: 2,
          title: 'Cozinha Moçambicana',
          duration: '50 min',
          videoUrl: 'https://example.com/culinaria-mod2.mp4',
          downloadable: true,
          description: 'Pratos tradicionais moçambicanos e técnicas de preparo.'
        },
        {
          id: 3,
          title: 'Segurança Alimentar',
          duration: '45 min',
          videoUrl: 'https://example.com/culinaria-mod3.mp4',
          downloadable: true,
          description: 'Normas de segurança e higiene na manipulação de alimentos.'
        },
        {
          id: 4,
          title: 'Apresentação',
          duration: '30 min',
          videoUrl: 'https://example.com/culinaria-mod4.mp4',
          downloadable: true,
          description: 'Técnicas de apresentação e embelezamento de pratos.'
        },
        {
          id: 5,
          title: 'Cardápios Escolares',
          duration: '55 min',
          videoUrl: 'https://example.com/culinaria-mod5.mp4',
          downloadable: true,
          description: 'Planejamento e execução de cardápios para escolas.'
        },
        {
          id: 6,
          title: 'Custo-Benefício',
          duration: '35 min',
          videoUrl: 'https://example.com/culinaria-mod6.mp4',
          downloadable: true,
          description: 'Gestão de custos e otimização de ingredientes.'
        },
        {
          id: 7,
          title: 'Avaliação Final',
          duration: '50 min',
          videoUrl: 'https://example.com/culinaria-mod7.mp4',
          downloadable: true,
          description: 'Avaliação prática final do curso de culinária profissional.'
        }
      ],
      agricultura: [
        {
          id: 1,
          title: 'Preparação do Solo',
          duration: '35 min',
          videoUrl: 'https://example.com/agricultura-mod1.mp4',
          downloadable: true,
          description: 'Técnicas de preparação e conservação do solo para agricultura sustentável.'
        },
        {
          id: 2,
          title: 'Plantio',
          duration: '40 min',
          videoUrl: 'https://example.com/agricultura-mod2.mp4',
          downloadable: true,
          description: 'Técnicas de plantio de milho e hortaliças adaptadas ao clima moçambicano.'
        },
        {
          id: 3,
          title: 'Irrigação',
          duration: '45 min',
          videoUrl: 'https://example.com/agricultura-mod3.mp4',
          downloadable: true,
          description: 'Sistemas de irrigação eficientes e econômicos para pequenos agricultores.'
        },
        {
          id: 4,
          title: 'Controle de Pragas',
          duration: '30 min',
          videoUrl: 'https://example.com/agricultura-mod4.mp4',
          downloadable: true,
          description: 'Métodos orgânicos de controle de pragas e doenças.'
        },
        {
          id: 5,
          title: 'Colheita',
          duration: '35 min',
          videoUrl: 'https://example.com/agricultura-mod5.mp4',
          downloadable: true,
          description: 'Técnicas adequadas de colheita e pós-colheita.'
        },
        {
          id: 6,
          title: 'Armazenamento',
          duration: '30 min',
          videoUrl: 'https://example.com/agricultura-mod6.mp4',
          downloadable: true,
          description: 'Métodos de armazenamento que preservam a qualidade dos alimentos.'
        }
      ]
    };

    const courseModules = modules[id] || [];

    // Cache the result
    cacheService.set(`course:${id}:modules`, courseModules, 3600).catch(err => {
      logger.error('Failed to cache course modules', { error: err.message, courseId: id });
    });

    res.json({
      success: true,
      modules: courseModules,
      cached: false
    });
  }).catch(err => {
    logger.error('Error checking course modules cache', { error: err.message, courseId: id });
  });
});

// Get course quiz with caching
router.get('/:id/quiz', cacheMiddleware(3600), (req, res) => {
  const { id } = req.params;

  // Check cache first
  cacheService.get(`course:${id}:quiz`).then(cachedQuiz => {
    if (cachedQuiz) {
      return res.json({
        success: true,
        quiz: cachedQuiz,
        cached: true
      });
    }

    // Generate quiz data
    const quizData = {
      costura: [
        {
          id: 1,
          question: 'Qual é o primeiro passo ao costurar um bolso?',
          options: [
            'Cortar o tecido',
            'Preparar o acabamento das bordas',
            'Costurar diretamente na peça',
            'Medir e marcar a posição'
          ],
          correctAnswer: 3,
          explanation: 'Antes de costurar, é essencial medir e marcar a posição exata do bolso na peça para garantir alinhamento.'
        },
        {
          id: 2,
          question: 'Qual máquina industrial é mais adequada para produção de uniformes escolares?',
          options: [
            'Máquina reta',
            'Máquina overlock',
            'Máquina zig-zag',
            'Máquina industrial plana'
          ],
          correctAnswer: 3,
          explanation: 'Máquinas industriais planas são ideais para produção em massa de uniformes, pois oferecem maior velocidade e consistência.'
        },
        {
          id: 3,
          question: 'Qual é a função da agulha dupla em uma máquina industrial?',
          options: [
            'Criar pontos decorativos',
            'Fazer costura reforçada',
            'Costurar duas camadas de tecido simultaneamente',
            'Permitir costura mais rápida em tecidos espessos'
          ],
          correctAnswer: 3,
          explanation: 'A agulha dupla permite costurar duas camadas simultaneamente, aumentando a produtividade em tecidos espessos.'
        }
      ],
      culinaria: [
        {
          id: 1,
          question: 'Qual é a temperatura segura para armazenar alimentos?',
          options: [
            'Abaixo de 5°C',
            'Entre 5°C e 60°C',
            'Acima de 60°C',
            'Não importa'
          ],
          correctAnswer: 1,
          explanation: 'A zona de temperatura segura para armazenamento de alimentos é abaixo de 5°C para evitar proliferação bacteriana.'
        },
        {
          id: 2,
          question: 'Qual é o tempo mínimo para cozimento seguro de carnes?',
          options: [
            '30 minutos',
            'Depende da temperatura interna',
            'Até dourar por fora',
            '10 minutos em fogo alto'
          ],
          correctAnswer: 2,
          explanation: 'O cozimento seguro depende da temperatura interna alcançada, não apenas do tempo.'
        }
      ],
      agricultura: [
        {
          id: 1,
          question: 'Qual é o melhor período para plantar milho em Moçambique?',
          options: [
            'Janeiro a Fevereiro',
            'Março a Abril',
            'Setembro a Outubro',
            'Novembro a Dezembro'
          ],
          correctAnswer: 2,
          explanation: 'O período de chuvas em Moçambique vai de novembro a abril, tornando setembro a outubro o período ideal para plantio.'
        },
        {
          id: 2,
          question: 'Qual é o pH ideal para a maioria das hortaliças?',
          options: [
            '4.0 - 5.0',
            '5.5 - 6.5',
            '6.0 - 7.0',
            '7.0 - 8.0'
          ],
          correctAnswer: 3,
          explanation: 'A maioria das hortaliças cresce melhor em solo com pH entre 6.0 e 7.0, levemente ácido a neutro.'
        }
      ]
    };

    const quiz = quizData[id] || [];

    // Cache the result
    cacheService.set(`course:${id}:quiz`, quiz, 3600).catch(err => {
      logger.error('Failed to cache course quiz', { error: err.message, courseId: id });
    });

    res.json({
      success: true,
      quiz,
      cached: false
    });
  }).catch(err => {
    logger.error('Error checking course quiz cache', { error: err.message, courseId: id });
  });
});

// Invalidate cache for course when updated
router.post('/:id/invalidate-cache', async (req, res) => {
  const { id } = req.params;

  try {
    await cacheService.invalidateCourseCache(id);
    logger.info('Course cache invalidated', { courseId: id });

    res.json({
      success: true,
      message: 'Cache do curso invalidado com sucesso'
    });
  } catch (error) {
    logger.error('Error invalidating course cache', { error: error.message, courseId: id });
    res.status(500).json({
      error: 'Erro ao invalidar cache do curso'
    });
  }
});

module.exports = router;