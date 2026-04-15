# REST API SPECIFICATION DOCUMENT
## aiOrthoScan Server - Healthcare Imaging & AI Diagnosis Platform

---

## 1. PROJECT INFORMATION

| Field | Details |
|-------|---------|
| **Project Name** | aiOrthoScan Server |
| **Project Type** | Healthcare AI-Powered Orthoscanning & Diagnostic Platform |
| **Course** | Advanced Web Technologies |
| **Group Members** | [Member 1: Name], [Member 2: Name] |
| **Submission Date** | [Current Date] |
| **Project Status** | Backend API Development Phase |

---

## 2. BRIEF PROJECT OVERVIEW

### 2.1 Project Description
**aiOrthoScan Server** is a cloud-based backend API designed to support a healthcare platform specializing in orthodontic and orthoscan imaging analysis. The system enables healthcare professionals and patients to upload dental/medical scans, store patient records, and leverage artificial intelligence (Google Gemini AI) to generate preliminary diagnostic insights from medical images.

### 2.2 Problem Statement
Healthcare providers require a secure, scalable platform to:
- Manage patient authentication and profiles
- Store and retrieve patient medical records
- Upload and process medical imaging files
- Generate AI-powered diagnostic recommendations
- Maintain data privacy and security through JWT-based authentication

### 2.3 Target Users
1. **Healthcare Professionals** - Upload patient scans, retrieve diagnoses
2. **Patients** - Manage personal records and scan history
3. **System Administrators** - Manage user accounts and system operations

### 2.4 Key Features
- Secure user authentication (Signup/Login with JWT)
- Patient profile management
- Medical image upload with metadata
- AI-powered diagnostic analysis using Google Gemini API
- Role-based access control (future implementation)
- Comprehensive error handling and logging

---

## 3. MODULES / ENTITIES / ROUTERS OVERVIEW

### 3.1 System Architecture

```
Client Layer (Frontend Application)
        ↓
   API Gateway / Express Server
        ↓
    ┌─────────────────────────────────┐
    │   Route Layer (Routing)         │
    │  - Auth Routes                  │
    │  - User Routes                  │
    └─────────────────────────────────┘
        ↓
    ┌─────────────────────────────────┐
    │ Controller Layer (HTTP Handlers)│
    │  - Auth Controllers             │
    │  - User Controllers             │
    └─────────────────────────────────┘
        ↓
    ┌─────────────────────────────────┐
    │ Service Layer (Business Logic)  │
    │  - Auth Services                │
    │  - User Services                │
    │  - AI Services                  │
    └─────────────────────────────────┘
        ↓
    ┌─────────────────────────────────┐
    │ Model Layer (Data Schema)       │
    │  - User Model                   │
    │  - Patient Record Model (Future)│
    │  - Diagnosis Model (Future)     │
    └─────────────────────────────────┘
        ↓
    ┌─────────────────────────────────┐
    │ Database (MongoDB)              │
    └─────────────────────────────────┘
```

### 3.2 Module Overview

| Module | Purpose | Routes | Protected |
|--------|---------|--------|-----------|
| **Authentication** | User registration and login | `/api/auth/signup`, `/api/auth/login` | ❌ No |
| **User Management** | Patient profiles and records | `/api/main/patientRecords` | ✅ Yes |
| **Patient Data** | Medical image uploads | `/api/main/uploadPatientData` | ⚠️ Unprotected (should be protected) |
| **AI Diagnosis** | AI-powered medical analysis | `/api/diagnosis/Aidiagnosis` | ⚠️ Unprotected (should be protected) |

### 3.3 Core Entities

#### User Entity
```
{
  _id: ObjectId (MongoDB Auto-generated)
  fullName: String
  age: String/Number
  gender: String (Male/Female/Other)
  email: String (Unique)
  password: String (Hashed with Bcrypt)
  refreshToken: String (Optional - For token refresh)
  createdAt: Date (MongoDB timestamp)
  updatedAt: Date (MongoDB timestamp)
}
```

#### Patient Record Entity (Proposed)
```
{
  _id: ObjectId
  patientId: ObjectId (Reference to User)
  scanType: String (X-ray, CBCT, Intraoral, etc.)
  scanDate: Date
  imageUrl: String (Cloud storage path)
  medicalDetails: String
  createdAt: Date
}
```

