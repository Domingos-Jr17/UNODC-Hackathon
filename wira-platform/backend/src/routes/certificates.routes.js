const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get user certificates
router.get('/:code', (req, res) => {
  const { code } = req.params;
  
  if (!code) {
    return res.status(400).json({
      success: false,
      error: 'Código é obrigatório'
    });
  }
  
  db.all(
    'SELECT * FROM certificates WHERE anonymous_code = ?',
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
        certificates: rows
      });
    }
  );
});

// Generate certificate
router.post('/generate', (req, res) => {
  const { anonymousCode, courseId, score } = req.body;
  
  if (!anonymousCode || !courseId || !score) {
    return res.status(400).json({
      success: false,
      error: 'Dados incompletos'
    });
  }
  
  // Generate certificate code
  const certificateCode = `${anonymousCode}-${courseId}-${new Date().getFullYear()}`;
  const qrCode = `WIRA-CERT-${certificateCode}`;
  
  // Get course details
  db.get(
    'SELECT title FROM courses WHERE id = ?',
    [courseId],
    (err, courseRow) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Erro no banco de dados'
        });
      }
      
      // Create new certificate
      const newCertificate = {
        id: 'cert-' + Date.now(),
        anonymousCode,
        courseId,
        courseTitle: courseRow.title,
        date: new Date().toLocaleDateString('pt-BR'),
        code: certificateCode,
        qrCode,
        instructor: 'Centro de Acolhimento Maputo',
        institution: 'Centro de Acolhimento Maputo',
        score,
        verified: false
      };
      
      db.run(
        'INSERT INTO certificates (id, anonymous_code, course_id, course_title, date, code, qr_code, instructor, institution, score, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newCertificate.id,
          newCertificate.anonymousCode,
          newCertificate.courseId,
          newCertificate.courseTitle,
          newCertificate.date,
          newCertificate.code,
          newCertificate.qrCode,
          newCertificate.instructor,
          newCertificate.institution,
          newCertificate.score,
          newCertificate.verified
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: 'Erro ao gerar certificado'
            });
          }
          
          res.json({
            success: true,
            certificate: newCertificate,
            message: 'Certificado gerado com sucesso'
          });
        }
      );
    }
  );
});

// Verify certificate
router.get('/verify/:code', (req, res) => {
  const { code } = req.params;
  
  if (!code) {
    return res.status(400).json({
      success: false,
      error: 'Código é obrigatório'
    });
  }
  
  db.get(
    'SELECT * FROM certificates WHERE qr_code = ?',
    [code],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Erro no banco de dados'
        });
      }
      
      if (!row) {
        return res.status(404).json({
          success: false,
          error: 'Certificado não encontrado'
        });
      }
      
      res.json({
        success: true,
        valid: row.verified,
        certificate: {
          anonymousCode: row.anonymous_code,
          courseTitle: row.course_title,
          date: row.date,
          score: row.score
        }
      });
    }
  );
});

module.exports = router;