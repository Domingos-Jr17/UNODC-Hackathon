#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import winston from 'winston'

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

async function seedData() {
  const prisma = new PrismaClient()

  try {
    logger.info('🌱 Starting data seeding...')

    // Check database connection
    await prisma.$connect()
    logger.info('✅ Database connected successfully')

    // Seed demo users
    await seedUsers(prisma)

    // Seed sample progress data
    await seedProgress(prisma)

    // Seed sample certificates
    await seedCertificates(prisma)

    logger.info('✅ Data seeding completed successfully')

  } catch (error) {
    logger.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function seedUsers(prisma: PrismaClient) {
  logger.info('👥 Creating demo users...')

  const demoUsers = [
    {
      anonymous_code: 'V0042',
      real_name: 'Maria Silva',
      phone: '+258841234567',
      email: 'maria@demo.wira',
      ngo_id: 'ngo-001'
    },
    {
      anonymous_code: 'V0038',
      real_name: 'Ana Joaquim',
      phone: '+258823456789',
      email: 'ana@demo.wira',
      ngo_id: 'ngo-001'
    },
    {
      anonymous_code: 'V0031',
      real_name: 'João Mandlate',
      phone: '+258845678901',
      email: 'joao@demo.wira',
      ngo_id: 'ngo-002'
    }
  ]

  for (const user of demoUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { anonymous_code: user.anonymous_code }
    })

    if (!existingUser) {
      await prisma.user.create({
        data: user
      })
      logger.info(`✅ Created user: ${user.anonymous_code}`)
    } else {
      logger.info(`ℹ️  User already exists: ${user.anonymous_code}`)
    }
  }
}

async function seedProgress(prisma: PrismaClient) {
  logger.info('📊 Creating progress data...')

  const progressData = [
    {
      user_code: 'V0042',
      course_id: 'costura-001',
      completed_modules: '1,2,3',
      percentage: 37,
      current_module: 4,
      quiz_attempts: 1,
      last_quiz_score: 85
    },
    {
      user_code: 'V0038',
      course_id: 'culinaria-001',
      completed_modules: '1',
      percentage: 14,
      current_module: 2,
      quiz_attempts: 0
    },
    {
      user_code: 'V0031',
      course_id: 'costura-001',
      completed_modules: '1,2,3,4,5,6,7,8',
      percentage: 100,
      current_module: 8,
      quiz_attempts: 2,
      last_quiz_score: 92,
      completed_at: new Date()
    }
  ]

  for (const progress of progressData) {
    const existingProgress = await prisma.progress.findUnique({
      where: {
        user_code_course_id: {
          user_code: progress.user_code,
          course_id: progress.course_id
        }
      }
    })

    if (!existingProgress) {
      await prisma.progress.create({
        data: progress
      })
      logger.info(`✅ Created progress: ${progress.user_code} - ${progress.course_id}`)
    } else {
      logger.info(`ℹ️  Progress already exists: ${progress.user_code} - ${progress.course_id}`)
    }
  }
}

async function seedCertificates(prisma: PrismaClient) {
  logger.info('🏆 Creating certificates...')

  const certificates = [
    {
      anonymous_code: 'V0031',
      course_id: 'costura-001',
      course_title: 'Costura Avançada',
      verification_code: 'WIRA-V0031-COSTURA-2025-001',
      qr_code: 'QR-WIRA-V0031-COSTURA-2025-001',
      instructor: 'Maria da Glória',
      institution: 'Centro de Acolhimento Maputo',
      score: 92,
      max_score: 100,
      verified: true,
      verification_date: new Date(),
      verification_ip: '127.0.0.1'
    }
  ]

  for (const cert of certificates) {
    const existingCert = await prisma.certificate.findUnique({
      where: { verification_code: cert.verification_code }
    })

    if (!existingCert) {
      await prisma.certificate.create({
        data: cert
      })
      logger.info(`✅ Created certificate: ${cert.verification_code}`)
    } else {
      logger.info(`ℹ️  Certificate already exists: ${cert.verification_code}`)
    }
  }
}

// Run seeding
if (require.main === module) {
  seedData()
}

export { seedData }