#### Diagnosis Record Entity (Proposed)
```
{
  _id: ObjectId
  patientRecordId: ObjectId (Reference to Patient Record)
  aiResponse: String (AI-generated diagnosis)
  promptUsed: String
  model: String (Gemini version)
  generatedAt: Date
}
```

---

## 4. API ENDPOINTS SPECIFICATION

### 4.1 AUTHENTICATION ENDPOINTS

#### 4.1.1 User Registration (Signup)

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Route** | `/api/auth/signup` |
| **Description** | Creates a new user account with email and password |
| **Authentication Required** | ❌ No |
| **Content-Type** | application/json |

**Request Body:**
```json
{
  "fullName": "string (required, 2-100 characters)",
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 6 characters)",
  "age": "string (required)",
  "gender": "string (required, enum: Male/Female/Other)"
}
```

**Success Response (201 - Created):**
```json
{
  "success": true,
  "data": {
    "_id": "string (MongoDB ObjectId)",
    "fullName": "string",
    "email": "string",
    "age": "string",
    "gender": "string",
    "createdAt": "date-time"
  }
}
```

**Error Responses:**

| Status | Scenario | Response |
|--------|----------|----------|
| 400 | Missing required field | `{"success": false, "message": "Missing required field: [fieldName]"}` |
| 400 | Invalid email format | `{"success": false, "message": "Invalid email format"}` |
| 400 | Password too weak | `{"success": false, "message": "Password must be at least 6 characters"}` |
| 409 | User already exists | `{"success": false, "message": "User already exists!"}` |
| 500 | Database error | `{"success": false, "message": "Database connection error"}` |

**Normal Course (Happy Path):**
1. User sends registration request with valid credentials
2. System validates email uniqueness
3. System validates all required fields
4. Password is hashed using Bcrypt (salt rounds: 10)
5. User record created in MongoDB
6. Success response returned with user data (password excluded)
7. Client stores success message and redirects to login

**Alternate Courses:**
- User provides existing email → Error 409 returned, prompt to login
- User provides weak password → Error 400 returned, request retry with stronger password
- User provides invalid email format → Error 400 returned, request email correction

**Exceptions:**
- Database connection fails → Error 500, inform user to retry later
- Network timeout during registration → Client-side retry logic
- Database constraint violation → Error 409, inform user of duplicate account

---

#### 4.1.2 User Login

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Route** | `/api/auth/login` |
| **Description** | Authenticates user and returns JWT access token |
| **Authentication Required** | ❌ No |
| **Content-Type** | application/json |

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Success Response (200 - OK):**
```json
{
  "success": true,
  "data": {
    "userObj": {
      "_id": "string (MongoDB ObjectId)",
      "fullName": "string",
      "email": "string",
      "age": "string",
      "gender": "string"
    },
    "token": "string (JWT access token)"
  }
}
```

