import prismaService from '../services/prisma';
import encryptionService from '../services/encryption';
import { User as UserInterface } from '../types';

const prisma = prismaService.getClient();

class UserModel {
  static async findByAnonymousCode(anonymousCode: string): Promise<UserInterface | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { anonymous_code: anonymousCode }
      });
      
      return user as UserInterface | null;
    } catch (error) {
      throw error;
    }
  }

  static async create(userData: Partial<UserInterface>): Promise<number> {
    try {
      const encryptedData = encryptionService.encryptUserData(userData);

      const user = await prisma.user.create({
        data: {
          anonymous_code: encryptedData.anonymous_code,
          real_name: encryptedData.real_name,
          phone: encryptedData.phone,
          email: encryptedData.email,
          ngo_id: encryptedData.ngo_id,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      return user.id;
    } catch (error) {
      throw error;
    }
  }

  static async updateLoginAttempt(anonymousCode: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { anonymous_code: anonymousCode },
        data: {
          login_attempts: { increment: 1 },
          last_login_at: new Date()
        }
      });
    } catch (error) {
      throw error;
    }
  }

  static async resetLoginAttempts(anonymousCode: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { anonymous_code: anonymousCode },
        data: {
          login_attempts: 0,
          locked_until: null
        }
      });
    } catch (error) {
      throw error;
    }
  }

  static async lockAccount(anonymousCode: string, until: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { anonymous_code: anonymousCode },
        data: {
          locked_until: new Date(until)
        }
      });
    } catch (error) {
      throw error;
    }
  }

  static async validateCredentials(anonymousCode: string, password?: string): Promise<UserInterface | null> {
    return await this.findByAnonymousCode(anonymousCode);
  }

  // New ORM-like methods using Prisma
  static async findUnique(where: { anonymous_code: string }): Promise<UserInterface | null> {
    try {
      const user = await prisma.user.findUnique({
        where
      });
      
      return user as UserInterface | null;
    } catch (error) {
      throw error;
    }
  }

  static async findMany(): Promise<UserInterface[]> {
    try {
      const users = await prisma.user.findMany({
        where: { is_active: true }
      });
      
      return users as UserInterface[];
    } catch (error) {
      throw error;
    }
  }

  static async update(
    where: { anonymous_code: string }, 
    data: Partial<UserInterface>
  ): Promise<UserInterface | null> {
    try {
      // Remove fields that shouldn't be updated directly
      const updateData: any = { ...data };
      delete updateData.id;
      delete updateData.anonymous_code;
      delete updateData.created_at;
      
      // Add updated timestamp
      updateData.updated_at = new Date();

      const user = await prisma.user.update({
        where,
        data: updateData
      });

      return user as UserInterface;
    } catch (error) {
      throw error;
    }
  }

  static async delete(where: { anonymous_code: string }): Promise<void> {
    try {
      await prisma.user.delete({
        where
      });
    } catch (error) {
      throw error;
    }
  }
}

export default UserModel;