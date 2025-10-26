# 🤖 WIRA PLATFORM EXECUTION AGENT
## Guidelines for Implementing WIRA Platform Generation Prompt

### 🎯 AGENT MISSION

Execute comprehensive WIRA platform generation prompt following all technical specifications, security protocols, and Mozambican cultural adaptations outlined in WIRA_GENERATION_PROMPT.md. This agent ensures faithful implementation of hybrid platform for human trafficking survivor reintegration.

---

## 📋 EXECUTION PROTOCOL

### PHASE 1: PROJECT STRUCTURE SETUP
```bash
# Execute in exact order:
1. Create main project directory
2. Initialize React Native app with Expo
3. Setup Node.js backend with TypeScript
4. Create Next.js dashboard
5. Configure Supabase database
6. Install all required dependencies
```

### PHASE 2: CORE FUNCTIONALITY IMPLEMENTATION
```typescript
// Priority order:
1. Authentication system (anonymous codes V0042)
2. Course library with 3 mandatory courses
3. Video lesson system with offline support
4. Quiz engine with immediate feedback
5. Certificate generation with QR codes
6. ONG dashboard for activation and monitoring
7. USSD prototype (Figma simulation)
8. Job matching mockup (Phase 2 preview)
```

### PHASE 3: SECURITY & ETHICS IMPLEMENTATION
```typescript
// Non-negotiable security layers:
1. AES-256 encryption for sensitive data
2. JWT authentication with refresh tokens
3. Row Level Security (RLS) in database
4. Rate limiting on all API endpoints
5. Input validation and sanitization
6. Audit logging for all user actions
```

---

## 🔧 TECHNICAL EXECUTION STANDARDS

### CODE QUALITY REQUIREMENTS
```typescript
// All code must meet:
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Unit tests covering >80% of code
- Error boundaries implemented
- Loading states for all async operations
- Responsive design for all screen sizes
```

### PERFORMANCE STANDARDS
```typescript
// Mandatory performance metrics:
- App initialization: <3 seconds
- API response time: <500ms
- Video loading: <5 seconds on 3G
- Bundle size: <20MB total
- Memory usage: <100MB on mid-range devices
```

### ACCESSIBILITY STANDARDS
```typescript
// WCAG 2.1 AA compliance required:
- Screen reader support (VoiceOver/TalkBack)
- High contrast mode support
- Minimum touch targets: 44x44px
- Keyboard navigation support
- Text scaling up to 200%
- Focus indicators visible
```

---

## 📱 MOBILE APP IMPLEMENTATION GUIDE

### SCREEN IMPLEMENTATION ORDER
```typescript
// Implement screens in this sequence:
1. WelcomeScreen.tsx - Onboarding and app introduction
2. LoginScreen.tsx - Anonymous code authentication
3. HomeScreen.tsx - Personal dashboard with progress
4. CourseLibraryScreen.tsx - Available courses listing
5. CourseDetailScreen.tsx - Course information and modules
6. VideoLessonScreen.tsx - Video player with offline support
7. QuizScreen.tsx - Interactive quiz with feedback
8. CertificateScreen.tsx - Digital certificate with QR
9. ProgressScreen.tsx - Detailed progress tracking
10. JobsMockupScreen.tsx - Phase 2 preview
```

### OFFLINE-FIRST IMPLEMENTATION
```typescript
// Critical offline functionality:
interface OfflineService {
  downloadCourse(courseId: string): Promise<void>;
  cacheProgress(progress: Progress): Promise<void>;
  syncWhenOnline(): Promise<void>;
  isOffline(): boolean;
}

// Must cache:
- All course videos and materials
- Quiz questions and answers
- User progress data
- Certificate information
```

### NAVIGATION STRUCTURE
```typescript
// Required navigation stack:
const Stack = createNativeStackNavigator();

// Exact screen order and naming:
- Welcome (no header)
- Login
- Home
- CourseLibrary
- CourseDetail
- VideoLesson
- Quiz
- Certificate
- Progress
- JobsMockup (marked as "Phase 2")
```

---

## 🖥️ BACKEND IMPLEMENTATION GUIDE

### API ENDPOINTS MANDATORY
```typescript
// Authentication endpoints:
POST /api/auth/login - Anonymous code validation
POST /api/auth/refresh - Token refresh
DELETE /api/auth/logout - Session termination

// Course endpoints:
GET /api/courses - List all available courses
GET /api/courses/:id - Get course details
GET /api/courses/:id/modules - Get course modules
GET /api/courses/:id/quiz - Get course quiz

// Progress endpoints:
GET /api/users/:code/progress - Get user progress
POST /api/progress/update - Update module completion
GET /api/users/:code/certificates - Get earned certificates

// Certificate endpoints:
POST /api/certificates/generate - Generate new certificate
GET /api/certificates/:id/verify - Verify certificate authenticity
```

