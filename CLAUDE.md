# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WIRA Platform (Women's Integrated Reintegration Academy) is a digital platform for professional training and economic reintegration of human trafficking survivors in Mozambique. This hybrid platform was developed for the UNODC Hackathon and consists of three main components:

1. **Mobile App** (React Native/Expo) - Anonymous access for survivors
2. **Backend API** (Node.js/Express) - Secure RESTful services with SQLite
3. **ONG Dashboard** (React/Vite) - Management interface for NGOs

## Development Commands

### Backend API (Node.js/Express)
```bash
cd wira-platform/backend
npm install                    # Install dependencies
npm run dev                   # Start development server with nodemon
npm start                     # Start production server
npm test                      # Run Jest tests
npm run init-db              # Initialize SQLite database with sample data
```
- Server runs on port 3000
- Health check: `GET http://localhost:3000/health`
- USSD test endpoint: `POST http://localhost:3000/api/ussd/test`

### Mobile App (React Native/Expo)
```bash
cd wira-platform/mobile-app
npm install                    # Install dependencies
npm start                      # Start Expo development server
npm run android               # Start Android development
npm run ios                   # Start iOS development
npm run web                   # Start web development
```

### ONG Dashboard (React/Vite)
```bash
cd wira-platform/frontend
npm install                    # Install dependencies
npm run dev                    # Start Vite development server
npm run build                  # Build for production
npm run lint                   # Run ESLint
npm run preview                # Preview production build
```

## Architecture Overview

### Database Structure (SQLite)
The platform uses SQLite with the following key tables:
- **users** - Anonymous user profiles with V#### codes (e.g., V0042)
- **courses** - Professional training courses (Costura, Culinária, Agricultura)
- **progress** - User progress tracking per course
- **certificates** - Generated certificates with QR codes
- **ngos** - Partner organizations

### API Endpoints Structure
- `/api/auth` - Anonymous code authentication
- `/api/courses` - Course management and content
- `/api/progress` - Progress tracking and updates
- `/api/certificates` - Certificate generation and verification
- `/api/ussd` - USSD service for basic phone access

### Mobile App Screens
The mobile app follows this navigation structure:
1. **WelcomeScreen** - Onboarding and introduction
2. **LoginScreen** - Anonymous code authentication (V#### format)
3. **HomeScreen** - Personal dashboard with progress overview
4. **CourseLibraryScreen** - Available courses listing
5. **CourseDetailScreen** - Course information and modules
6. **VideoLessonScreen** - Video player with offline support
7. **QuizScreen** - Interactive quiz with immediate feedback (70% pass requirement)
8. **CertificateScreen** - Digital certificates with QR code verification
9. **JobsMockupScreen** - Phase 2 preview (job matching)

## Key Features

### Security & Anonymity
- **Anonymous Codes**: Users identified by V#### codes only (e.g., V0042)
- **Data Encryption**: Sensitive data encrypted in database
- **No PII Storage**: Real names and contact info encrypted, never exposed
- **JWT Authentication**: Secure token-based authentication

### Course System
- **3 Professional Courses**: Costura (40h), Culinária (35h), Agricultura (30h)
- **Modular Structure**: 6-8 modules per course with video content
- **Offline Support**: Course materials downloadable for offline study
- **Progress Tracking**: Detailed module completion tracking

### Assessment & Certification
- **Quiz Engine**: Interactive quizzes with immediate feedback
- **70% Pass Requirement**: Standardized passing threshold
- **Digital Certificates**: QR code verification system
- **Official Recognition**: Mozambique Ministry of Labour certification

### USSD Service
- **Basic Phone Access**: *123# dialing simulation
- **Interactive Menus**: Course access, progress checking, certificate verification
- **Session Management**: 5-minute timeout with automatic cleanup
- **Test Endpoint**: `POST /api/ussd/test` for development testing

## Sample Data

The platform includes demo data for testing:
- **User Codes**: V0042 (Maria), V0038 (Ana), V0031 (João)
- **ONG Partners**: Centro de Acolhimento Maputo, Projeto Esperança
- **Course Progress**: Realistic progress data (37%, 0%, 15% complete)
- **Certificates**: Sample certificates with QR codes

## Testing USSD Functionality

Use cURL to test the USSD service:
```bash
# Test initial welcome message
curl -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text": ""}'

# Test login with demo code
curl -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text": "V0042"}'

# Test course navigation
curl -X POST http://localhost:3000/api/ussd/test \
  -H "Content-Type: application/json" \
  -d '{"text": "V0042*1"}'
```

## Development Notes

### Database Initialization
The SQLite database auto-initializes on first run with sample data. Database file: `wira-platform/backend/data/wira.db`

### CORS Configuration
Backend configured to accept requests from frontend origins during development.

### Error Handling
All API endpoints include comprehensive error handling with Portuguese error messages for user consistency.

### Health Monitoring
Comprehensive health check endpoint includes API status, database connectivity, and USSD service status.

## Deployment Context

This is a hackathon project focused on:
- **MVP Functionality**: Core features implemented and functional
- **Mozambican Context**: Portuguese language, local cultural adaptations
- **Trauma-Informed Design**: Ethical considerations for vulnerable users
- **Accessibility**: WCAG 2.1 AA compliance, offline-first architecture
- **Security**: Data encryption, anonymity protection, audit trails

## File Structure Key Points

- Backend uses JavaScript (not TypeScript) with Express.js
- Mobile app uses React Native with TypeScript and Expo
- Dashboard uses React with Vite and TypeScript
- Database queries use raw SQL with sqlite3
- All text content in Portuguese (Mozambique variant)
- Sample data included for immediate testing and demonstration