**JWT Token Structure:**
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "_id": "userId", "fullName": "userName" }
Secret: ACCESS_TOKEN_SECRET_KEY (from environment)
Expiry: No expiry set (recommended to add expiry in future)
Format: Bearer token
```

**Error Responses:**

| Status | Scenario | Response |
|--------|----------|----------|
| 400 | Missing email or password | `{"success": false, "message": "Email and password required"}` |
| 400 | User not found | `{"success": false, "message": "User doesn't exist!"}` |
| 400 | Incorrect password | `{"success": false, "message": "Wrong Password"}` |
| 500 | Server error | `{"success": false, "message": "Server error"}` |

**Normal Course (Happy Path):**
1. User submits login credentials
2. System validates email exists in database
3. System compares provided password with hashed password using Bcrypt
4. Password matches → JWT token generated with user ID and name
5. Token returned to client
6. Client stores token in localStorage/sessionStorage
7. Client adds token to Authorization header for future requests

**Alternate Courses:**
- Email not found → Error 400 returned, suggest signup
- Password incorrect → Error 400 returned, prompt for retry
- User account locked (future feature) → Error 403 returned

**Exceptions:**
- Database unavailable → Error 500 returned
- Bcrypt comparison fails → Error 500 returned
- Invalid email format provided → Error 400, request format correction

---

### 4.2 USER MANAGEMENT ENDPOINTS

#### 4.2.1 Get Patient Records

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **Route** | `/api/main/patientRecords` |
| **Description** | Retrieves authenticated user's profile and associated records |
| **Authentication Required** | ✅ Yes (JWT Bearer Token) |
| **Content-Type** | application/json |

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Parameters:** None

**Success Response (200 - OK):**
```json
{
  "success": true,
  "user": {
    "tokenData": {
      "_id": "string (User ID from token)",
      "fullName": "string"
    },
    "userData": {
      "_id": "string",
      "fullName": "string",
      "age": "string",
      "gender": "string",
      "createdAt": "date-time"
    }
  }
}
```

**Error Responses:**

| Status | Scenario | Response |
|--------|----------|----------|
| 401 | No token provided | `{"message": "No token provided"}` |
| 401 | Invalid token format | `{"message": "Invalid token format"}` |
| 403 | Token expired or invalid | `{"message": "Invalid or expired token"}` |
| 404 | User not found | `{"success": false, "message": "User not found"}` |
| 500 | Database error | `{"success": false, "message": "Database error"}` |

**Normal Course (Happy Path):**
1. Client sends GET request with valid JWT token in Authorization header
2. Middleware verifies token signature and validity
3. Token decoded to extract user ID
4. System finds user in database by ID
5. User data retrieved (password and email excluded)
6. Token data and user data returned to client
7. Client displays user profile and records

**Alternate Courses:**
- Token format invalid → Error 401 returned, redirect to login
- Token expired → Error 403 returned, prompt for re-login
- User record deleted → Error 404 returned, inform user

**Exceptions:**
- MongoDB connection fails → Error 500 returned
- Token verification library error → Error 403 returned
- Concurrent request conflicts → System handles gracefully with isolation

---

### 4.3 PATIENT DATA ENDPOINTS

#### 4.3.1 Upload Patient Data

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Route** | `/api/main/uploadPatientData` |
| **Description** | Uploads medical imaging files with associated metadata |
| **Authentication Required** | ⚠️ **Should be YES** (Currently unprotected) |
| **Content-Type** | multipart/form-data |
| **File Size Limit** | 25 MB (configurable) |

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN> (recommended - currently optional)
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
Field: image (File) - required
  - Accepted formats: JPEG, PNG, WebP, GIF
  - Max size: 25 MB
  - Field name must be: "image"

Field: relevantData (JSON String) - optional
  - Format: JSON string
  - Example: '{"patientId":"123", "scanType":"X-ray", "notes":"frontal view"}'
```

**Request Example:**
```
POST /api/main/uploadPatientData HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="image"; filename="scan.jpg"
Content-Type: image/jpeg
[Binary image data]
------FormBoundary
Content-Disposition: form-data; name="relevantData"
{"scanType":"CBCT", "notes":"Full mouth scan"}
------FormBoundary--
```

**Success Response (200 - OK):**
```json
{
  "message": "Image received in memory",
  "originalName": "string (original filename)",
  "size": "number (file size in bytes)",
  "relevantData": {
    "scanType": "string",
    "notes": "string"
  }
}
```

**Error Responses:**

| Status | Scenario | Response |
|--------|----------|----------|
| 400 | No file provided | `{"error": "No file provided"}` |
| 400 | File too large | `{"error": "File size exceeds 25 MB limit"}` |
| 400 | Invalid file type | `{"error": "Only image files (JPEG, PNG, WebP) allowed"}` |
| 401 | No token provided | `{"message": "No token provided"}` (if authentication added) |
| 403 | Token invalid | `{"message": "Invalid or expired token"}` (if authentication added) |
| 500 | Server error | `{"error": "Server error during file processing"}` |

**Normal Course (Happy Path):**
1. Client prepares multipart request with image file and metadata
2. Client sends request with JWT token (recommended)
3. Multer middleware processes multipart data
4. System validates file size and type
5. File loaded into memory (binary buffer)
6. Metadata validated (if provided)
7. Currently: Response with file metadata is returned
8. **Future flow**: File should be stored in cloud storage (AWS S3, Cloudinary)
9. **Future flow**: Patient record created in database with image reference

**Alternate Courses:**
- File format unsupported → Error 400 returned, prompt for supported format
- File size exceeds limit → Error 400 returned, request compressed image
- Metadata malformed JSON → Error 400 returned, request valid JSON
- User not authenticated (after auth implementation) → Error 401 returned, request login

**Exceptions:**
- Multer library fails → Error 500 returned
- Memory storage insufficient → Error 500 returned
- Database save fails (future) → Error 500 returned, file discarded
- Network interruption during upload → Client retries or resumes upload

