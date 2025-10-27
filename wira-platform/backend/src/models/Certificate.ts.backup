import { get, all, run } from '../database';
import { Certificate } from '../types';

class CertificateModel {
  static async findByVerificationCode(verificationCode: string): Promise<Certificate | null> {
    const query = 'SELECT * FROM certificates WHERE verification_code = ?';
    return await get<Certificate>(query, [verificationCode]);
  }

  static async findByUserAndCourse(anonymousCode: string, courseId: string): Promise<Certificate | null> {
    const query = 'SELECT * FROM certificates WHERE anonymous_code = ? AND course_id = ?';
    return await get<Certificate>(query, [anonymousCode, courseId]);
  }

  static async create(certificateData: Partial<Certificate>): Promise<string> {
    const query = `
      INSERT INTO certificates (
        id, anonymous_code, course_id, course_title, verification_code, 
        qr_code, instructor, institution, score, max_score, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const id = `cert-${Date.now()}`;
    const verificationCode = `WIRA-CERT-${certificateData.anonymous_code}-${certificateData.course_id}-${new Date().getFullYear()}`;
    const qrCode = `WIRA-QR-${verificationCode}`;

    await run(query, [
      id,
      certificateData.anonymous_code,
      certificateData.course_id,
      certificateData.course_title,
      verificationCode,
      qrCode,
      certificateData.instructor,
      certificateData.institution,
      certificateData.score,
      certificateData.max_score || 100
    ]);

    return verificationCode;
  }

  static async verify(verificationCode: string): Promise<{ valid: boolean; certificate?: Certificate }> {
    const certificate = await this.findByVerificationCode(verificationCode);

    if (!certificate) {
      return { valid: false };
    }

    // Update verification info
    const query = `
      UPDATE certificates 
      SET verified = 1, verification_date = CURRENT_TIMESTAMP, verification_ip = ?
      WHERE verification_code = ?
    `;
    await run(query, ['127.0.0.1', verificationCode]); // In real implementation, use actual IP

    return { valid: true, certificate };
  }

  static async revoke(verificationCode: string, reason: string): Promise<void> {
    const query = `
      UPDATE certificates 
      SET revoked = 1, revocation_reason = ?
      WHERE verification_code = ?
    `;
    await run(query, [reason, verificationCode]);
  }

  // New ORM-like methods
  static async findUnique(where: { verification_code: string } | { id: string }): Promise<Certificate | null> {
    if ('verification_code' in where) {
      return await this.findByVerificationCode(where.verification_code);
    } else {
      const query = 'SELECT * FROM certificates WHERE id = ?';
      return await get<Certificate>(query, [where.id]);
    }
  }

  static async findMany(): Promise<Certificate[]> {
    const query = 'SELECT * FROM certificates ORDER BY created_at DESC';
    return await all<Certificate>(query);
  }

  static async createWithPrisma(data: Omit<Certificate, 'id' | 'created_at' | 'issue_date' | 'verification_code' | 'qr_code'>): Promise<Certificate> {
    // In a real implementation with Prisma, this would be:
    // return await prisma.certificate.create({ data });
    
    // For now, we'll simulate the behavior
    const certificate: Certificate = {
      id: `cert-${Date.now()}`,
      anonymous_code: data.anonymous_code,
      course_id: data.course_id,
      course_title: data.course_title,
      issue_date: new Date().toISOString(),
      verification_code: `WIRA-CERT-${data.anonymous_code}-${data.course_id}-${new Date().getFullYear()}`,
      qr_code: `WIRA-QR-WIRA-CERT-${data.anonymous_code}-${data.course_id}-${new Date().getFullYear()}`,
      instructor: data.instructor,
      institution: data.institution,
      score: data.score,
      max_score: data.max_score || 100,
      verified: false,
      revoked: false,
      created_at: new Date().toISOString()
    };
    
    return certificate;
  }

  static async update(
    where: { verification_code: string }, 
    data: Partial<Omit<Certificate, 'id' | 'verification_code' | 'qr_code' | 'created_at' | 'issue_date'>>
  ): Promise<Certificate | null> {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      values.push(value);
    });
    
    if (updates.length === 0) {
      return await this.findByVerificationCode(where.verification_code);
    }
    
    values.push(where.verification_code);
    
    const query = `
      UPDATE certificates 
      SET ${updates.join(', ')}, verification_date = CURRENT_TIMESTAMP
      WHERE verification_code = ?
    `;
    
    await run(query, values);
    return await this.findByVerificationCode(where.verification_code);
  }

  static async delete(where: { verification_code: string }): Promise<void> {
    const query = 'DELETE FROM certificates WHERE verification_code = ?';
    await run(query, [where.verification_code]);
  }
}

export default CertificateModel;