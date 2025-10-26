const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/auth.routes');
const coursesRoutes = require('./routes/courses.routes');
const progressRoutes = require('./routes/progress.routes');
const certificatesRoutes = require('./routes/certificates.routes');
const ussdRoutes = require('./routes/ussd.routes');

// Import database
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/ussd', ussdRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'SQLite',
    services: {
      api: 'online',
      ussd: 'online',
      database: 'connected'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor WIRA rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Banco de dados: SQLite`);
  console.log(`📱 USSD Service: http://localhost:${PORT}/api/ussd/status`);
  console.log(`🧪 USSD Test: POST http://localhost:${PORT}/api/ussd/test`);
});

module.exports = app;
