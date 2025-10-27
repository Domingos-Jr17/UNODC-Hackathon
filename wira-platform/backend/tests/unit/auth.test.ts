const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/index.secure');

describe('Authentication Routes', () => {
  describe('POST /api/auth/login', () => {
    test('should login with valid code', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ code: 'V0042' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.anonymousCode).toBe('V0042');
      expect(response.body.expiresIn).toBe('24h');
    });

    test('should reject invalid code format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ code: 'INVALID' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Dados inválidos');
      expect(response.body.details).toBeDefined();
    });

    test('should reject non-existent code', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ code: 'V9999' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Código de acesso inválido');
    });

    test('should handle missing code', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Dados inválidos');
    });

    test('should be case insensitive', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ code: 'v0042' });

      expect(response.status).toBe(200);
      expect(response.body.user.anonymousCode).toBe('V0042');
    });
  });

  describe('POST /api/auth/validate', () => {
    let token;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ code: 'V0042' });

      token = loginResponse.body.token;
    });

    test('should validate valid token', async () => {
      const response = await request(app)
        .post('/api/auth/validate')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.valid).toBe(true);
      expect(response.body.user.anonymousCode).toBe('V0042');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/validate')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token inválido ou expirado');
    });

    test('should reject missing token', async () => {
      const response = await request(app)
        .post('/api/auth/validate');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token não fornecido');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let token;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ code: 'V0042' });

      token = loginResponse.body.token;
    });

    test('should refresh valid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.token).not.toBe(token);
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token inválido');
    });
  });

  describe('DELETE /api/auth/logout', () => {
    test('should logout successfully', async () => {
      const response = await request(app)
        .delete('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout realizado com sucesso');
    });

    test('should handle logout with token', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ code: 'V0042' });

      const token = loginResponse.body.token;

      const response = await request(app)
        .delete('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/auth/check/:code', () => {
    test('should check available code', async () => {
      const response = await request(app)
        .get('/api/auth/check/V9999');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.available).toBe(true);
      expect(response.body.exists).toBe(false);
    });

    test('should check existing code', async () => {
      const response = await request(app)
        .get('/api/auth/check/V0042');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.available).toBe(false);
      expect(response.body.exists).toBe(true);
    });

    test('should validate code format', async () => {
      const response = await request(app)
        .get('/api/auth/check/INVALID');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Código deve estar no formato V####');
    });
  });

  describe('Rate Limiting', () => {
    test('should apply rate limiting to login attempts', async () => {
      const loginPromises = Array(10).fill().map(() =>
        request(app)
          .post('/api/auth/login')
          .send({ code: 'V0042' })
      );

      const responses = await Promise.all(loginPromises);
      const successCount = responses.filter(r => r.status === 200).length;
      const rateLimitedCount = responses.filter(r => r.status === 429).length;

      expect(successCount).toBeGreaterThan(0);
      expect(rateLimitedCount).toBeGreaterThan(0);
    });
  });
});