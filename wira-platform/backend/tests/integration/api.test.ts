import request from 'supertest';
import app from '../../src/index.secure';

describe('API Integration Tests', () => {
  let authToken;
  let testUserCode = 'V0042';

  beforeEach(async () => {
    // Login and get token for protected routes
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ code: testUserCode });

    authToken = loginResponse.body.token;
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.services).toBeDefined();
      expect(response.body.services.api).toBe('online');
      expect(response.body.services.database).toBe('connected');
      expect(response.body.services.security).toBeDefined();
    });
  });

  describe('Courses API', () => {
    test('should list all courses', async () => {
      const response = await request(app)
        .get('/api/courses');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.courses)).toBe(true);
      expect(response.body.courses.length).toBeGreaterThan(0);

      const course = response.body.courses.find(c => c.id === 'costura');
      expect(course).toBeDefined();
      expect(course.title).toContain('Costura');
    });

    test('should get specific course', async () => {
      const response = await request(app)
        .get('/api/courses/costura');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.course.id).toBe('costura');
      expect(response.body.course.title).toContain('Costura');
    });

    test('should return 404 for non-existent course', async () => {
      const response = await request(app)
        .get('/api/courses/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('should get course modules', async () => {
      const response = await request(app)
        .get('/api/courses/costura/modules');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.modules)).toBe(true);
      expect(response.body.modules.length).toBeGreaterThan(0);

      const module = response.body.modules[0];
      expect(module.title).toBeDefined();
      expect(module.duration).toBeDefined();
    });

    test('should get course quiz', async () => {
      const response = await request(app)
        .get('/api/courses/costura/quiz');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.quiz)).toBe(true);
      expect(response.body.quiz.length).toBeGreaterThan(0);

      const question = response.body.quiz[0];
      expect(question.question).toBeDefined();
      expect(question.options).toBeDefined();
      expect(question.correctAnswer).toBeDefined();
      expect(question.explanation).toBeDefined();
    });
  });

  describe('Certificates API', () => {
    test('should generate certificate', async () => {
      const response = await request(app)
        .post('/api/certificates/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          anonymousCode: testUserCode,
          courseId: 'costura',
          score: 85
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.certificate).toBeDefined();
      expect(response.body.certificate.anonymousCode).toBe(testUserCode);
      expect(response.body.certificate.courseId).toBe('costura');
      expect(response.body.certificate.score).toBe(85);
      expect(response.body.certificate.qrCode).toBeDefined();
    });

    test('should validate certificate generation data', async () => {
      const response = await request(app)
        .post('/api/certificates/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          anonymousCode: 'INVALID',
          courseId: 'invalid',
          score: 150
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Dados inválidos');
      expect(response.body.details).toBeDefined();
    });

    test('should verify certificate', async () => {
      // First generate a certificate
      const generateResponse = await request(app)
        .post('/api/certificates/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          anonymousCode: testUserCode,
          courseId: 'costura',
          score: 85
        });

      const verificationCode = generateResponse.body.certificate.verificationCode;

      // Then verify it
      const verifyResponse = await request(app)
        .get(`/api/certificates/${verificationCode}/verify`);

      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body.success).toBe(true);
      expect(verifyResponse.body.valid).toBeDefined();
    });
  });

  describe('Progress API', () => {
    test('should get user progress', async () => {
      const response = await request(app)
        .get(`/api/progress/${testUserCode}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.userCode).toBe(testUserCode);
      expect(Array.isArray(response.body.progress)).toBe(true);
    });

    test('should update progress', async () => {
      const response = await request(app)
        .post('/api/progress/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userCode: testUserCode,
          courseId: 'costura',
          moduleId: 1,
          score: 90
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.progress).toBeDefined();
    });
  });

  describe('USSD API', () => {
    test('should handle USSD test endpoint', async () => {
      const response = await request(app)
        .post('/api/ussd/test')
        .send({
          phoneNumber: '+258840000000',
          text: 'V0042'
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/plain; charset=utf-8');
      expect(response.text).toContain('Bem-vinda');
    });

    test('should handle USSD welcome flow', async () => {
      const response = await request(app)
        .post('/api/ussd/test')
        .send({
          phoneNumber: '+258840000000',
          text: ''
        });

      expect(response.status).toBe(200);
      expect(response.text).toContain('Bem-vinda a WIRA');
    });

    test('should get USSD status', async () => {
      const response = await request(app)
        .get('/api/ussd/status');

      expect(response.status).toBe(200);
      expect(response.body.service).toBe('WIRA USSD Service');
      expect(response.body.status).toBe('Online');
      expect(typeof response.body.activeSessions).toBe('number');
    });
  });

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });

  describe('CORS', () => {
    test('should handle CORS preflight', async () => {
      const response = await request(app)
        .options('/api/courses')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Rate Limiting Integration', () => {
    test('should apply rate limits to API endpoints', async () => {
      const promises = Array(50).fill().map(() =>
        request(app).get('/api/courses')
      );

      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(r => r.status === 429);

      // Some responses should be rate limited after many requests
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});