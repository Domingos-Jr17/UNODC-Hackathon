import request from 'supertest'
import app from '../../src/index'
import { get } from '../../src/database'
import { User, Course } from '../../src/types'

describe('API Integration Tests', () => {
  let authToken: string
  let testUserCode = 'V0042'

  beforeEach(async () => {
    // Login and get token for protected routes
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ code: testUserCode })

    authToken = loginResponse.body.token
  })

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('OK')
      expect(response.body.services).toBeDefined()
      expect(response.body.services.api).toBe('online')
      expect(response.body.services.database).toBe('connected')
      expect(response.body.services.security).toBeDefined()
    })
  })

  describe('Root Endpoint', () => {
    test('should return API information', async () => {
      const response = await request(app)
        .get('/')

      expect(response.status).toBe(200)
      expect(response.body.message).toContain('WIRA Platform API')
      expect(response.body.version).toBe('3.0.0')
      expect(response.body.typescript).toBe('enabled')
    })
  })

  describe('API Documentation', () => {
    test('should return API documentation', async () => {
      const response = await request(app)
        .get('/api')

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('WIRA Platform API')
      expect(response.body.version).toBe('3.0.0')
      expect(response.body.endpoints).toBeDefined()
      expect(response.body.security).toBeDefined()
      expect(response.body.security.typescript).toBe('Enabled')
    })
  })

  describe('Authentication Routes', () => {
    describe('POST /api/auth/login', () => {
      test('should login with valid code', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ code: 'V0042' })

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.token).toBeDefined()
        expect(response.body.user.anonymousCode).toBe('V0042')
        expect(response.body.expiresIn).toBe('24h')
      })

      test('should reject invalid code format', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ code: 'INVALID' })

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Dados inválidos')
        expect(response.body.details).toBeDefined()
      })

      test('should reject non-existent code', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ code: 'V9999' })

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Código de acesso inválido')
      })

      test('should handle missing code', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({})

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Dados inválidos')
      })

      test('should be case insensitive', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ code: 'v0042' })

        expect(response.status).toBe(200)
        expect(response.body.user.anonymousCode).toBe('V0042')
      })
    })

    describe('POST /api/auth/validate', () => {
      test('should validate valid token', async () => {
        const response = await request(app)
          .post('/api/auth/validate')
          .set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.valid).toBe(true)
        expect(response.body.user.anonymousCode).toBe('V0042')
      })

      test('should reject invalid token', async () => {
        const response = await request(app)
          .post('/api/auth/validate')
          .set('Authorization', 'Bearer invalid-token')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Token inválido ou expirado')
      })

      test('should reject missing token', async () => {
        const response = await request(app)
          .post('/api/auth/validate')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Token não fornecido')
      })
    })

    describe('POST /api/auth/refresh', () => {
      test('should refresh valid token', async () => {
        const response = await request(app)
          .post('/api/auth/refresh')
          .set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.token).toBeDefined()
        expect(response.body.token).not.toBe(authToken)
      })

      test('should reject invalid token', async () => {
        const response = await request(app)
          .post('/api/auth/refresh')
          .set('Authorization', 'Bearer invalid-token')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Token inválido')
      })
    })

    describe('DELETE /api/auth/logout', () => {
      test('should logout successfully', async () => {
        const response = await request(app)
          .delete('/api/auth/logout')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe('Logout realizado com sucesso')
      })

      test('should handle logout with token', async () => {
        const response = await request(app)
          .delete('/api/auth/logout')
          .set('Authorization', `Bearer ${authToken}`)

        expect(response.status).toBe(200)
      })
    })

    describe('GET /api/auth/check/:code', () => {
      test('should check available code', async () => {
        const response = await request(app)
          .get('/api/auth/check/V9999')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.available).toBe(true)
        expect(response.body.exists).toBe(false)
      })

      test('should check existing code', async () => {
        const response = await request(app)
          .get('/api/auth/check/V0042')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.available).toBe(false)
        expect(response.body.exists).toBe(true)
      })

      test('should validate code format', async () => {
        const response = await request(app)
          .get('/api/auth/check/INVALID')

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Código deve estar no formato V####')
      })
    })
  })

  describe('Courses API', () => {
    describe('GET /api/courses', () => {
      test('should list all courses', async () => {
        const response = await request(app)
          .get('/api/courses')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.courses)).toBe(true)
        expect(response.body.courses.length).toBeGreaterThan(0)

        const course = response.body.courses.find((c: Course) => c.id === 'costura')
        expect(course).toBeDefined()
        expect(course.title).toContain('Costura')
      })
    })

    describe('GET /api/courses/:id', () => {
      test('should get specific course', async () => {
        const response = await request(app)
          .get('/api/courses/costura')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.course.id).toBe('costura')
        expect(response.body.course.title).toContain('Costura')
      })

      test('should return 404 for non-existent course', async () => {
        const response = await request(app)
          .get('/api/courses/nonexistent')

        expect(response.status).toBe(404)
        expect(response.body.success).toBe(false)
      })
    })

    describe('GET /api/courses/:id/modules', () => {
      test('should get course modules', async () => {
        const response = await request(app)
          .get('/api/courses/costura/modules')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.modules)).toBe(true)
        expect(response.body.modules.length).toBeGreaterThan(0)

        const module = response.body.modules[0]
        expect(module.title).toBeDefined()
        expect(module.duration).toBeDefined()
      })
    })

    describe('GET /api/courses/:id/quiz', () => {
      test('should get course quiz', async () => {
        const response = await request(app)
          .get('/api/courses/costura/quiz')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.quiz)).toBe(true)
        expect(response.body.quiz.length).toBeGreaterThan(0)

        const question = response.body.quiz[0]
        expect(question.question).toBeDefined()
        expect(question.options).toBeDefined()
        expect(question.correctAnswer).toBeDefined()
        expect(question.explanation).toBeDefined()
      })
    })

    describe('POST /api/courses/:id/invalidate-cache', () => {
      test('should invalidate course cache', async () => {
        const response = await request(app)
          .post('/api/courses/costura/invalidate-cache')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toContain('invalidado com sucesso')
      })
    })
  })

  describe('Security Info', () => {
    test('should return security information', async () => {
      const response = await request(app)
        .get('/api/security/info')

      expect(response.status).toBe(200)
      expect(response.body.security).toBeDefined()
      expect(response.body.security.rateLimiting).toBeDefined()
      expect(response.body.security.encryption).toBeDefined()
      expect(response.body.security.validation).toBeDefined()
      expect(response.body.security.encryption.enabled).toBe(true)
      expect(response.body.security.validation.enabled).toBe(true)
    })
  })

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(app)
        .get('/health')

      expect(response.headers['x-content-type-options']).toBe('nosniff')
      expect(response.headers['x-frame-options']).toBe('DENY')
      expect(response.headers['x-xss-protection']).toBeDefined()
    })
  })

  describe('CORS', () => {
    test('should handle CORS preflight', async () => {
      const response = await request(app)
        .options('/api/courses')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')

      expect(response.status).toBe(204)
      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })
  })

  describe('Rate Limiting', () => {
    test('should apply rate limits to API endpoints', async () => {
      const promises = Array(50).fill().map(() =>
        request(app).get('/api/courses')
      )

      const responses = await Promise.all(promises)
      const rateLimitedResponses = responses.filter(r => r.status === 429)

      // Some responses should be rate limited after many requests
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })

    test('should apply stricter rate limits to auth endpoints', async () => {
      const promises = Array(10).fill().map(() =>
        request(app)
          .post('/api/auth/login')
          .send({ code: 'V0042' })
      )

      const responses = await Promise.all(promises)
      const rateLimitedResponses = responses.filter(r => r.status === 429)

      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Endpoint não encontrado')
    })

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid-json')

      expect(response.status).toBe(400)
    })
  })

  describe('Request ID', () => {
    test('should include request ID in response headers', async () => {
      const response = await request(app)
        .get('/health')

      expect(response.headers['x-request-id']).toBeDefined()
      expect(response.headers['x-request-id']).toMatch(/^[a-z0-9]{13}$/)
    })
  })

  describe('TypeScript Benefits', () => {
    test('should maintain type safety in API responses', async () => {
      const response = await request(app)
        .get('/api/courses')

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.courses)).toBe(true)

      // TypeScript ensures the response structure is correct
      const course = response.body.courses[0]
      expect(course).toHaveProperty('id')
      expect(course).toHaveProperty('title')
      expect(course).toHaveProperty('duration_hours')
    })
  })
})