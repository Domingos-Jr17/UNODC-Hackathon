const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get user progress
router.get('/:code', (req, res) => {
  const { code } = req.params;
  
  if (!code) {
    return res.status(400).json({
      success: false,
      error: 'Código é obrigatório'
    });
  }
  
  db.all(
    'SELECT * FROM progress WHERE user_id = ?',
    [code],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Erro no banco de dados'
        });
      }
      
      res.json({
        success: true,
        progress: rows
      });
    }
  );
});

// Update progress
router.post('/update', (req, res) => {
  const { code, courseId, moduleId, percentage } = req.body;
  
  if (!code || !courseId || !moduleId) {
    return res.status(400).json({
      success: false,
      error: 'Dados incompletos'
    });
  }
  
  // Get current progress
  db.get(
    'SELECT * FROM progress WHERE user_id = ? AND course_id = ?',
    [code, courseId],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Erro no banco de dados'
        });
      }
      
      let completedModules = [];
      if (row && row.completed_modules) {
        completedModules = JSON.parse(row.completed_modules);
      }
      
      // Update module completion
      if (!completedModules.includes(moduleId)) {
        completedModules.push(moduleId);
      }
      
      // Update progress
      db.run(
        'UPDATE progress SET completed_modules = ?, percentage = ?, last_activity = CURRENT_TIMESTAMP WHERE user_id = ? AND course_id = ?',
        [JSON.stringify(completedModules), percentage, code, courseId],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: 'Erro ao atualizar progresso'
            });
          }
          
          res.json({
            success: true,
            message: 'Progresso atualizado com sucesso'
          });
        }
      );
    }
  );
});

module.exports = router;