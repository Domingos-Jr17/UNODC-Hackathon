# WIRA Platform - UNODC Human Trafficking Hackathon

## 🎯 Project Overview

The **WIRA Platform** (Women's Integrated Reintegration Academy) is a comprehensive digital platform for professional training and economic reintegration of human trafficking survivors in Mozambique. Developed for the UNODC Hackathon, this solution provides education, certification, and employment opportunities in a secure and anonymous manner.

## 🏗️ Architecture

The platform consists of three main components:

### 📱 Mobile App (React Native/Expo)

- **Anonymous Access**: Unique codes per survivor (e.g., V0042)
- **Professional Courses**: Sewing, Cooking, Agriculture
- **Individual Progress**: Detailed tracking per module
- **Certificates**: Ministry of Labor recognition
- **Offline Mode**: Complete functionality without internet

### 🖥️ NGO Dashboard (React/Vite)

- **Survivor Management**: Complete CRUD with anonymization
- **Course System**: Creation and management of modules
- **Reports**: PDF and Excel export
- **Monitoring**: Real-time statistics
- **Certificates**: Automated certificate generation

### 🔧 Backend API (Node.js/Express)

- **RESTful API**: Complete endpoints for all operations
- **Authentication**: JWT with access codes
- **Database**: PostgreSQL with relationships
- **Cache**: Redis for performance
- **Security**: Rate limiting, PII masking, audit trails

## 🚀 Main Features

### 🔐 Security and Privacy

- **Anonymous Codes**: Each survivor receives a unique code (V####)
- **PII Masking**: Sensitive data masked in logs
- **Rate Limiting**: 100 requests per minute
- **Encryption**: AES-256 for sensitive data
- **Auditing**: Complete activity tracking

### 📚 Educational System

- **Modular Courses**: 6-8 modules per course
- **Detailed Progress**: Tracking by lesson and quiz
- **Offline Materials**: Download for studying offline
- **Evaluations**: Quizzes with automatic certification
- **Certified Instructors**: Qualified teachers

### 🏆 Professional Certification

- **Official Recognition**: Ministry of Labor of Mozambique
- **QR Code**: Automatic authenticity verification
- **Validity**: 2 years with online renewal
- **Portfolio**: Evaluated practical work

### 💼 Employability

- **Opportunities Database**: Exclusive jobs for graduates
- **Smart Matching**: Alignment with professional profile
- **Preparation**: Interview and resume workshop
- **Networking**: Alumni community

## 🛠️ Technologies

### Mobile Frontend

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **AsyncStorage** for offline data
- **React Query** for state management

### Web Frontend

- **React 18** with **Vite**
- **TypeScript** strict mode
- **Tailwind CSS** for styling
- **Shadcn/ui** for components
- **Recharts** for data visualization

### Backend

- **Node.js** with **Express**
- **TypeScript** for type safety
- **Prisma** with **SQLite** (development) / **PostgreSQL** (production)
- **JWT** for authentication
- **Joi** for validation

### Infrastructure

- **Health Checks** for monitoring
- **Winston** for logging
- **Rate Limiting** for security
- **PII Masking** for privacy

## 📱 Installation and Usage

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Backend API

```bash
cd backend
npm install
npm run dev  # Development server with hot reload
```

### NGO Dashboard

```bash
cd frontend
npm install
npm run dev  # Vite development server
```

### Mobile Application

```bash
cd mobile-app
npm install
npm start    # Expo development server
```

## 🎮 Hackathon Demo

### Demo Access Codes

- **V0042**: Maria Silva (Sewing - 37.5% complete)
- **V0038**: Ana Santos (Cooking - New student)
- **V0031**: João Machel (Agriculture - In progress)

### Demo Features

1. **Anonymous Login**: Use codes V0042, V0038, V0031
2. **Real Progress**: Realistic simulated data
3. **Complete Courses**: 3 professional courses
4. **Certificates**: Automatic generation
5. **Dashboard**: Real-time statistics

## 📊 Data Structure

### Survivors (Victims)

```sql
- id (UUID)
- accessCode (V####)
- enrolledAt (timestamp)
- lastLoginAt (timestamp)
- isActive (boolean)
- ngoId (FK to Organizations)
```

### Courses

```sql
- id (UUID)
- title (string)
- description (text)
- duration (hours)
- modulesCount (integer)
- certificateTemplate (text)
```

### Progress

```sql
- userId (FK)
- courseId (FK)
- moduleId (FK)
- completedAt (timestamp)
- score (decimal)
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/wira
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# API
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

### Unit Tests

```bash
npm test
npm run test:watch
```

### Integration Tests

```bash
npm run test:integration
```

### Coverage

```bash
npm run test:coverage
```

## 📈 Monitoring

### Health Checks

- **API**: `GET /health`
- **Database**: Connection verification
- **Memory**: Usage monitoring

### Metrics

- **Response Time**: Average response time
- **Error Rate**: Error rate
- **Active Users**: Active users
- **Course Completion**: Completion rate

## 🔒 Security

### Implemented

- ✅ Rate limiting (100 req/min)
- ✅ Input validation (Joi)
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens
- ✅ PII masking
- ✅ Audit logging

### TODO

- 🔄 2FA for organizations
- 🔄 Encrypted storage
- 🔄 Biometric authentication
- 🔄 IP whitelisting

## 📞 Support

### Contact

- **Email**: support@wira-platform.org
- **Phone**: +258 84 123 4567
- **WhatsApp**: +258 84 123 4567

### Documentation

- **API Docs**: `https://docs.wira-platform.org`
- **User Guide**: `https://guide.wira-platform.org`
- **Admin Manual**: `https://admin.wira-platform.org`

## 🏆 Recognition

### Partners

- **UNODC**: United Nations Office on Drugs and Crime
- **Ministry of Labor**: Republic of Mozambique
- **Partner NGOs**: Survivor support network

### Certifications

- **ISO 27001**: Information security
- **GDPR Compliant**: Data protection
- **WCAG 2.1**: Web accessibility

## 📈 Roadmap

### V1.0 (Hackathon)

- ✅ Anonymous login with codes
- ✅ Basic course system
- ✅ NGO Dashboard
- ✅ Digital certificates

### V1.1 (3 months)

- 🔄 M-Pesa payment integration
- 🔄 Mentoring system
- 🔄 Online community
- 🔄 Native iOS app

### V2.0 (6 months)

- 🔄 AI for course recommendations
- 🔄 Service marketplace
- 🔄 Employer integration
- 🔄 Advanced analytics

## 👥 Team(Libertech Team)

### Core Team Members

**Domingos Alfredo Timane Júnior (Team Lead & FullStack Developer)**
Contact: domingosalfredotimane@gmail.com | Phone: +258 82 088 5159

**Esperança António Munlela (FullStack Developer & Designer)**.
Contact: esperancamunlela@gmail.com | Phone: +258 84 900 6228

**Isa Neide Firmino Sitoe (FullStack Developer & Project Manager)**
Contact: issitoe941@gmail.com | Phone: +258 82 181 9298

### General Team Contact:

- **Email**: libertechwira@gmail.com | **Phone**: +258 85 573 5760

---

**WIRA Platform** - Transforming lives through professional education and economic empowerment.

_Developed with ❤️ for UNODC Hackathon Mozambique_