### DATABASE SCHEMA ENFORCEMENT
```sql
-- Exact table structure required:
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_code VARCHAR(10) UNIQUE NOT NULL,
  real_name TEXT, -- AES-256 encrypted
  phone TEXT, -- AES-256 encrypted
  ngo_id UUID REFERENCES ngos(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  duration_hours INTEGER NOT NULL,
  modules_count INTEGER NOT NULL,
  level TEXT NOT NULL,
  skills TEXT[],
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  completed_modules INTEGER[] DEFAULT '{}',
  percentage INTEGER DEFAULT 0,
  last_activity TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
```

### SECURITY IMPLEMENTATION
```typescript
// Encryption service mandatory:
class EncryptionService {
  private readonly key = process.env.ENCRYPTION_KEY; // 32 bytes
  
  encrypt(text: string): string {
    // AES-256-GCM implementation
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    // ... full implementation
  }
  
  decrypt(encryptedText: string): string {
    // AES-256-GCM decryption
    // ... full implementation
  }
}

// JWT middleware mandatory:
interface JWTPayload {
  anonymousCode: string;
  ngoId: string;
  iat: number;
  exp: number;
}
```

---

## 🌐 DASHBOARD IMPLEMENTATION GUIDE

### ONG DASHBOARD PAGES
```typescript
// Required page structure:
src/app/
├── page.tsx - Main dashboard with statistics
├── activate/page.tsx - Activate new user codes
├── monitor/page.tsx - Monitor user progress
├── users/page.tsx - User management
└── settings/page.tsx - ONG settings

// Each page must include:
- Real-time data updates
- Responsive design
- Loading states
- Error handling
- Export functionality
```

### DASHBOARD FEATURES MANDATORY
```typescript
// Activation page must include:
- Generate anonymous codes (V0042 format)
- Send SMS with app download link
- Assign initial skills assessment
- Set ONG affiliation

// Monitor page must include:
- Real-time progress tracking
- Course completion rates
- Quiz scores and attempts
- Certificate generation status
- Export reports (CSV/PDF)
```

---

## 📚 COURSE CONTENT IMPLEMENTATION

### MANDATORY COURSE STRUCTURE
```typescript
// Each course must include:
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  modules: CourseModule[];
  quiz: QuizQuestion[];
  certificateTemplate: CertificateTemplate;
}

interface CourseModule {
  id: number;
  title: string;
  videoUrl: string;
  duration: string;
  downloadable: boolean;
  transcript: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
```

### COURSE 1: COSTURA AVANÇADA
```typescript
// Exact module structure:
const costuraCourse: Course = {
  id: 'costura',
  title: 'Costura Avançada - Uniformes Escolares',
  modules: [
    { id: 1, title: 'Preparação de Máquina Industrial', duration: '45 min' },
    { id: 2, title: 'Técnicas de Costura Reta', duration: '60 min' },
    { id: 3, title: 'Costura de Bolsos', duration: '50 min' },
    { id: 4, title: 'Montagem de Camisas', duration: '75 min' },
    { id: 5, title: 'Acabamentos Profissionais', duration: '40 min' },
    { id: 6, title: 'Controle de Qualidade', duration: '30 min' },
    { id: 7, title: 'Produtividade e Prazos', duration: '35 min' },
    { id: 8, title: 'Avaliação Final', duration: '60 min' }
  ],
  quiz: [
    {
      question: 'Qual é o primeiro passo ao costurar um bolso?',
      options: [
        'Cortar o tecido',
        'Preparar o acabamento das bordas',
        'Costurar diretamente na peça',
        'Medir e marcar a posição'
      ],
      correctAnswer: 3
    }
    // ... 4 more questions per module
  ]
};
```

---

## 🔒 ETHICAL SECURITY PROTOCOLS

### ANONYMITY ENFORCEMENT
```typescript
// Never expose these fields in API responses:
interface SensitiveData {
  realName: never; // Always encrypted
  exactAddress: never; // Use district only
  phoneNumber: never; // Use anonymous code
  traffickingHistory: never; // Never stored
  familyContacts: never; // Never stored
}

// Always expose these fields:
interface PublicData {
  anonymousCode: string; // V0042 format
  skills: string[]; // Certified skills only
  experienceLevel: string; // Beginner/Intermediate/Advanced
  district: string; // General district, not address
  certificates: Certificate[]; // Earned certificates only
}
```