**Important Notes - Current Limitations:**
- ⚠️ Files stored in memory only (lost on server restart)
- ⚠️ No persistent database storage implemented
- ⚠️ No authentication enforcement (security risk)
- 🔄 **RECOMMENDED IMPROVEMENTS**:
  - Implement cloud storage integration
  - Add database persistence for patient records
  - Enforce JWT authentication
  - Add file scanning for malware
  - Implement progress tracking for large files

---

### 4.4 AI DIAGNOSIS ENDPOINTS

#### 4.4.1 Generate AI Diagnosis

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **Route** | `/api/diagnosis/Aidiagnosis` |
| **Description** | Processes medical image and generates AI-powered diagnostic analysis |
| **Authentication Required** | ⚠️ **Should be YES** (Currently unprotected) |
| **Content-Type** | application/json |
| **External API** | Google Generative AI (Gemini 2.5 Flash) |
| **Rate Limit** | Recommended: 10 requests/minute per user |

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN> (recommended - currently optional)
Content-Type: application/json
```

**Request Body:**
```json
{
  "imageBase64": "string (required, base64-encoded image data)",
  "promptText": "string (required, medical query/instruction for AI)",
  "patientId": "string (optional, for record association)"
}
```

**Request Body Example:**
```json
{
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=",
  "promptText": "Analyze this dental X-ray image. Identify any cavities, orthodontic issues, or abnormalities. Provide recommendations.",
  "patientId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200 - OK):**
```json
{
  "success": true,
  "data": "string (AI-generated diagnostic response)"
}
```

**AI Response Example:**
```json
{
  "success": true,
  "data": "Based on analysis of the dental X-ray:\n\n1. FINDINGS:\n- Cavity detected on tooth #14 (upper right second molar)\n- Early signs of periodontal disease\n- Alignment issue: Upper incisors slightly proclined\n\n2. RECOMMENDATIONS:\n- Schedule dental appointment for cavity treatment\n- Consider periodontal evaluation\n- Orthodontic consultation may be beneficial\n\n3. FOLLOW-UP:\n- Routine check-up in 6 months\n- Improve oral hygiene practices"
}
```

**Error Responses:**

| Status | Scenario | Response |
|--------|----------|----------|
| 400 | Missing imageBase64 | `{"success": false, "message": "imageBase64 is required"}` |
| 400 | Missing promptText | `{"success": false, "message": "promptText is required"}` |
| 400 | Invalid base64 format | `{"success": false, "message": "Invalid base64 encoded image"}` |
| 401 | No token provided | `{"message": "No token provided"}` (if authentication added) |
| 403 | Token invalid | `{"message": "Invalid or expired token"}` (if authentication added) |
| 429 | Rate limit exceeded | `{"success": false, "message": "Rate limit exceeded. Try again in 60 seconds"}` |
| 500 | AI service error | `{"success": false, "error": "AI processing failed"}` |
| 503 | Google API unavailable | `{"success": false, "message": "AI service temporarily unavailable"}` |

**Normal Course (Happy Path):**
1. User sends POST request with medical image (base64) and analysis prompt
2. System validates token (after auth implementation)
3. Request forwarded to Google Generative AI service
4. Gemini 2.5 Flash model processes image and prompt
5. AI generates diagnostic analysis based on image and query
6. Response extracted from Google API
7. Diagnosis returned to user with success status
8. **Future**: Diagnosis record saved to database
9. **Future**: Diagnostic history stored for patient

**Alternate Courses:**
- Image quality too poor → AI returns low-confidence response, user prompted to resubmit
- Prompt unclear → AI requests clarification or provides general analysis
- Rate limit hit → Error 429 returned, user asked to retry in 60 seconds
- Unrelated image provided → AI processes anyway but may provide irrelevant analysis

**Exceptions:**
- Google API key invalid → Error 500 returned, admin notified
- Network timeout calling Google API → Error 503 returned, user prompted to retry
- Image parsing error → Error 400 returned
- JSON parsing error in request → Error 400 returned
- Database save fails (future) → Warning logged, diagnosis still returned to user
- Concurrent requests exceed quota → Error 429 returned with retry-after header

**Security & Compliance Notes:**
- ⚠️ Currently unprotected (SECURITY RISK)
- ⚠️ No rate limiting implemented
- ⚠️ No audit logging for diagnostic requests
- ⚠️ Image data not validated for HIPAA compliance
- 🔄 **RECOMMENDED IMPROVEMENTS**:
  - Enforce JWT authentication
  - Implement rate limiting (10 req/min per user)
  - Add audit logging for compliance
  - Validate image doesn't contain PII
  - Implement caching for identical prompts
  - Add cost tracking for API usage

**Performance Considerations:**
- Google Gemini API response time: 2-10 seconds typically
- Large images may take longer to process
- Consider implementing request queuing for high load
- Implement caching layer for common diagnoses

**Important Notes - Current Limitations:**
- 🔴 **NO USER AUTHENTICATION** - Any client can call this endpoint
- 🔴 **NO RATE LIMITING** - Users can spam requests (expensive)
- 🔴 **NO AUDIT LOGGING** - No compliance trail for medical data
- 🟡 **LIMITED ERROR HANDLING** - Some failures not properly caught
- 🟡 **NO DATABASE PERSISTENCE** - Diagnoses not saved for patient records

---

## 5. ERROR HANDLING STRUCTURE

### 5.1 Global Error Handling Strategy

#### 5.1.1 Error Response Format
All error responses follow a consistent structure:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "errorCode": "ERROR_CODE_ENUM",
  "statusCode": "HTTP_STATUS_CODE",
  "details": {} // Optional: Additional error details
}
```

#### 5.1.2 Error Categories & HTTP Status Codes

| Category | Status | Code | Description |
|----------|--------|------|-------------|
| **Client Errors** | 400 | BAD_REQUEST | Malformed request, missing fields |
| | 401 | UNAUTHORIZED | No/invalid authentication |
| | 403 | FORBIDDEN | Authenticated but insufficient permissions |
| | 404 | NOT_FOUND | Resource doesn't exist |
| | 409 | CONFLICT | Resource conflict (duplicate) |
| | 429 | RATE_LIMITED | Too many requests |
| **Server Errors** | 500 | INTERNAL_ERROR | Server error (generic) |
| | 503 | SERVICE_UNAVAILABLE | External service unavailable |

### 5.2 Error Handling Implementation

#### 5.2.1 Validation Errors (400 - Bad Request)
**Scenario:** User submits invalid request data
```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "statusCode": 400,
  "details": {
    "field": "email",
    "reason": "Invalid email format",
    "value": "not-an-email"
  }
}
```

#### 5.2.2 Authentication Errors (401 - Unauthorized)
**Scenario:** Token missing or malformed
```json
{
  "success": false,
  "message": "No token provided",
  "errorCode": "NO_AUTH_TOKEN",
  "statusCode": 401
}
```

#### 5.2.3 Authorization Errors (403 - Forbidden)
**Scenario:** Token invalid or expired
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "errorCode": "TOKEN_EXPIRED",
  "statusCode": 403
}
```

