import { get, all, run } from '../database';
import { NGO } from '../types';

class NGOModel {
  static async findById(id: string): Promise<NGO | null> {
    const query = 'SELECT * FROM ngos WHERE id = ?';
    return await get<NGO>(query, [id]);
  }

  static async findAll(): Promise<NGO[]> {
    const query = 'SELECT * FROM ngos WHERE is_active = 1';
    return await all<NGO>(query);
  }

  static async create(ngoData: Partial<NGO>): Promise<string> {
    const id = `ngo-${Date.now()}`;

    const query = `
      INSERT INTO ngos (id, name, contact_person, phone, email, address, license_number, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    await run(query, [
      id,
      ngoData.name,
      ngoData.contact_person,
      ngoData.phone,
      ngoData.email,
      ngoData.address,
      ngoData.license_number
    ]);

    return id;
  }

  static async update(id: string, ngoData: Partial<NGO>): Promise<void> {
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    Object.entries(ngoData).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        updates.push(`${key} = ?`);
        values.push(value as string | number | boolean | null);
      }
    });

    if (updates.length === 0) return;

    values.push(id);

    const query = `
      UPDATE ngos
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await run(query, values);
  }

  static async deactivate(id: string): Promise<void> {
    const query = `
      UPDATE ngos 
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await run(query, [id]);
  }

  // New ORM-like methods
  static async findUnique(where: { id: string }): Promise<NGO | null> {
    return await this.findById(where.id);
  }

  static async findMany(): Promise<NGO[]> {
    return await this.findAll();
  }

  static async createWithPrisma(data: Omit<NGO, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<NGO> {
    // In a real implementation with Prisma, this would be:
    // return await prisma.ngo.create({ data });

    // For now, we'll simulate the behavior
    const ngo: NGO = {
      id: `ngo-${Date.now()}`,
      name: data.name,
      is_active: true,
      created_at: new Date().toISOString()
    };

    // Add optional fields only if they exist
    if (data.contact_person) ngo.contact_person = data.contact_person;
    if (data.phone) ngo.phone = data.phone;
    if (data.email) ngo.email = data.email;
    if (data.address) ngo.address = data.address;
    if (data.license_number) ngo.license_number = data.license_number;

    return ngo;
  }

  static async updateWithPrisma(
    where: { id: string },
    data: Partial<Omit<NGO, 'id' | 'created_at' | 'updated_at' | 'is_active'>>
  ): Promise<NGO | null> {
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      values.push(value as string | number | boolean | null);
    });

    if (updates.length === 0) {
      return await this.findById(where.id);
    }

    values.push(where.id);

    const query = `
      UPDATE ngos
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await run(query, values);
    return await this.findById(where.id);
  }

  static async delete(where: { id: string }): Promise<void> {
    const query = 'DELETE FROM ngos WHERE id = ?';
    await run(query, [where.id]);
  }
}

export default NGOModel;