### CONSENT MECHANISM
```typescript
// Mandatory consent flow:
interface ConsentFlow {
  step1: 'Inform user about data usage';
  step2: 'Explain anonymization process';
  step3: 'Get explicit consent for job matching';
  step4: 'Provide opt-out mechanism';
  step5: 'Allow consent withdrawal anytime';
}

// Consent must be:
- Explicit (not pre-checked)
- Informed (clear explanation)
- Voluntary (can refuse)
- Specific (per feature)
- Documented (audit trail)
```

---

## 🌍 MOZAMBICAN ADAPTATION CHECKLIST

### LANGUAGE & CULTURE
```typescript
// Language requirements:
- All text in Portuguese (Portugal variant)
- Mozambican cultural references
- Local currency (Meticais - MT)
- Local phone format (+258 XX XXX XXXX)
- Local date format (DD/MM/YYYY)

// Cultural adaptations:
- Respectful trauma-informed language
- No direct questions about trafficking past
- Focus on skills and future opportunities
- Inclusive of all religious backgrounds
- Gender-sensitive design
```

### TECHNICAL ADAPTATIONS
```typescript
// Infrastructure requirements:
- Africa's Talking SMS integration
- Servers in South Africa (low latency)
- 3G optimization (videos <50MB)
- USSD support for basic phones
- Offline-first architecture
- Low bandwidth consumption

// Local partnerships:
- Ministry of Labour certification
- Local ONG validation
- Mozambican instructor videos
- Local business partnerships
- Government subsidy integration
```

---

## 📊 TESTING & QUALITY ASSURANCE

### MANDATORY TEST SUITES
```typescript
// Unit tests (>80% coverage):
describe('Authentication', () => {
  test('should validate anonymous codes');
  test('should generate JWT tokens');
  test('should handle invalid codes');
});

describe('Course Progress', () => {
  test('should track module completion');
  test('should calculate percentage correctly');
  test('should sync when online');
});

describe('Quiz System', () => {
  test('should validate correct answers');
  test('should provide feedback');
  test('should require 70% to pass');
});

// Integration tests:
describe('End-to-End Flow', () => {
  test('should complete full course journey');
  test('should generate certificate');
  test('should work offline');
});

// Security tests:
describe('Security', () => {
  test('should encrypt sensitive data');
  test('should prevent SQL injection');
  test('should rate limit requests');
});
```

### PERFORMANCE TESTING
```typescript
// Load testing requirements:
- 100 concurrent users
- 500ms average response time
- 99% uptime requirement
- Memory usage <512MB
- Database queries <100ms

// Device testing:
- Low-end Android (2GB RAM)
- iPhone 8 or equivalent
- Tablet landscape/portrait
- Basic phone (USSD simulation)
```

---

## 🚀 DEPLOYMENT PROTOCOLS

### PRODUCTION DEPLOYMENT CHECKLIST
```bash
# Pre-deployment requirements:
□ All tests passing (>80% coverage)
□ Security audit completed
□ Performance benchmarks met
□ SSL certificates configured
□ Database backups enabled
□ Monitoring tools installed
□ Error tracking configured
□ CDN for static assets
□ Rate limiting enabled
□ Data encryption verified
```

### ENVIRONMENT CONFIGURATION
```typescript
// Production environment variables:
interface ProductionConfig {
  NODE_ENV: 'production';
  DATABASE_URL: string; // Supabase connection
  JWT_SECRET: string; // 32+ characters
  ENCRYPTION_KEY: string; // 32 bytes
  SMS_API_KEY: string; // Africa's Talking
  CORS_ORIGINS: string[]; // Approved domains
  RATE_LIMIT_WINDOW: number; // 15 minutes
  RATE_LIMIT_MAX: number; // 100 requests
  LOG_LEVEL: 'info' | 'warn' | 'error';
}
```

---

## 📈 MONITORING & MAINTENANCE

### CRITICAL MONITORING METRICS
```typescript
// Application monitoring:
interface MonitoringMetrics {
  // Performance:
  responseTime: number; // <500ms average
  errorRate: number; // <1% of requests
  uptime: number; // >99.9%
  memoryUsage: number; // <80% of allocated
  
  // Business metrics:
  activeUsers: number; // Daily active users
  courseCompletions: number; // Per day
  certificatesGenerated: number; // Per day
  quizPassRate: number; // >70% average
  
  // Security metrics:
  failedLogins: number; // Monitor for attacks
  dataAccessAttempts: number; // Audit all access
  encryptionOperations: number; // Verify encryption
}
```

### MAINTENANCE PROTOCOLS
```typescript
// Daily maintenance tasks:
- Database backup verification
- SSL certificate expiry check
- Security patch updates
- Performance metric review
- Error log analysis

// Weekly maintenance tasks:
- Security audit review
- Performance optimization
- User feedback analysis
- Feature usage analytics
- Capacity planning review

// Monthly maintenance tasks:
- Full security penetration test
- Disaster recovery drill
- Performance load testing
- User satisfaction survey
- Feature roadmap review
```

