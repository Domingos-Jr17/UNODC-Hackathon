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

      if (!user) return null;

      // Converter campos de data para string
      return {
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at?.toISOString() || undefined,
        last_login_at: user.last_login_at?.toISOString() || undefined,
        locked_until: user.locked_until?.toISOString() || undefined
      } as UserInterface;
    } catch (error) {
      throw error;
    }
  }

  static async create(userData: Partial<UserInterface>): Promise<number> {
    try {
      // Criptografar apenas os campos sensíveis
      const encryptedUserData = encryptionService.encryptUserData(userData);

      const user = await prisma.user.create({
        data: {
          anonymous_code: encryptedUserData.anonymous_code as string,
          real_name: encryptedUserData.real_name || null,
          phone: encryptedUserData.phone || null,
          email: encryptedUserData.email || null,
          ngo_id: userData.ngo_id!,
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

  static async validateCredentials(anonymousCode: string): Promise<UserInterface | null> {
    return await this.findByAnonymousCode(anonymousCode);
  }

  // New methods for staff email/password authentication
  static async findByEmail(email: string): Promise<UserInterface | null> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: email,
          is_active: true,
          role: { in: ['STAFF', 'ADMIN'] }
        }
      });

      if (!user) return null;

      return {
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at?.toISOString() || undefined,
        last_login_at: user.last_login_at?.toISOString() || undefined,
        locked_until: user.locked_until?.toISOString() || undefined
      } as UserInterface;
    } catch (error) {
      throw error;
    }
  }

  static async validateStaffCredentials(email: string, password: string): Promise<UserInterface | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user || !user.password) {
        return null;
      }

      // Verify password using bcrypt
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateLastLogin(anonymousCode: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { anonymous_code: anonymousCode },
        data: { last_login_at: new Date() }
      });
    } catch (error) {
      throw error;
    }
  }

  // New ORM-like methods using Prisma
  static async findUnique(where: { anonymous_code: string }): Promise<UserInterface | null> {
    try {
      const user = await prisma.user.findUnique({
        where
      });

      if (!user) return null;

      // Converter campos de data para string
      return {
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at?.toISOString() || undefined,
        last_login_at: user.last_login_at?.toISOString() || undefined,
        locked_until: user.locked_until?.toISOString() || undefined
      } as UserInterface;
    } catch (error) {
      throw error;
    }
  }

  static async findMany(): Promise<UserInterface[]> {
    try {
      const users = await prisma.user.findMany({
        where: { is_active: true }
      });

      return users.map(user => ({
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at?.toISOString() || undefined,
        last_login_at: user.last_login_at?.toISOString() || undefined,
        locked_until: user.locked_until?.toISOString() || undefined
      })) as UserInterface[];
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

      // Converter campos de data para string
      return {
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at?.toISOString(),
        last_login_at: user.last_login_at?.toISOString(),
        locked_until: user.locked_until?.toISOString()
      } as UserInterface;
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
