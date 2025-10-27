import { Request, Response } from 'express';
import CourseModel from '../models/Course';
import cacheService from '../services/cache';
import { logger } from '../middleware/security';

class CourseController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      // Use ORM-like method to find all courses
      const courses = await CourseModel.findMany();

      const response = {
        success: true,
        courses,
        cached: false
      };

      res.json(response);

      // Warm cache with individual courses
      if (courses) {
        courses.forEach(course => {
          cacheService.set(`course:${course.id}`, course, 1800).catch(err => {
            logger.error('Failed to warm course cache', { error: (err as Error).message, courseId: course.id });
          });
        });
      }
    } catch (error) {
      logger.error('Database error fetching courses', { error: (error as Error).message });
      res.status(500).json({ error: 'Erro no banco de dados' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      // Use ORM-like method to find course by ID
      const course = await CourseModel.findUnique({
        id
      });

      if (!course) {
        res.status(404).json({
          success: false,
          error: 'Curso não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        course,
        cached: false
      });
    } catch (error) {
      logger.error('Database error fetching course', { error: (error as Error).message, courseId: id });
      res.status(500).json({ error: 'Erro no banco de dados' });
    }
  }

  static async getModules(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    // Check cache first
    try {
      const cachedModules = await cacheService.get(`course:${id}:modules`);
      if (cachedModules) {
        res.json({
          success: true,
          modules: cachedModules,
          cached: true
        });
        return;
      }

      // Get modules from model using ORM-like method
      const modules = await CourseModel.findModulesByCourseId(id);

      // Cache the result
      await cacheService.set(`course:${id}:modules`, modules, 3600);

      res.json({
        success: true,
        modules,
        cached: false
      });
    } catch (error) {
      logger.error('Error checking course modules cache', { error: (error as Error).message, courseId: id });
      res.status(500).json({ error: 'Erro ao buscar módulos do curso' });
    }
  }

  static async getQuiz(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    // Check cache first
    try {
      const cachedQuiz = await cacheService.get(`course:${id}:quiz`);
      if (cachedQuiz) {
        res.json({
          success: true,
          quiz: cachedQuiz,
          cached: true
        });
        return;
      }

      // Get quiz from model using ORM-like method
      const quiz = await CourseModel.findQuizByCourseId(id);

      // Cache the result
      await cacheService.set(`course:${id}:quiz`, quiz, 3600);

      res.json({
        success: true,
        quiz,
        cached: false
      });
    } catch (error) {
      logger.error('Error checking course quiz cache', { error: (error as Error).message, courseId: id });
      res.status(500).json({ error: 'Erro ao buscar quiz do curso' });
    }
  }

  static async invalidateCache(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await cacheService.invalidateCourseCache(id);
      logger.info('Course cache invalidated', { courseId: id });

      res.json({
        success: true,
        message: 'Cache do curso invalidado com sucesso'
      });
    } catch (error) {
      logger.error('Error invalidating course cache', { error: (error as Error).message, courseId: id });
      res.status(500).json({
        error: 'Erro ao invalidar cache do curso'
      });
    }
  }

  // New methods that would use Prisma-style operations
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const courseData = req.body;
      
      // In a real Prisma implementation, this would be:
      // const course = await prisma.course.create({ data: courseData });
      
      // For now, we'll simulate with our ORM-like method
      const course = await CourseModel.create(courseData);

      res.status(201).json({
        success: true,
        course,
        message: 'Curso criado com sucesso'
      });
    } catch (error) {
      logger.error('Error creating course', { error: (error as Error).message });
      res.status(500).json({
        error: 'Erro ao criar curso'
      });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData = req.body;

    try {
      // In a real Prisma implementation, this would be:
      // const course = await prisma.course.update({ 
      //   where: { id }, 
      //   data: updateData 
      // });
      
      // For now, we'll simulate with our ORM-like method
      const course = await CourseModel.update({ id }, updateData);

      if (!course) {
        res.status(404).json({
          success: false,
          error: 'Curso não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        course,
        message: 'Curso atualizado com sucesso'
      });
    } catch (error) {
      logger.error('Error updating course', { error: (error as Error).message, courseId: id });
      res.status(500).json({
        error: 'Erro ao atualizar curso'
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      // In a real Prisma implementation, this would be:
      // await prisma.course.delete({ where: { id } });
      
      // For now, we'll simulate with our ORM-like method
      await CourseModel.delete({ id });

      res.json({
        success: true,
        message: 'Curso removido com sucesso'
      });
    } catch (error) {
      logger.error('Error deleting course', { error: (error as Error).message, courseId: id });
      res.status(500).json({
        error: 'Erro ao remover curso'
      });
    }
  }
}

export default CourseController;