#### 5.2.4 Conflict Errors (409 - Conflict)
**Scenario:** Resource already exists (duplicate email)
```json
{
  "success": false,
  "message": "User with this email already exists",
  "errorCode": "DUPLICATE_RESOURCE",
  "statusCode": 409,
  "details": {
    "field": "email",
    "existingValue": "user@example.com"
  }
}
```

#### 5.2.5 Server Errors (500 - Internal Server Error)
**Scenario:** Unexpected server-side error
```json
{
  "success": false,
  "message": "An unexpected error occurred",
  "errorCode": "INTERNAL_SERVER_ERROR",
  "statusCode": 500,
  "details": {
    "timestamp": "2026-04-08T10:30:00Z",
    "path": "/api/auth/login",
    "resolveId": "ERROR_12345" // For user support
  }
}
```

#### 5.2.6 External Service Errors (503 - Service Unavailable)
**Scenario:** Google Gemini API unreachable
```json
{
  "success": false,
  "message": "AI service temporarily unavailable",
  "errorCode": "EXTERNAL_SERVICE_ERROR",
  "statusCode": 503,
  "details": {
    "service": "Google Generative AI",
    "retryAfter": 300 // seconds
  }
}
```

### 5.3 Error Handling Middleware

#### 5.3.1 Global Error Catch Handler (Recommended Implementation)
```
Middleware Stack Order:
1. Routes (throw errors if needed)
2. Route Error Handlers (specific route catches)
3. Global Error Handler (catches all)
4. 404 Handler (catch-all for unmatched routes)

Error Flow:
Route Error → Controller Handler → Service Exception → Controller Catches → 
Response Sent OR Error Passed to Next Middleware → Global Handler → 
Formatted Error Response Sent to Client
```

