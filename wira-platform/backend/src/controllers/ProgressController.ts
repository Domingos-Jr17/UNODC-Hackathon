import { Request, Response } from 'express';
import { logger } from '../middleware/security';
import ProgressModel from '../models/Progress';

class ProgressController {
  static async getUserProgress(req: Request, res: Response): Promise<void> {
    const { userCode, courseId } = req.params;

    try {
      // Use ORM-like method to find progress
      const progress = await ProgressModel.findUnique({
        user_code: userCode,
        course_id: courseId
      });

      if (!progress) {
        res.status(404).json({
          success: false,
          error: 'Progresso não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        progress
      });
    } catch (error) {
      logger.error('Database error fetching progress', { 
        error: (error as Error).message, 
        userCode, 
        courseId 
      });
      res.status(500).json({ 
        error: 'Erro no banco de dados' 
      });
    }
  }

  static async updateProgress(req: Request, res: Response): Promise<void> {
    const { userCode, courseId } = req.params;
    const { completedModules, percentage } = req.body;

    try {
      // Use ORM-like method to update progress
      await ProgressModel.updateProgress(userCode, courseId, completedModules, percentage);

      res.json({
        success: true,
        message: 'Progresso atualizado com sucesso'
      });
    } catch (error) {
      logger.error('Database error updating progress', { 
        error: (error as Error).message, 
        userCode, 
        courseId 
      });
      res.status(500).json({ 
        error: 'Erro no banco de dados' 
      });
    }
  }

  static async createProgress(req: Request, res: Response): Promise<void> {
    try {
      const progressData = req.body;
      
      // In a real Prisma implementation, this would be:
      // const progress = await prisma.progress.create({ data: progressData });
      
      // For now, we'll simulate with our ORM-like method
      const progress = await ProgressModel.create(progressData);

      res.status(201).json({
        success: true,
        progress,
        message: 'Progresso criado com sucesso'
      });
    } catch (error) {
      logger.error('Database error creating progress', { 
        error: (error as Error).message
      });
      res.status(500).json({ 
        error: 'Erro no banco de dados' 
      });
    }
  }

  static async updateProgressRecord(req: Request, res: Response): Promise<void> {
    const { userCode, courseId } = req.params;
    const updateData = req.body;

    try {
      // In a real Prisma implementation, this would be:
      // const progress = await prisma.progress.update({ 
      //   where: { user_code_course_id: { user_code: userCode, course_id: courseId } }, 
      //   data: updateData 
      // });
      
      // For now, we'll simulate with our ORM-like method
      const progress = await ProgressModel.update(
        { user_code: userCode, course_id: courseId }, 
        updateData
      );

      if (!progress) {
        res.status(404).json({
          success: false,
          error: 'Progresso não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        progress,
        message: 'Progresso atualizado com sucesso'
      });
    } catch (error) {
      logger.error('Database error updating progress record', { 
        error: (error as Error).message,
        userCode,
        courseId
      });
      res.status(500).json({ 
        error: 'Erro no banco de dados' 
      });
    }
  }

  static async deleteProgress(req: Request, res: Response): Promise<void> {
    const { userCode, courseId } = req.params;

    try {
      // In a real Prisma implementation, this would be:
      // await prisma.progress.delete({ 
      //   where: { user_code_course_id: { user_code: userCode, course_id: courseId } } 
      // });
      
      // For now, we'll simulate with our ORM-like method
      await ProgressModel.delete({ user_code: userCode, course_id: courseId });

      res.json({
        success: true,
        message: 'Progresso removido com sucesso'
      });
    } catch (error) {
      logger.error('Database error deleting progress', { 
        error: (error as Error).message,
        userCode,
        courseId
      });
      res.status(500).json({ 
        error: 'Erro no banco de dados' 
      });
    }
  }

  static async getAllProgress(req: Request, res: Response): Promise<void> {
    try {
      // In a real Prisma implementation, this would be:
      // const progressRecords = await prisma.progress.findMany();
      
      // For now, we'll simulate with our ORM-like method
      const progressRecords = await ProgressModel.findMany();

      res.json({
        success: true,
        progress: progressRecords
      });
    } catch (error) {
      logger.error('Database error fetching all progress', { 
        error: (error as Error).message
      });
      res.status(500).json({ 
        error: 'Erro no banco de dados' 
      });
    }
  }
}

export default ProgressController;