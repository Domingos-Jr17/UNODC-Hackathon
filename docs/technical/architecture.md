# Architecture of WIRA Platform

## Overview

The WIRA Platform (Women's Integrated Reintegration Academy) is an open-source system developed to support professional training and economic reintegration of human trafficking survivors in Mozambique. The architecture was designed to prioritize the privacy, security, and accessibility of beneficiaries.

## System Components

### 1. Backend (API)
- **Technology**: Node.js with TypeScript and Express
- **ORM**: Prisma with SQLite database (development) / PostgreSQL (production)
- **Authentication**: JWT tokens with anonymous codes (V####)
- **Security**: Helmet.js, express-rate-limit, CORS, input sanitization
- **Functions**: User management, courses, progress, and certificates

### 2. Web Frontend (NGO Dashboard)
- **Technology**: React with TypeScript and Vite
- **Style**: Tailwind CSS with accessible components
- **Navigation**: React Router
- **Functions**: Beneficiary management, progress monitoring, reports

### 3. Mobile App
- **Technology**: React Native with Expo
- **Navigation**: React Navigation
- **Offline Storage**: AsyncStorage
- **Functions**: Course access, individual progress, quizzes, certificates

### 4. USSD System
- **Integration**: USSD request simulation via HTTP endpoint
- **Format**: Simple text menus for basic phones
- **Access Code**: *123# as standard code
- **Functions**: Course access, progress, and basic information

## Security Layers

### 1. Anonymization
- Access codes in V#### format (e.g., V0042)
- No personally identifiable information required for course access
- Separation of anonymous and identifiable data

### 2. Authentication and Authorization
- JWT tokens with expiration
- Rate limiting
- Rigorous input validation
- Role-based authentication for NGO access

### 3. Encryption
- Transit data: TLS 1.3
- Rest data: AES-256 (planned for production)
- Password hashing: bcrypt

## Data Structure

### 1. Main Entities
- **Users**: Store anonymous access codes; real data is isolated
- **NGOs**: Partner organizations that activate and monitor beneficiaries
- **Courses**: Professional training programs (sewing, cooking, agriculture)
- **Progress**: Individual tracking by module and course
- **Certificates**: Generation with QR verification

### 2. Sensitive Data Isolation
- Real identification information stored separately
- Access restricted by authorization
- Audit of all access operations

## Infrastructure

### 1. Hosting
- Backend: Node.js server with load balancing
- Frontend: Static hosting
- Mobile: App store distribution
- Database: Managed PostgreSQL

### 2. Scalability
- Microservices-based architecture (planned)
- Redis caching
- Asynchronous processing queues
- CDNs for static content

## External Integrations

### 1. Telecommunications
- Integration with mobile operators for USSD service
- SMS gateway for automated communications

### 2. Third Parties
- Hosting providers
- Payment providers (planned)
- Job platforms (planned)

## Mozambique Context Considerations

### 1. Accessibility
- USSD system for basic phones
- Interface in Portuguese (official language)
- Responsive design for different devices

### 2. Connectivity
- Offline functionality for mobile app
- Optimization for low-speed connections
- Compact content to reduce data usage

## Security and Compliance

### 1. Standards and Protocols
- GDPR compliance for data protection
- UN guidelines compliance for survivor assistance
- OWASP recommended security practices

### 2. Monitoring
- Detailed logs of all operations
- Alerts for suspicious activities
- Regular security reports

## Future Evolution

### 1. Upcoming Implementations
- Integration with government systems
- AI for course recommendation
- Mentorship system
- Service marketplace

### 2. Planned Improvements
- Biometric authentication
- Blockchain integration for certificates
- Automatic translation system for local languages
- Off-grid functionality

## Component Diagram

```
+-------------------+     +--------------------+     +------------------+
|   Mobile App      | <-- |  Backend API       | --> | Database         |
|   (React Native)  |     |  (Node.js)         |     |  (PostgreSQL)    |
+-------------------+     +--------------------+     +------------------+
         |                          |                           |
         |                          |                           |
         v                          v                           v
+-------------------+     +--------------------+     +------------------+
|     USSD          |     |    Web Dashboard   |     | Log System       |
|   (Integration)   |     |    (React)         |     |   (Security)     |
+-------------------+     +-------------------+     +------------------+
```

This architecture allows for a robust, secure, and accessible platform that meets the specific needs of trafficking survivors in Mozambique, with special focus on privacy and digital inclusion.