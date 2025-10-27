// BaseModel.ts - Base class for all models
import { get, all, run } from './database';

class BaseModel {
  static async get<T>(sql: string, params: any[] = []): Promise<T | null> {
    return await get<T>(sql, params);
  }

  static async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return await all<T>(sql, params);
  }

  static async run(sql: string, params: any[] = []): Promise<any> {
    return await run(sql, params);
  }
}

export default BaseModel;