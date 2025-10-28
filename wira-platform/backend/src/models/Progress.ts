import { get, all, run } from '../database';
import { Progress } from '../types';

class ProgressModel {
  static async findByUserAndCourse(userCode: string, courseId: string): Promise<Progress | null> {
    const query = 'SELECT * FROM progress WHERE user_code = ? AND course_id = ?';
    return await get<Progress>(query, [userCode, courseId]);
  }

  static async createOrUpdate(userCode: string, courseId: string, progressData: Partial<Progress>): Promise<void> {
    const existing = await this.findByUserAndCourse(userCode, courseId);

    if (existing) {
      // Update existing progress
      const query = `
        UPDATE progress 
        SET completed_modules = ?, percentage = ?, current_module = ?, 
            quiz_attempts = ?, last_quiz_score = ?, last_activity = CURRENT_TIMESTAMP
        WHERE user_code = ? AND course_id = ?
      `;
      await run(query, [
        progressData.completed_modules,
        progressData.percentage,
        progressData.current_module,
        progressData.quiz_attempts,
        progressData.last_quiz_score,
        userCode,
        courseId
      ]);
    } else {
      // Create new progress record
      const query = `
        INSERT INTO progress (user_code, course_id, completed_modules, percentage, current_module, quiz_attempts, last_quiz_score, last_activity)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;
      await run(query, [
        userCode,
        courseId,
        progressData.completed_modules,
        progressData.percentage,
        progressData.current_module,
        progressData.quiz_attempts,
        progressData.last_quiz_score
      ]);
    }
  }

  static async updateProgress(userCode: string, courseId: string, moduleIds: string[], percentage: number): Promise<void> {
    const completedModulesStr = JSON.stringify(moduleIds);
    const query = `
      UPDATE progress 
      SET completed_modules = ?, percentage = ?, last_activity = CURRENT_TIMESTAMP
      WHERE user_code = ? AND course_id = ?
    `;
    await run(query, [completedModulesStr, percentage, userCode, courseId]);
  }

  // New ORM-like methods
  static async findUnique(where: { user_code: string; course_id: string }): Promise<Progress | null> {
    return await this.findByUserAndCourse(where.user_code, where.course_id);
  }

  static async findMany(): Promise<Progress[]> {
    const query = 'SELECT * FROM progress';
    return await all<Progress>(query);
  }

  static async create(data: Omit<Progress, 'id' | 'last_activity'>): Promise<Progress> {
    // In a real implementation with Prisma, this would be:
    // return await prisma.progress.create({ data });

    // For now, we'll simulate the behavior
    const progress: Progress = {
      id: Date.now(),
      user_code: data.user_code,
      course_id: data.course_id,
      completed_modules: data.completed_modules,
      percentage: data.percentage,
      current_module: data.current_module,
      quiz_attempts: data.quiz_attempts,
      last_quiz_score: data.last_quiz_score || 0,
      last_activity: new Date().toISOString()
    };

    return progress;
  }

  static async update(
    where: { user_code: string; course_id: string },
    data: Partial<Omit<Progress, 'id' | 'user_code' | 'course_id' | 'last_activity'>>
  ): Promise<Progress | null> {
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      values.push(value);
    });

    if (updates.length === 0) {
      return await this.findByUserAndCourse(where.user_code, where.course_id);
    }

    values.push(where.user_code, where.course_id);

    const query = `
      UPDATE progress 
      SET ${updates.join(', ')}, last_activity = CURRENT_TIMESTAMP
      WHERE user_code = ? AND course_id = ?
    `;

    await run(query, values);
    return await this.findByUserAndCourse(where.user_code, where.course_id);
  }

  static async delete(where: { user_code: string; course_id: string }): Promise<void> {
    const query = 'DELETE FROM progress WHERE user_code = ? AND course_id = ?';
    await run(query, [where.user_code, where.course_id]);
  }
}

export default ProgressModel;