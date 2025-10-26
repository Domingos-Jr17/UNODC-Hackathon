const express = require('express');
const router = express.Router();
const db = require('../database/db');
const jwt = require('jsonwebtoken');

// Login with anonymous code
router.post('/login', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Código é obrigatório' });
  }
  
  // Query database for user
  db.get(
    'SELECT * FROM users WHERE anonymous_code = ?',
    [code],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no banco de dados' });
      }
      
      if (!row) {
        return res.status(401).json({ error: 'Código inválido' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          anonymousCode: row.anonymous_code,
          ngoId: row.ngo_id
        },
        process.env.JWT_SECRET || 'wira-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        token,
        user: {
          anonymousCode: row.anonymous_code,
          ngoId: row.ngo_id
        }
      });
    }
  );
});

// Refresh token
router.post('/refresh', (req, res) => {
  // Simplified token refresh for demo
  const token = jwt.sign(
    { refresh: true },
    process.env.JWT_SECRET || 'wira-secret-key',
    { expiresIn: '24h' }
  );
  
  res.json({
    success: true,
    token
  });
});

// Logout
router.delete('/logout', (req, res) => {
  res.json({ success: true });
});

module.exports = router;