#### 5.3.2 Database Error Handling
| Error Type | Handling Strategy | HTTP Status |
|------------|-------------------|-------------|
| Connection Failed | Retry logic + circuit breaker | 503 |
| Invalid ObjectId | Return 400 validation error | 400 |
| Duplicate Key | Return 409 conflict error | 409 |
| Query Timeout | Return 504 gateway timeout | 504 |
| Data Validation | Return 400 with field details | 400 |

#### 5.3.3 External Service Error Handling
| Error Type | Handling Strategy | HTTP Status |
|------------|-------------------|-------------|
| Timeout | Retry 2-3x with exponential backoff | 503 |
| Rate Limited | Queue request or return 429 | 429 |
| Invalid API Key | Log alert + return 500 | 500 |
| Service Down | Return degraded response | 503 |

### 5.4 Error Logging Strategy

**Log Levels:**
```
ERROR   - Application errors, exceptions (Store in database)
WARN    - Unexpected situations, deprecated usage (Store in database)
INFO    - Important business events, successful operations (Console only)
DEBUG   - Detailed diagnostic info for debugging (Development only)
```

**Logged Information:**
- Timestamp (ISO 8601 format)
- Log Level
- Error Message
- Stack Trace (for ERROR level)
- Request Path & Method
- User ID (if authenticated)
- Additional Context
- Request ID (for tracing)

---

## 6. MIDDLEWARE FUNCTIONALITIES

### 6.1 Built-in Middlewares

| Middleware | Purpose | Applied To | Order |
|------------|---------|-----------|-------|
| **express.json()** | Parse JSON request bodies | All routes | 1st |
| **express.urlencoded()** | Parse form-encoded bodies | All routes | 2nd |
| **cors()** | Enable Cross-Origin requests | All routes | 3rd |
| **morgan()** | HTTP request logging | All routes | 4th |

### 6.2 Custom Middlewares

#### 6.2.1 Authentication Middleware (verifyToken)

**Purpose:** Validates JWT tokens in Authorization header

**Location:** `middlewares/auth/verifytoken.js`

**Functionality:**
1. Extracts token from Authorization header
2. Validates header format (Bearer scheme)
3. Verifies JWT signature using SECRET_KEY
4. Decodes token payload
5. Attaches user data to request object (req.user)
6. Passes control to next middleware/route

**Applied Routes:**
- `GET /api/main/patientRecords`

**Success Flow:**
```
Request with Authorization header
        ↓
Token extracted from "Bearer <token>"
        ↓
JWT signature verified
        ↓
Token decoded → user data extracted
        ↓
req.user = decoded token payload
        ↓
next() called → route handler executed
```

**Error Flow:**
```
Missing Authorization header
        ↓
Return 401: "No token provided"

Invalid header format
        ↓
Return 401: "Invalid token format"

Invalid/expired token
        ↓
Return 403: "Invalid or expired token"
```

**Middleware Code Behavior:**
```
Input: Request with Authorization header
Output: Either:
  a) Attach req.user (success) → Call next()
  b) Return error JSON response (failure) → Terminate chain
```

**Expected Token Format:**
```
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 6.2.2 File Upload Middleware (Multer Configuration)

**Purpose:** Handle multipart/form-data requests for file uploads

**Location:** `Routes/user/uploadPatientData.js`

**Configuration:**
```
Storage: Memory Storage (files not persisted to disk)
Field Name: "image"
Max File Size: 25 MB (recommended)
Accepted Files: Single file only
```

**Functionality:**
1. Intercepts multipart form-data requests
2. Parses form fields and files separately
3. Stores file in memory (buffer)
4. Attaches file metadata to req.file
5. Attaches form fields to req.body
6. Passes control to route handler

**Applied Routes:**
- `POST /api/main/uploadPatientData`

**Available File Data in Route:**
- `req.file.fieldname` - Form field name ("image")
- `req.file.originalname` - Original filename
- `req.file.encoding` - File encoding
- `req.file.mimetype` - Content-Type
- `req.file.size` - File size in bytes
- `req.file.buffer` - Binary image data (buffer)

**Example Usage in Controller:**
```javascript
const file = req.file;
const form_fields = req.body;

