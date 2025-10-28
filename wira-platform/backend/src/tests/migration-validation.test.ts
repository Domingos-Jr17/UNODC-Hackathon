// Simple test to validate the refactored code structure
import { User, Course, Progress, Certificate, NGO, AuditLog } from '../types';

// Test that our models can be imported correctly
console.log('Testing model imports...');

// Test that our controllers can be imported correctly
import AuthController from '../controllers/AuthController';
import CourseController from '../controllers/CourseController';
import ProgressController from '../controllers/ProgressController';
import CertificateController from '../controllers/CertificateController';
import NGOController from '../controllers/NGOController';
import AuditLogController from '../controllers/AuditLogController';

console.log('All controllers imported successfully');

// Test that our models can be imported correctly
import UserModel from '../models/User';
import CourseModel from '../models/Course';
import ProgressModel from '../models/Progress';
import CertificateModel from '../models/Certificate';
import NGOModel from '../models/NGO';
import AuditLogModel from '../models/AuditLog';

console.log('All models imported successfully');

// Test that our routes can be imported correctly
import authRoutes from '../routes/auth';
import coursesRoutes from '../routes/courses';
import progressRoutes from '../routes/progress';
import certificatesRoutes from '../routes/certificates';
import ngosRoutes from '../routes/ngos';
import auditLogsRoutes from '../routes/audit-logs';

console.log('All routes imported successfully');

console.log('✅ All imports successful - Migration validation complete');