import { get, all, run } from '../database';
import { AuditLog } from '../types';

class AuditLogModel {
  static async create(logData: Partial<AuditLog>): Promise<void> {
    const query = `
      INSERT INTO audit_logs (
        user_code, action, table_name, record_id, old_values, new_values, ip_address, user_agent, timestamp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    await run(query, [
      logData.user_code,
      logData.action,
      logData.table_name,
      logData.record_id,
      logData.old_values,
      logData.new_values,
      logData.ip_address,
      logData.user_agent
    ]);
  }

  static async findByUser(userCode: string, limit: number = 50): Promise<AuditLog[]> {
    const query = `
      SELECT * FROM audit_logs 
      WHERE user_code = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    return await all<AuditLog>(query, [userCode, limit]);
  }

  static async findByAction(action: string, limit: number = 50): Promise<AuditLog[]> {
    const query = `
      SELECT * FROM audit_logs 
      WHERE action = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    return await all<AuditLog>(query, [action, limit]);
  }

  static async findByTable(tableName: string, limit: number = 50): Promise<AuditLog[]> {
    const query = `
      SELECT * FROM audit_logs 
      WHERE table_name = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    return await all<AuditLog>(query, [tableName, limit]);
  }

  // New ORM-like methods
  static async findMany(args?: {
    where?: Partial<AuditLog>;
    orderBy?: { timestamp: 'asc' | 'desc' };
    take?: number;
    skip?: number;
  }): Promise<AuditLog[]> {
    let query = 'SELECT * FROM audit_logs';
    const conditions: string[] = [];
    const values: any[] = [];

    if (args?.where) {
      Object.entries(args.where).forEach(([key, value]) => {
        conditions.push(`${key} = ?`);
        values.push(value);
      });

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
    }

    if (args?.orderBy) {
      query += ` ORDER BY timestamp ${args.orderBy.timestamp === 'asc' ? 'ASC' : 'DESC'}`;
    } else {
      query += ' ORDER BY timestamp DESC';
    }

    if (args?.take) {
      query += ` LIMIT ${args.take}`;
      if (args.skip) {
        query += ` OFFSET ${args.skip}`;
      }
    }

    return await all<AuditLog>(query, values);
  }

  static async createWithPrisma(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    // In a real implementation with Prisma, this would be:
    // return await prisma.auditLog.create({ data });

    // For now, we'll simulate the behavior
    const auditLog: AuditLog = {
      id: Date.now(),
      user_code: data.user_code || 'system', // Provide default for undefined
      action: data.action,
      table_name: data.table_name || '',
      record_id: data.record_id || '',
      old_values: data.old_values || '',
      new_values: data.new_values || '',
      ip_address: data.ip_address || '',
      user_agent: data.user_agent || '',
      timestamp: new Date().toISOString()
    };

    return auditLog;
  }

  static async findFirst(args: {
    where?: Partial<AuditLog>;
    orderBy?: { timestamp: 'asc' | 'desc' };
  }): Promise<AuditLog | null> {
    const results = await this.findMany({
      ...args,
      take: 1
    });

    return results.length > 0 ? results[0] : null;
  }

  static async count(where?: Partial<AuditLog>): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM audit_logs';
    const values: any[] = [];

    if (where) {
      const conditions: string[] = [];
      Object.entries(where).forEach(([key, value]) => {
        conditions.push(`${key} = ?`);
        values.push(value);
      });

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
    }

    const result = await get<{ count: number }>(query, values);
    return result ? result.count : 0;
  }
}

export default AuditLogModel;
