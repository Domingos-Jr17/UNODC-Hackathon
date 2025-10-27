import { get, all, run } from '../database';
import encryptionService from '../services/encryption';
import { User as UserInterface } from '../types';

class UserModel {
  static async findByAnonymousCode(anonymousCode: string): Promise<UserInterface | null> {
    const query = 'SELECT * FROM users WHERE anonymous_code = ?';
    return await get<UserInterface>(query, [anonymousCode]);
  }

  static async create(userData: Partial<UserInterface>): Promise<number> {
    try {
      const encryptedData = encryptionService.encryptUserData(userData);

      const query = `
        INSERT INTO users (anonymous_code, real_name, phone, email, ngo_id, created_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const result = await run(query, [
        encryptedData.anonymous_code,
        encryptedData.real_name,
        encryptedData.phone,
        encryptedData.email,
        encryptedData.ngo_id
      ]);

      return result.lastID;
    } catch (error) {
      throw error;
    }
  }

  static async updateLoginAttempt(anonymousCode: string): Promise<void> {
    const query = `
      UPDATE users 
      SET login_attempts = login_attempts + 1, 
          last_login_at = CURRENT_TIMESTAMP 
      WHERE anonymous_code = ?
    `;
    await run(query, [anonymousCode]);
  }

  static async resetLoginAttempts(anonymousCode: string): Promise<void> {
    const query = `
      UPDATE users 
      SET login_attempts = 0, 
          locked_until = NULL 
      WHERE anonymous_code = ?
    `;
    await run(query, [anonymousCode]);
  }

  static async lockAccount(anonymousCode: string, until: string): Promise<void> {
    const query = `
      UPDATE users 
      SET locked_until = ? 
      WHERE anonymous_code = ?
    `;
    await run(query, [until, anonymousCode]);
  }

  static async validateCredentials(anonymousCode: string, password?: string): Promise<UserInterface | null> {
    return await this.findByAnonymousCode(anonymousCode);
  }

  // New ORM-like methods
  static async findUnique(where: { anonymous_code: string }): Promise<UserInterface | null> {
    return await this.findByAnonymousCode(where.anonymous_code);
  }

  static async findMany(): Promise<UserInterface[]> {
    const query = 'SELECT * FROM users';
    return await all<UserInterface>(query);
  }

  static async update(
    where: { anonymous_code: string }, 
    data: Partial<UserInterface>
  ): Promise<UserInterface | null> {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'anonymous_code') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (updates.length === 0) {
      return await this.findByAnonymousCode(where.anonymous_code);
    }
    
    values.push(where.anonymous_code);
    
    const query = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE anonymous_code = ?
    `;
    
    await run(query, values);
    return await this.findByAnonymousCode(where.anonymous_code);
  }

  static async delete(where: { anonymous_code: string }): Promise<void> {
    const query = 'DELETE FROM users WHERE anonymous_code = ?';
    await run(query, [where.anonymous_code]);
  }
}

export default UserModel;