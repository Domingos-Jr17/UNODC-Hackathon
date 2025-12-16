#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
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

async function runMigrations() {
  const prisma = new PrismaClient()

  try {
    logger.info('🔄 Starting database migrations...')

    // Check database connection
    await prisma.$connect()
    logger.info('✅ Database connected successfully')

    // Run Prisma migrations
    // Note: In a real project, you would use prisma migrate deploy
    // For this demo, we'll ensure the database is properly set up

    // Initialize default data
    await initializeDefaultData(prisma)

    logger.info('✅ Database migrations completed successfully')

  } catch (error) {
    logger.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function initializeDefaultData(prisma: PrismaClient) {
  logger.info('📝 Initializing default data...')

  // Check if NGOs exist, create default if not
  const ngoCount = await prisma.nGO.count()
  if (ngoCount === 0) {
    await prisma.nGO.createMany({
      data: [
        {
          id: 'ngo-001',
          name: 'Centro de Acolhimento Maputo',
          contact_person: 'Ana Joaquim',
          phone: '+258821234567',
          email: 'contacto@centromaputo.wira',
          address: 'Av. Julius Nyerere, Maputo'
        },
        {
          id: 'ngo-002',
          name: 'Projeto Esperança',
          contact_person: 'Carlos Mandlate',
          phone: '+258847654321',
          email: 'esperanca@ong.wira',
          address: 'Rua da República, Beira'
        }
      ]
    })
    logger.info('✅ Default NGOs created')
  }

  // Check if courses exist, create default if not
  const courseCount = await prisma.course.count()
  if (courseCount === 0) {
    await prisma.course.createMany({
      data: [
        {
          id: 'costura-001',
          title: 'Costura Avançada',
          description: 'Curso profissional de costura com foco em moda e confecção industrial',
          instructor: 'Maria da Glória',
          duration_hours: 40,
          modules_count: 8,
          level: 'Avançado',
          skills: 'Costura industrial, design de moda, gestão de produção'
        },
        {
          id: 'culinaria-001',
          title: 'Culinária Profissional',
          description: 'Formação em gastronomia com ênfase na culinária moçambicana',
          instructor: 'Chef Matumbo',
          duration_hours: 35,
          modules_count: 7,
          level: 'Intermediário',
          skills: 'Cozinha moçambicana, gestão de cozinha, higiene alimentar'
        },
        {
          id: 'agricultura-001',
          title: 'Agricultura Sustentável',
          description: 'Técnicas modernas de agricultura sustentável e agroecologia',
          instructor: 'Dr. Zeca',
          duration_hours: 30,
          modules_count: 6,
          level: 'Básico',
          skills: 'Agroecologia, irrigação, gestão agrícola, comercialização'
        }
      ]
    })
    logger.info('✅ Default courses created')
  }

  logger.info('✅ Default data initialization completed')
}

// Run migrations
if (require.main === module) {
  runMigrations()
}

export { runMigrations, initializeDefaultData }