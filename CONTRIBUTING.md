# Contributing to the WIRA Platform Project

First of all, thank you for considering contributing to the WIRA Platform! Each contribution helps transform the lives of human trafficking survivors in Mozambique.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Report Bugs

1. Check if an issue hasn't already been opened about the same problem
2. Open a new issue with a clear title and detailed description
3. Include environment details and steps to reproduce the problem
4. Add appropriate labels

### Suggest Enhancements

1. Check if the idea has not already been suggested
2. Open an issue with "Feature Request" or "Enhancement"
3. Describe the problem you are trying to solve
4. Explain how your suggestion improves the platform

### Code

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/NewFeature`)
3. Make your changes
4. Add tests for new functionality
5. Update documentation if needed
6. Submit your pull request

## Development Guidelines

### Security and Privacy (Priority #1)

- Handle sensitive data with extreme caution
- Never expose personal data in interfaces
- Follow rigorous anonymization practices
- Implement encryption where appropriate
- Use PII masking in logs

### Code Style

#### Backend (TypeScript)
- Follow existing project style
- Use strict typing with TypeScript
- Write unit tests for critical functions
- Document APIs with JSDoc

#### Frontend (React/TypeScript)
- Reusable and well-documented components
- Use hooks appropriately
- Maintain design consistency
- Accessibility (WCAG AA) is mandatory

#### Mobile (React Native)
- Performance is critical
- Consider low-cost devices
- Offline functionality is essential
- Simple UX for low digital literacy

### Commit Conventions

Use conventional commits:

```
feat: add notification system
fix: fix data leak in login
docs: update API documentation
style: format backend code
refactor: restructure course controller
test: add tests for authentication
chore: update dependencies
```

### Branch Structure

- `main`: Production code
- `develop`: Development code
- `feature/`: New features
- `hotfix/`: Critical fixes
- `release/`: Release preparation

### Pull Requests

1. Clearly describe the problem solved
2. Link relevant issue if exists
3. Include screenshots if applicable
4. Ensure tests pass
5. Request review from other collaborators

## Development Environment

Follow the [Setup Guide](docs/technical/setup.md) to configure your local environment.

Run setup script:
```bash
cd wira-platform\scripts
setup-dev-env.bat
```

## Special Considerations for WIRA

### Trauma Sensitivity
- Consider the emotional impact of interfaces
- Avoid design that could cause stress
- Test with relevant stakeholders

### Accessibility
- Low digital literacy is common
- Many beneficiaries have low formal education
- Design should be extremely intuitive
- Consider local languages beyond Portuguese

### Mozambique Context
- Connectivity may be limited
- Many users have basic phones
- USSD is critical for digital inclusion
- Consider mobile data costs

## Resources for Contributing

- [Technical Documentation](docs/technical/)
- [Setup Guide](docs/technical/setup.md)
- [System Architecture](docs/technical/architecture.md)
- [API Documentation](docs/technical/api.md)

## Need Help?

- Open an issue with your question
- Contact the project team
- Consult the [documentation](docs/)

---

Remember: This project aims to support human trafficking survivors. Each contribution is part of a greater effort to promote dignity, safety, and economic reintegration.