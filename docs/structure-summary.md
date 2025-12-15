# WIRA Platform - Project Structure Summary

Date: December 14, 2024

## Overview
This document summarizes the current project structure of the WIRA Platform after complete reorganization to follow best practices of software engineering and humanitarian technology development.

## Directory Structure

```
mvp/                                    # Project root
├── backend/                            # Backend API server (Node.js/Express)
│   ├── src/                            # Source code
│   │   ├── controllers/                # Request controllers
│   │   ├── models/                     # Data models
│   │   ├── routes/                     # Route definitions
│   │   ├── services/                   # Business logic
│   │   ├── middleware/                 # Security and auth middleware
│   │   ├── utils/                      # Utilities
│   │   ├── types/                      # TypeScript types
│   │   └── database/                   # Database configuration
│   ├── tests/                          # Automated tests
│   ├── prisma/                         # Database schema and migrations
│   ├── scripts/                        # Build and deploy scripts
│   ├── data/                           # Initial data and seeds
│   ├── logs/                           # Log files
│   ├── .env.example                   # Environment variables example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                           # NGO Dashboard (React/Vite)
│   ├── src/                            # Source code
│   │   ├── components/                 # Reusable components
│   │   ├── pages/                      # Application pages
│   │   ├── layouts/                    # Common layouts
│   │   ├── hooks/                      # Custom hooks
│   │   ├── contexts/                   # React contexts
│   │   ├── styles/                     # Styling and themes
│   │   └── utils/                      # Utilities
│   ├── public/                         # Public assets
│   ├── tests/                          # Frontend tests
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── mobile-app/                         # Mobile Application (React Native/Expo)
│   ├── src/                            # Source code
│   │   ├── components/                 # Reusable components
│   │   ├── screens/                    # App screens
│   │   ├── navigation/                 # Screen navigation
│   │   ├── hooks/                      # Custom hooks
│   │   ├── utils/                      # Utilities
│   │   └── types/                      # TypeScript types
│   ├── assets/                         # Visual assets
│   ├── tests/                          # Mobile tests
│   ├── .env.example
│   ├── package.json
│   ├── app.json
│   └── tsconfig.json
│
├── business/                           # Business documents
│   ├── reports/                        # Executive and technical reports
│   │   ├── executive.md                # Executive reports
│   │   ├── technical.md                # Technical reports
│   │   └── progress.md                 # Progress reports
│   ├── roadmap.md                      # Strategic planning
│   └── backlog.md                      # Project backlog
│
├── docs/                               # Technical documentation
│   ├── technical/                      # Technical docs
│   │   ├── architecture.md             # System architecture
│   │   ├── api.md                      # API documentation
│   │   └── setup.md                    # Setup guide
│   └── user-guides/                    # User guides
│       ├── ngo-staff.md                # NGO staff guide
│       └── victims.md                  # Victim guide
│
├── legal/                              # Legal documents
│   └── privacy-policy.md               # Privacy policy
│
├── scripts/                            # Development scripts
│   ├── setup-dev-env.sh               # Dev environment setup
│   ├── run-tests.sh                   # Execute tests
│   └── build-all.sh                   # Build all components
│
├── shared/                             # Shared resources
│   ├── types/                          # Shared TypeScript types
│   └── utils/                          # Shared utilities
│
├── tests/                              # Integration and e2e tests
├── .gitignore                         # Git ignore patterns
├── README.md                          # Main documentation
├── CHANGELOG.md                       # Change history
├── LICENSE                            # Project license
├── CODE_OF_CONDUCT.md                 # Code of conduct
└── CONTRIBUTING.md                    # Contribution guide
```

## Key Features of the Structure

1. **Clean Organization**: Each component has its own well-defined directory
2. **Separation of Concerns**: Clear separation between code, tests, and documentation
3. **Scalability Ready**: Structure prepared for Docker, CI/CD, and cloud deployment
4. **Documentation Rich**: Comprehensive documentation for technical and business aspects
5. **Security First**: Privacy and security considerations throughout the design
6. **Humanitarian Focused**: Structure designed with the needs of trafficking survivors in mind

## Language Consistency

All documentation and code comments are in English to ensure:
- International collaboration capability
- Clear communication among diverse team members
- Compliance with open-source standards
- Accessibility for global humanitarian organizations

## Purpose of Each Directory

- `backend/`: Contains all server-side code, API endpoints, and database operations
- `frontend/`: Contains the web interface for NGO staff to manage beneficiaries
- `mobile-app/`: Contains the mobile application for survivors to access courses
- `business/`: Contains all business-related documents and reports
- `docs/`: Contains technical and user documentation
- `legal/`: Contains legal documents including privacy policy
- `scripts/`: Contains automation scripts for development workflow
- `shared/`: Contains common utilities and types shared among components
- `tests/`: Contains integration and end-to-end tests

## Special Considerations for WIRA

### 1. Privacy and Security
- Anonymous access codes (V####) protect survivor identity
- PII (Personally Identifiable Information) is separated from study progress
- All sensitive data is encrypted in storage and transmission

### 2. Accessibility
- USSD system for basic phones
- Simple, intuitive interfaces
- Multi-language support planned (Portuguese, local languages)

### 3. Digital Inclusion
- Offline capabilities for mobile app
- Low-bandwidth optimizations
- Integration with local mobile money systems

This structure supports the WIRA platform's mission of providing professional training and economic reintegration for human trafficking survivors in Mozambique, while maintaining the highest standards of privacy, security, and accessibility.

---
WIRA Platform - Transforming lives through professional education and economic empowerment.