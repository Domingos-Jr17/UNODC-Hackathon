import prismaService from '../services/prisma';
import { Certificate as CertificateInterface } from '../types';

const prisma = prismaService.getClient();

class CertificateModel {
  static async findByVerificationCode(verificationCode: string): Promise<CertificateInterface | null> {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { verification_code: verificationCode }
      });
      
      return certificate as CertificateInterface | null;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserAndCourse(anonymousCode: string, courseId: string): Promise<CertificateInterface | null> {
    try {
      const certificate = await prisma.certificate.findFirst({
        where: { 
          anonymous_code: anonymousCode,
          course_id: courseId
        }
      });
      
      return certificate as CertificateInterface | null;
    } catch (error) {
      throw error;
    }
  }

  static async create(certificateData: Partial<CertificateInterface>): Promise<string> {
    try {
      const certificate = await prisma.certificate.create({
        data: {
          id: certificateData.id ?? `cert-${Date.now()}`,
          anonymous_code: certificateData.anonymous_code!,
          course_id: certificateData.course_id!,
          course_title: certificateData.course_title!,
          verification_code: certificateData.verification_code!,
          qr_code: certificateData.qr_code!,
          instructor: certificateData.instructor,
          institution: certificateData.institution,
          score: certificateData.score!,
          max_score: certificateData.max_score ?? 100,
          verified: certificateData.verified ?? false,
          created_at: certificateData.created_at ? new Date(certificateData.created_at) : new Date(),
          issue_date: certificateData.issue_date ? new Date(certificateData.issue_date) : new Date()
        }
      });

      return certificate.verification_code;
    } catch (error) {
      throw error;
    }
  }

  static async verify(verificationCode: string): Promise<{ valid: boolean; certificate?: CertificateInterface }> {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { verification_code: verificationCode }
      });

      if (!certificate) {
        return { valid: false };
      }

      // Update verification info
      await prisma.certificate.update({
        where: { verification_code: verificationCode },
        data: {
          verified: true,
          verification_date: new Date(),
          verification_ip: '127.0.0.1' // Would use actual IP in production
        }
      });

      return { valid: true, certificate: certificate as CertificateInterface };
    } catch (error) {
      throw error;
    }
  }

  static async revoke(verificationCode: string, reason: string): Promise<void> {
    try {
      await prisma.certificate.update({
        where: { verification_code: verificationCode },
        data: {
          revoked: true,
          revocation_reason: reason
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // New ORM-like methods
  static async findUnique(where: { verification_code: string } | { id: string }): Promise<CertificateInterface | null> {
    try {
      const certificate = await prisma.certificate.findUnique({
        where
      });
      
      return certificate as CertificateInterface | null;
    } catch (error) {
      throw error;
    }
  }

  static async findMany(): Promise<CertificateInterface[]> {
    try {
      const certificates = await prisma.certificate.findMany({
        where: { revoked: false },
        orderBy: { created_at: 'desc' }
      });
      
      return certificates as CertificateInterface[];
    } catch (error) {
      throw error;
    }
  }

  static async update(
    where: { verification_code: string }, 
    data: Partial<CertificateInterface>
  ): Promise<CertificateInterface | null> {
    try {
      // Remove fields that shouldn't be updated directly
      const updateData: any = { ...data };
      delete updateData.id;
      delete updateData.verification_code;
      delete updateData.created_at;
      
      // Add updated timestamp
      updateData.verification_date = new Date();

      const certificate = await prisma.certificate.update({
        where,
        data: updateData
      });

      return certificate as CertificateInterface;
    } catch (error) {
      throw error;
    }
  }

  static async delete(where: { verification_code: string }): Promise<void> {
    try {
      await prisma.certificate.delete({
        where
      });
    } catch (error) {
      throw error;
    }
  }
}

export default CertificateModel;