console.log(file.originalname);  // "scan.jpg"
console.log(file.size);           // 2048576 (2MB)
console.log(file.buffer);         // <Buffer ...>
```

#### 6.2.3 Environment Configuration Middleware (Optional - Recommended)

**Purpose:** Validate required environment variables at startup

**Recommended Implementation:**
```
Runs at server startup
Checks for required env vars:
  - MONGO_URI
  - ACCESS_TOKEN_SECRET_KEY
  - GEMINI_API_KEY
  - PORT
If missing → Exit process with error message
If valid → Continue server startup
```

#### 6.2.4 Rate Limiting Middleware (Recommended - Not Implemented)

**Purpose:** Prevent API abuse and DDoS attacks

**Recommended Implementation:**
```
Tracks requests by:
  - IP address (for unauthenticated endpoints)
  - User ID (for authenticated endpoints)

Configuration per endpoint:
  - Auth endpoints: 5 requests/minute per IP
  - Diagnosis endpoint: 10 requests/minute per user
  - Upload endpoint: 20 requests/minute per user

On limit exceeded:
  - Return 429 status with Retry-After header
  - Log rate limit event
  - Optionally block IP after repeated violations
```

#### 6.2.5 Request Validation Middleware (Recommended - Not Implemented)

**Purpose:** Validate request data before route handler execution

**Benefits:**
- Single validation point
- Consistent error format
- Reduced code duplication
- Better error messages

**Recommended Schemas:**
```
Signup Validation:
  - email: valid email string
  - password: minimum 6 characters
  - fullName: non-empty string
  - age: number or string
  - gender: enum (Male/Female/Other)

Login Validation:
  - email: valid email string
  - password: non-empty string

AI Diagnosis Validation:
  - imageBase64: valid base64 string
  - promptText: non-empty string, max 500 chars
  - patientId: optional, valid MongoDB ObjectId
```

### 6.3 Middleware Execution Order (Pipeline)

```
Client Request
        ↓
1. express.json()              [Parse request body]
        ↓
2. express.urlencoded()        [Parse URL-encoded body]
        ↓
3. cors()                      [Handle CORS headers]
        ↓
4. morgan()                    [Log request details]
        ↓
5. Router matching             [Route to correct handler]
        ↓
6. Route-specific middlewares  [verifyToken, upload, etc.]
        ↓
7. Route handler (Controller)  [Process request]
        ↓
8. Error handling              [Catch any errors]
        ↓
