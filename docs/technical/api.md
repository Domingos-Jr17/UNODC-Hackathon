# Documentation of WIRA Platform API

## Overview

The WIRA platform API provides endpoints for managing beneficiaries, courses, progress, and certificates. The API uses JWT-based authentication and prioritizes the privacy and security of beneficiary data.

## API Conventions

- **Response Format**: JSON
- **Encoding**: UTF-8
- **Authentication**: JWT via `Authorization: Bearer <token>` header
- **Status Codes**: Following HTTP conventions
- **Fields**: Using camelCase
- **Beneficiary Codes**: V#### format (e.g., V0042)

## Authentication

### Login with Anonymous Code
```
POST /api/auth/login
Content-Type: application/json

{
  "code": "V0042"
}
```

**Success Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "anonymousCode": "V0042",
    "role": "VICTIM"
  }
}
```

## Endpoints

### Authentication
#### POST /api/auth/login
Authenticates a beneficiary with anonymous code.

**Parameters:**
- `code` (string, required): Access code in V#### format

#### POST /api/auth/validate
Validates an existing JWT token.

**Headers:**
- `Authorization: Bearer <token>`

### Courses
#### GET /api/courses
Lists all active courses.

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": "sewing-001",
      "title": "Professional Sewing",
      "description": "Complete sewing course",
      "duration_hours": 40,
      "modules_count": 8
    }
  ]
}
```

#### GET /api/courses/:id
Gets details of a specific course.

#### GET /api/courses/:id/modules
Lists modules of a course.

#### GET /api/courses/:id/quiz
Gets course quiz.

### Progress
#### GET /api/progress/user/:userCode/course/:courseId
Gets a beneficiary's progress in a specific course.

**Headers:**
- `Authorization: Bearer <token>`

#### PUT /api/progress/user/:userCode/course/:courseId
Updates a beneficiary's progress in a course.

**Parameters:**
- `completed_modules` (array): List of completed modules
- `current_module` (integer): Current module
- `percentage` (integer): Completion percentage

### Certificates
#### POST /api/certificates/generate
Generates a certificate for a beneficiary who completed a course.

**Parameters:**
- `anonymousCode` (string): Beneficiary code
- `courseId` (string): Course ID
- `score` (integer): Score obtained (0-100)

#### GET /api/certificates/verify/:verificationCode
Verifies certificate authenticity.

#### GET /api/certificates/user/:anonymousCode/course/:courseId
Gets a beneficiary's certificate for a specific course.

### NGOs
#### GET /api/ngos
Lists all partner NGOs.

**Requires admin authentication.**

#### GET /api/ngos/:id
Gets details of a specific NGO.

#### POST /api/ngos
Creates a new NGO (requires admin authentication).

### Audit Logs
#### GET /api/audit-logs
Lists audit logs (requires admin authentication).

#### GET /api/audit-logs/user/:userCode
Gets audit logs for a specific beneficiary.

### USSD
#### POST /api/ussd
Processes USSD requests from mobile operators.

**Parameters:**
- `sessionId` (string): USSD session ID
- `serviceCode` (string): USSD service code
- `phoneNumber` (string): User's phone number
- `text` (string): User input text

#### POST /api/ussd/test
Endpoint to test USSD functionality.

#### GET /api/ussd/status
Gets USSD service status.

#### POST /api/sms/send
Sends an SMS message (simulation for demonstration).

## HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to access resource
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Request rate limit exceeded
- `500 Internal Server Error`: Server error

## Security

### Input Validation
All endpoints perform rigorous input validation:
- Beneficiary code format (V####)
- Score limits (0-100)
- Validation of existing IDs
- Data sanitization

### Rate Limiting
- General: 100 requests per 15 minutes per IP
- Authentication: 5 attempts per 15 minutes per IP
- USSD: 20 requests per 5 minutes per number

### Encryption
- Transit data: HTTPS/TLS
- Sensitive data: AES-256 encryption (implementation planned)
- Passwords: bcrypt hashing

## Usage Examples

### Querying a Beneficiary's Progress
```
GET /api/progress/user/V0042/course/sewing-001
Authorization: Bearer <valid_token>
```

### Generating a Certificate
```
POST /api/certificates/generate
Authorization: Bearer <valid_token>
Content-Type: application/json

{
  "anonymousCode": "V0042",
  "courseId": "sewing-001",
  "score": 85
}
```

## Error Handling

All endpoints return errors in format:
```json
{
  "success": false,
  "error": "Descriptive error message",
  "details": "Additional information (optional)"
}
```

## Privacy Considerations

- No personally identifiable information is exposed via public API
- Sensitive data is accessed only by authorized personnel
- All accesses are logged for audit
- Tokens have limited expiration time