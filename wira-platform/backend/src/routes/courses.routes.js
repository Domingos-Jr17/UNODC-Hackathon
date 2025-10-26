const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all courses
router.get('/', (req, res) => {
  db.all('SELECT * FROM courses WHERE is_active = 1', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }
    
    res.json({
      success: true,
      courses: rows
    });
  });
});

// Get course by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
    if (err) {
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
      course: row
    });
  });
});

// Get course modules
router.get('/:id/modules', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM courses WHERE id = ?', [id], (err, courseRow) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }
    
    if (!courseRow) {
      return res.status(404).json({
        success: false,
        error: 'Curso não encontrado'
      });
    }
    
    // Mock modules data
    const modules = {
      costura: [
        {
          id: 1,
          title: 'Preparação de Máquina Industrial',
          duration: '45 min',
          videoUrl: 'https://example.com/costura-mod1.mp4',
          downloadable: true
        },
        {
          id: 2,
          title: 'Técnicas de Costura Reta',
          duration: '60 min',
          videoUrl: 'https://example.com/costura-mod2.mp4',
          downloadable: true
        },
        {
          id: 3,
          title: 'Costura de Bolsos',
          duration: '50 min',
          videoUrl: 'https://example.com/costura-mod3.mp4',
          downloadable: true
        }
      ],
      culinaria: [
        {
          id: 1,
          title: 'Técnicas de Corte',
          duration: '40 min',
          videoUrl: 'https://example.com/culinaria-mod1.mp4',
          downloadable: true
        },
        {
          id: 2,
          title: 'Cozinha Moçambicana',
          duration: '50 min',
          videoUrl: 'https://example.com/culinaria-mod2.mp4',
          downloadable: true
        }
      ],
      agricultura: [
        {
          id: 1,
          title: 'Preparação do Solo',
          duration: '35 min',
          videoUrl: 'https://example.com/agricultura-mod1.mp4',
          downloadable: true
        },
        {
          id: 2,
          title: 'Plantio',
          duration: '40 min',
          videoUrl: 'https://example.com/agricultura-mod2.mp4',
          downloadable: true
        }
      ]
    };
  
    const courseModules = modules[id] || [];
  
    res.json({
      success: true,
      modules: courseModules
    });
  });
});

// Get course quiz
router.get('/:id/quiz', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM courses WHERE id = ?', [id], (err, courseRow) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }
    
    if (!courseRow) {
      return res.status(404).json({
        success: false,
        error: 'Curso não encontrado'
      });
    }
    
    // Mock quiz data
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
        }
      ],
      culinaria: [
        {
          id: 1,
          question: 'Qual é a temperatura segura para armazenar alimentos?',
          options: [
            'Aba de 5°C',
            'Entre 5°C e 60°C',
            'Acima de 60°C',
            'Não importa'
          ],
          correctAnswer: 1,
          explanation: 'A zona de temperatura segura para armazenamento de alimentos é entre 5°C e 60°C para evitar proliferação bacteriana.'
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
        }
      ]
    };
  
    const quiz = quizData[id] || [];
  
    res.json({
      success: true,
      quiz
    });
  });
});

module.exports = router;