Response sent to client
```

### 6.4 Middleware Error Handling

| Middleware | Error Handling |
|-----------|-----------------|
| **express.json()** | Returns 400 if JSON malformed |
| **multer** | Sets req.file undefined if no file; 400 if exceeds size |
| **cors()** | Returns 403 if origin not allowed |
| **verifyToken** | Returns 401/403 if token invalid |

### 6.5 CORS Configuration

**Current Configuration:**
```
Enabled: Yes
Methods Allowed: All
Headers Allowed: All
Credentials: Not configured
```

**Recommended Production Configuration:**
```
Allowed Origins: ["https://frontend.com", "https://app.com"]
Allowed Methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
Allowed Headers: ["Content-Type", "Authorization"]
Expose Headers: ["Content-Length", "X-Request-Id"]
Credentials: true
Max Age: 86400 seconds (24 hours)
```

---

## 7. SECURITY CONSIDERATIONS

### 7.1 Current Security Status

| Component | Status | Severity | Notes |
|-----------|--------|----------|-------|
| **Password Storage** | ✅ Implemented | Low Risk | BCrypt with salt rounds: 10 |
| **Authentication** | ⚠️ Partial | Medium Risk | Only 1 endpoint protected |
| **Token Expiry** | ❌ Not Implemented | High Risk | Tokens never expire |
| **Rate Limiting** | ❌ Not Implemented | High Risk | Expensive API vulnerable to abuse |
| **Input Validation** | ❌ Not Implemented | High Risk | No request body validation |
| **HTTPS** | ❌ Not Implemented | High Risk | All communication in plain text |
| **CORS** | ⚠️ Open | Medium Risk | Allows all origins |
| **Environment Secrets** | ✅ Best Practice | Low Risk | Uses .env file |

### 7.2 Recommended Security Enhancements

1. **JWT Token Expiry** - Add 24-hour expiry with refresh token mechanism
2. **Protect All Endpoints** - Apply JWT verification to business logic endpoints
3. **Input Validation** - Use validation library (Joi, Yup, Zod)
4. **Rate Limiting** - Implement rate-limiter-flexible or similar
5. **HTTPS Required** - Enforce TLS/SSL in production
6. **Restrictive CORS** - Whitelist specific origins only
7. **Request Logging** - Log all API requests for audit trail
8. **Data Encryption** - Encrypt sensitive data in database
9. **SQL/NoSQL Injection Prevention** - Already using Mongoose (safe)
10. **XSS Protection** - Sanitize user inputs (future frontend concern)

---

## 8. FUTURE ENHANCEMENTS

### 8.1 Proposed Features

1. **Patient Records Management**
   - Create database model for patient scans
   - Link scans to user accounts
   - Store scan metadata (date, type, notes)
   - Retrieve patient scan history

2. **Diagnosis History**
   - Save AI diagnosis results to database
   - Link diagnoses to patient records
   - Track diagnosis timeline
   - Compare multiple diagnoses

3. **Role-Based Access Control (RBAC)**
   - Admin role: Manage users, view analytics
   - Doctor role: Analyze scans, provide recommendations
   - Patient role: Upload scans, view own diagnoses
   - Staff role: Data entry, record management

4. **File Storage Integration**
   - Replace in-memory storage with cloud storage (AWS S3)
   - Implement image compression
   - Add image validation/scanning
   - Generate signed URLs for download

5. **Refresh Token Mechanism**
   - Implement token refresh endpoint
   - Store refresh tokens in database
   - Add token blacklist for logout

6. **Analytics Dashboard**
   - Track diagnosis trends
   - Monitor API usage
   - Generate reports
   - System health metrics

7. **Notification System**
   - Email notifications for diagnosis results
   - SMS alerts for urgent findings
   - In-app notifications

8. **Doctor Collaboration**
   - Share diagnoses with other doctors
   - Add comments/notes to diagnoses
   - Consultation request system

---

## 9. DEPLOYMENT & CONFIGURATION

### 9.1 Environment Variables Template

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/aiorthoscan

# Authentication
ACCESS_TOKEN_SECRET_KEY=your_random_secret_key_here_min_32_characters

# External APIs
GEMINI_API_KEY=your_google_generative_ai_api_key

# File Upload
MAX_FILE_SIZE=26214400  # 25 MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# CORS Configuration (Recommended)
ALLOWED_ORIGINS=https://frontend.com,https://app.com

# Rate Limiting (Recommended)
RATE_LIMIT_WINDOW=60000  # 1 minute in ms
RATE_LIMIT_MAX_REQUESTS=10
```

### 9.2 API Base URL

**Development:**
```
http://localhost:5000/api
```

**Production:**
```
https://api.aiorthoscan.com/api
```

---

## 10. API TESTING EXAMPLES

### 10.1 Signup Request (cURL)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Dr. John Smith",
    "email": "dr.smith@hospital.com",
    "password": "SecurePass123",
    "age": "35",
    "gender": "Male"
  }'
```

### 10.2 Login Request (cURL)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.smith@hospital.com",
    "password": "SecurePass123"
  }'
```

### 10.3 Get Patient Records (cURL)
```bash
curl -X GET http://localhost:5000/api/main/patientRecords \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 10.4 Upload Patient Data (cURL)
```bash
curl -X POST http://localhost:5000/api/main/uploadPatientData \
  -F "image=@/path/to/scan.jpg" \
  -F 'relevantData={"scanType":"X-ray","notes":"frontal view"}'
```

### 10.5 AI Diagnosis Request (cURL)
```bash
curl -X POST http://localhost:5000/api/diagnosis/Aidiagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "promptText": "Analyze this dental X-ray for abnormalities"
  }'
```

---

## 11. DOCUMENT METADATA

| Property | Value |
|----------|-------|
| **Document Version** | 1.0 |
| **Last Updated** | April 8, 2026 |
| **API Version** | 1.0.0 (Beta) |
| **Server Technology** | Node.js + Express 5.2.1 |
| **Database** | MongoDB 9.2.1 |
| **Status** | In Development |
| **Next Review Date** | May 8, 2026 |

---

**End of API Specification Document**

*This document is confidential and intended for authorized development team members only.*
