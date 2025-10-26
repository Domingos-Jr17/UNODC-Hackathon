import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authLimiter, validateLogin, handleValidationErrors, logger } from '@/middleware/security'
import { get } from '@/database'
import { LoginRequest, LoginResponse, JWTayload, User } from '@/types'

const router = express.Router()

/**
 * Login with anonymous code
 * POST /api/auth/login
 */
router.post('/login', authLimiter, validateLogin, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  const { code } = req.body as LoginRequest
  const normalizedCode = code.toUpperCase()

  logger.info('Login attempt', {
    anonymousCode: normalizedCode,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  try {
    // Query database for user
    const row = await get<User>(
      'SELECT * FROM users WHERE anonymous_code = ?',
      [normalizedCode]
    )

    if (!row) {
      logger.warn('Login attempt with invalid code', {
        anonymousCode: normalizedCode,
        ip: req.ip
      })
      res.status(401).json({
        error: 'Código de acesso inválido'
      })
      return
    }

    // Generate JWT token with secure secret
    const token = jwt.sign(
      {
        anonymousCode: row.anonymous_code,
        ngoId: row.ngo_id,
        sessionId: Math.random().toString(36).substring(2, 15)
      } as JWTayload,
      process.env.JWT_SECRET!,
      {
        expiresIn: '24h',
        issuer: 'wira-platform',
        audience: 'wira-app'
      }
    )

    // Remove sensitive data from response
    const safeUser = {
      anonymousCode: row.anonymous_code,
      ngoId: row.ngo_id,
      createdAt: row.created_at
    }

    logger.info('Successful login', {
      anonymousCode: normalizedCode,
      ngoId: row.ngo_id,
      ip: req.ip
    })

    const response: LoginResponse = {
      success: true,
      token,
      user: safeUser,
      expiresIn: '24h'
    }

    res.json(response)
  } catch (error) {
    logger.error('Database error during login', {
      error: (error as Error).message,
      anonymousCode: normalizedCode
    })
    res.status(500).json({
      error: 'Erro interno do servidor'
    })
  }
})

/**
 * Validate JWT token
 * POST /api/auth/validate
 */
router.post('/validate', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    res.status(401).json({
      error: 'Token não fornecido'
    })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTayload

    logger.info('Token validation successful', {
      anonymousCode: decoded.anonymousCode,
      sessionId: decoded.sessionId
    })

    res.json({
      success: true,
      valid: true,
      user: {
        anonymousCode: decoded.anonymousCode,
        ngoId: decoded.ngoId
      }
    })
  } catch (error) {
    logger.warn('Invalid token validation attempt', {
      error: (error as Error).message,
      ip: req.ip
    })

    res.status(401).json({
      error: 'Token inválido ou expirado'
    })
  }
})

/**
 * Refresh token
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    res.status(401).json({
      error: 'Token não fornecido'
    })
    return
  }

  try {
    // Verify current token (even if expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      ignoreExpiration: true
    }) as JWTayload

    // Generate new token
    const newToken = jwt.sign(
      {
        anonymousCode: decoded.anonymousCode,
        ngoId: decoded.ngoId,
        sessionId: Math.random().toString(36).substring(2, 15)
      } as JWTayload,
      process.env.JWT_SECRET!,
      {
        expiresIn: '24h',
        issuer: 'wira-platform',
        audience: 'wira-app'
      }
    )

    logger.info('Token refreshed', {
      anonymousCode: decoded.anonymousCode,
      ip: req.ip
    })

    res.json({
      success: true,
      token: newToken,
      expiresIn: '24h'
    })
  } catch (error) {
    logger.warn('Token refresh failed', {
      error: (error as Error).message,
      ip: req.ip
    })

    res.status(401).json({
      error: 'Token inválido'
    })
  }
})

/**
 * Logout
 * DELETE /api/auth/logout
 */
router.delete('/logout', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTayload

      logger.info('User logout', {
        anonymousCode: decoded.anonymousCode,
        ip: req.ip
      })
    } catch (error) {
      logger.warn('Logout with invalid token', {
        error: (error as Error).message,
        ip: req.ip
      })
    }
  }

  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  })
})

/**
 * Check if code is available (for admin use)
 * GET /api/auth/check/:code
 */
router.get('/check/:code', async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params
  const normalizedCode = code.toUpperCase()

  // Validate code format
  if (!/^V\d{4}$/i.test(normalizedCode)) {
    res.status(400).json({
      error: 'Código deve estar no formato V####'
    })
    return
  }

  try {
    const row = await get<User>(
      'SELECT anonymous_code, created_at FROM users WHERE anonymous_code = ?',
      [normalizedCode]
    )

    res.json({
      success: true,
      available: !row,
      code: normalizedCode,
      exists: !!row,
      createdAt: row?.created_at || null
    })
  } catch (error) {
    logger.error('Database error checking code', {
      error: (error as Error).message,
      code: normalizedCode
    })
    res.status(500).json({
      error: 'Erro interno do servidor'
    })
  }
})

export default router