---

## 🎯 SUCCESS CRITERIA VALIDATION

### FUNCTIONAL SUCCESS METRICS
```typescript
// Must achieve within 30 days:
interface SuccessMetrics {
  userRegistration: {
    target: 10; // pilot users
    current: number;
  };
  
  courseCompletion: {
    target: 60; // percentage
    current: number;
  };
  
  certificateGeneration: {
    target: 6; // certificates
    current: number;
  };
  
  userSatisfaction: {
    target: 8; // NPS score
    current: number;
  };
  
  systemUptime: {
    target: 99.9; // percentage
    current: number;
  };
}
```

### TECHNICAL SUCCESS METRICS
```typescript
// Must maintain continuously:
interface TechnicalMetrics {
  performance: {
    apiResponseTime: number; // <500ms
    appLoadTime: number; // <3 seconds
    videoLoadTime: number; // <5 seconds
  };
  
  security: {
    zeroDataBreaches: boolean;
    allDataEncrypted: boolean;
    auditTrailComplete: boolean;
  };
  
  accessibility: {
    screenReaderSupport: boolean;
    keyboardNavigation: boolean;
    contrastCompliance: boolean;
  };
}
```

---

## 🚨 EMERGENCY PROTOCOLS

### CRITICAL INCIDENT RESPONSE
```typescript
// Security incident response:
interface SecurityIncident {
  detection: {
    automatedMonitoring: boolean;
    userReporting: boolean;
    thirdPartyNotification: boolean;
  };
  
  response: {
    immediateContainment: number; // <1 hour
    investigationStart: number; // <2 hours
    userNotification: number; // <4 hours
    resolution: number; // <24 hours
  };
  
  communication: {
    internalTeam: boolean;
    managementNotification: boolean;
    userCommunication: boolean;
    regulatoryReporting: boolean;
  };
}
```

### SYSTEM FAILURE RECOVERY
```typescript
// Disaster recovery procedures:
interface DisasterRecovery {
  backup: {
    frequency: 'daily';
    retention: 90; // days
    location: 'multiple_regions';
    encryption: true;
  };
  
  recovery: {
    rto: 4; // Recovery Time Objective (hours)
    rpo: 1; // Recovery Point Objective (hours)
    testing: 'monthly';
  };
  
  communication: {
    stakeholders: string[];
    templates: boolean;
    escalation: boolean;
  };
}
```

---

## 📋 FINAL VALIDATION CHECKLIST

### PRE-RELEASE VALIDATION
```bash
# Technical validation:
□ All unit tests passing (>80% coverage)
□ Integration tests passing
□ Security audit completed
□ Performance benchmarks met
□ Accessibility compliance verified
□ Cross-device testing completed
□ Offline functionality verified
□ Data encryption confirmed
□ API documentation complete
□ User acceptance testing passed

# Business validation:
□ Mozambican cultural adaptation verified
□ ONG partner feedback incorporated
□ Survivor trauma-informed design confirmed
□ Legal compliance verified
□ Ethical guidelines followed
□ Privacy policy implemented
□ Consent mechanisms verified
□ Anonymity protocols enforced
□ Impact metrics defined

# Deployment validation:
□ Production environment configured
□ Monitoring tools installed
□ Backup systems verified
□ Security certificates valid
□ Domain names configured
□ CDN optimization enabled
□ SSL/TLS encryption active
□ Rate limiting configured
□ Error tracking implemented
□ Performance monitoring active
```

---

## 🎉 EXECUTION SUCCESS MESSAGE

Upon successful implementation of this agent protocol, WIRA platform will be fully functional with:

✅ **Complete mobile app** with offline-first architecture
✅ **Secure backend** with AES-256 encryption
✅ **Interactive dashboard** for ONG partners
✅ **3 certified courses** with video content
✅ **Quiz system** with immediate feedback
✅ **Digital certificates** with QR code verification
✅ **USSD prototype** for basic phone access
✅ **Job matching mockup** for Phase 2 preview
✅ **Mozambican cultural adaptation** throughout
✅ **Trauma-informed design** principles
✅ **Ethical security protocols** enforced
✅ **Performance optimization** for 3G networks
✅ **Accessibility compliance** (WCAG 2.1 AA)
✅ **Comprehensive testing** (>80% coverage)
✅ **Production deployment** ready

**WIRA will be ready to transform lives through technology-guided dignity and economic empowerment.**

*"Não resgatamos vítimas. Construímos profissionais."*
