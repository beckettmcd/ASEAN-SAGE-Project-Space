# SAGE TA Tracker - API Documentation

## Overview

The SAGE TA Tracker API is a RESTful API that provides comprehensive access to all system functionality. All endpoints require authentication unless otherwise specified.

**Base URL:** `http://localhost:5000/api`

**Authentication:** JWT Bearer Token

## Authentication

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "Implementer",
  "organisationId": "uuid"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Implementer"
  },
  "token": "jwt-token-here"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Implementer",
    "organisation": { ... }
  },
  "token": "jwt-token-here"
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Implementer",
    "organisation": { ... }
  }
}
```

## Dashboard Endpoints

### Regional Dashboard

```http
GET /api/dashboard/regional?pillar={pillar}&countryId={id}&fiscalYear={year}
Authorization: Bearer {token}
```

**Query Parameters:**
- `pillar` (optional): Filter by pillar name
- `countryId` (optional): Filter by country
- `fiscalYear` (optional): Filter by fiscal year

**Response:**
```json
{
  "budgetStats": {
    "totalBudget": 25000000,
    "totalSpend": 8500000,
    "totalCommitted": 15000000
  },
  "taCoverageByPillar": [
    {
      "pillar": "Learning Assessment",
      "assignmentCount": 15,
      "totalLoE": 450
    }
  ],
  "assignmentsByStatus": [ ... ],
  "indicatorProgress": [ ... ],
  "torByStatus": [ ... ],
  "countryPerformance": [ ... ]
}
```

### Country Dashboard

```http
GET /api/dashboard/country/{countryId}?pillar={pillar}
Authorization: Bearer {token}
```

### Workstream Dashboard

```http
GET /api/dashboard/workstream/{workstreamId}
Authorization: Bearer {token}
```

## Terms of Reference (ToRs)

### List ToRs

```http
GET /api/tors?status={status}&workstreamId={id}&page={page}&limit={limit}
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status (Draft, QA, Pending Approval, Approved, Rejected)
- `workstreamId` (optional): Filter by workstream
- `countryId` (optional): Filter by country
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "referenceNumber": "TOR-2024-001",
      "title": "SEA-PLM Technical Advisory",
      "status": "Approved",
      "workstream": { ... },
      "country": { ... },
      "estimatedBudget": 38250,
      "startDate": "2024-03-01",
      "endDate": "2024-06-30"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Get ToR by ID

```http
GET /api/tors/{id}
Authorization: Bearer {token}
```

### Create ToR

```http
POST /api/tors
Authorization: Bearer {token}
Content-Type: application/json

{
  "referenceNumber": "TOR-2024-001",
  "title": "Technical Advisory Support",
  "description": "Detailed description",
  "objectives": "List of objectives",
  "deliverables": "Expected deliverables",
  "qualifications": "Required qualifications",
  "estimatedLoE": 45,
  "dailyRate": 850,
  "estimatedBudget": 38250,
  "startDate": "2024-03-01",
  "endDate": "2024-06-30",
  "workstreamId": "uuid",
  "countryId": "uuid"
}
```

### Update ToR

```http
PUT /api/tors/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description"
}
```

### Approve ToR

```http
POST /api/tors/{id}/approve
Authorization: Bearer {token}
```

**Required Role:** FCDO SRO or Admin

### Reject ToR

```http
POST /api/tors/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json

{
  "rejectionReason": "Reason for rejection"
}
```

**Required Role:** FCDO SRO or Admin

### Submit ToR for Approval

```http
POST /api/tors/{id}/submit
Authorization: Bearer {token}
```

### Delete ToR

```http
DELETE /api/tors/{id}
Authorization: Bearer {token}
```

**Note:** Only draft ToRs can be deleted

## Assignments

### List Assignments

```http
GET /api/assignments?status={status}&workstreamId={id}&consultantId={id}&page={page}&limit={limit}
Authorization: Bearer {token}
```

### Get Assignment by ID

```http
GET /api/assignments/{id}
Authorization: Bearer {token}
```

**Response includes:**
- Assignment details
- Related ToR
- Consultant information
- LoE entries
- Deliverables
- Statistics (total LoE used, burn rate, remaining LoE)

### Create Assignment

```http
POST /api/assignments
Authorization: Bearer {token}
Content-Type: application/json

{
  "referenceNumber": "ASN-2024-001",
  "title": "SEA-PLM Technical Advisory",
  "startDate": "2024-03-01",
  "endDate": "2024-06-30",
  "contractedLoE": 45,
  "dailyRate": 850,
  "totalValue": 38250,
  "status": "Planned",
  "torId": "uuid",
  "consultantId": "uuid",
  "workstreamId": "uuid",
  "countryId": "uuid"
}
```

### Update Assignment

```http
PUT /api/assignments/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Active",
  "mobilisationDate": "2024-02-28"
}
```

### Delete Assignment

```http
DELETE /api/assignments/{id}
Authorization: Bearer {token}
```

## Indicators & Results

### List Indicators

```http
GET /api/indicators?type={type}&pillar={pillar}&workstreamId={id}&page={page}&limit={limit}
Authorization: Bearer {token}
```

**Query Parameters:**
- `type`: Outcome, Output, or Activity
- `pillar`: Pillar name
- `workstreamId`: Workstream UUID

### Get Indicator by ID

```http
GET /api/indicators/{id}
Authorization: Bearer {token}
```

**Response includes:**
- Indicator details
- All results with country breakdown
- Linked evidence
- Progress calculation

### Create Indicator

```http
POST /api/indicators
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "IND-1.1",
  "name": "Countries participating in SEA-PLM",
  "type": "Outcome",
  "description": "Number of ASEAN countries participating",
  "unit": "Number",
  "baseline": 6,
  "target": 10,
  "pillar": "Learning Assessment",
  "isGenderDisaggregated": false,
  "isDisabilityTagged": false,
  "isOOSCYRelated": false,
  "workstreamId": "uuid",
  "programmeId": "uuid"
}
```

### Add Result to Indicator

```http
POST /api/indicators/{id}/results
Authorization: Bearer {token}
Content-Type: application/json

{
  "reportingDate": "2024-03-31",
  "value": 2,
  "maleBeneficiaries": 0,
  "femaleBeneficiaries": 0,
  "disabilityBeneficiaries": 0,
  "ooscyBeneficiaries": 0,
  "notes": "Two additional countries confirmed",
  "verificationSource": "Official letter",
  "countryId": "uuid"
}
```

## Budgets & Financials

### List Budgets

```http
GET /api/budgets?fiscalYear={year}&workstreamId={id}&isPBRFlagged={boolean}
Authorization: Bearer {token}
```

### Get Budget Summary

```http
GET /api/budgets/summary?fiscalYear={year}&programmeId={id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "summary": [
    {
      "fiscalYear": "2024",
      "totalAllocated": 25000000,
      "totalCommitted": 15000000,
      "totalSpend": 8500000,
      "totalForecast": 24000000
    }
  ]
}
```

### Get Budget by ID

```http
GET /api/budgets/{id}
Authorization: Bearer {token}
```

**Response includes:**
- Budget details
- Related commitments
- Statistics (variance, burn rate, available funds)

### Create Budget

```http
POST /api/budgets
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "BDG-WS1-FY24",
  "name": "Learning Assessment FY24",
  "budgetLine": "1.1",
  "fiscalYear": "2024",
  "allocatedAmount": 1500000,
  "committedAmount": 0,
  "actualSpend": 0,
  "forecast": 1400000,
  "isPBRFlagged": false,
  "workstreamId": "uuid",
  "programmeId": "uuid"
}
```

## Risk Management

### List Risks

```http
GET /api/risks?status={status}&category={category}&programmeId={id}
Authorization: Bearer {token}
```

### Get Risk Matrix

```http
GET /api/risks/matrix?programmeId={id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "risks": [ ... ],
  "matrix": {
    "1": [],  // Risk score 1
    "4": [],  // Risk score 4
    "9": [ ... ],  // Risk score 9
    "16": [ ... ],
    "25": [ ... ]
  }
}
```

### Create Risk

```http
POST /api/risks
Authorization: Bearer {token}
Content-Type: application/json

{
  "referenceNumber": "RISK-001",
  "title": "Risk title",
  "description": "Detailed description",
  "category": "Operational",
  "likelihood": 4,
  "impact": 4,
  "mitigation": "Mitigation strategy",
  "mitigationOwner": "user-uuid",
  "status": "Open",
  "programmeId": "uuid",
  "workstreamId": "uuid"
}
```

**Note:** `riskScore` is automatically calculated as `likelihood × impact`

## Evidence Management

### List Evidence

```http
GET /api/evidence?type={type}&countryId={id}&deliverableId={id}
Authorization: Bearer {token}
```

### Create Evidence

```http
POST /api/evidence
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Training Workshop Report",
  "description": "Report from regional training",
  "type": "Report",
  "collectionDate": "2024-04-20",
  "source": "Workshop facilitator",
  "tags": ["training", "capacity building"],
  "deliverableId": "uuid",
  "countryId": "uuid",
  "indicatorIds": ["uuid1", "uuid2"]
}
```

### Link Evidence to Indicator

```http
POST /api/evidence/{id}/link-indicator
Authorization: Bearer {token}
Content-Type: application/json

{
  "indicatorId": "uuid"
}
```

## Generic Endpoints

All generic endpoints follow the same pattern:

```http
GET    /api/{resource}          # List with pagination
GET    /api/{resource}/{id}     # Get by ID
POST   /api/{resource}          # Create
PUT    /api/{resource}/{id}     # Update
DELETE /api/{resource}/{id}     # Delete
```

### Available Resources

- `/api/countries` - Country management
- `/api/programmes` - Programme management
- `/api/workstreams` - Workstream management
- `/api/consultants` - Consultant profiles
- `/api/organisations` - Organisation management
- `/api/suppliers` - Supplier management
- `/api/commitments` - Financial commitments
- `/api/invoices` - Invoice management
- `/api/loe-entries` - Level of Effort entries
- `/api/deliverables` - Deliverable management
- `/api/issues` - Issue tracking
- `/api/decisions` - Decision log
- `/api/lessons` - Lessons learned
- `/api/results` - Result entries
- `/api/safeguarding` - Safeguarding incidents (restricted)

## Export Endpoints

### Export to JSON

```http
GET /api/exports/json?entity={entity}&filters={json}
Authorization: Bearer {token}
```

**Entities:** assignments, budgets, indicators

### Export to CSV

```http
GET /api/exports/csv?entity={entity}
Authorization: Bearer {token}
```

**Response:** CSV file download

### Export to DevTracker Format

```http
GET /api/exports/devtracker?programmeId={id}
Authorization: Bearer {token}
```

### Export AR Pack

```http
GET /api/exports/ar-pack?programmeId={id}&quarter={Q1}&fiscalYear={2024}
Authorization: Bearer {token}
```

## Error Responses

The API uses conventional HTTP response codes:

**200 OK** - Request succeeded
**201 Created** - Resource created successfully
**204 No Content** - Resource deleted successfully
**400 Bad Request** - Invalid request data
**401 Unauthorized** - Missing or invalid authentication
**403 Forbidden** - Insufficient permissions
**404 Not Found** - Resource not found
**409 Conflict** - Duplicate entry
**500 Internal Server Error** - Server error

### Error Format

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response Format:**
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Filtering and Search

Most list endpoints support filtering via query parameters:

```http
GET /api/assignments?status=Active&countryId=uuid&workstreamId=uuid
```

Common filters:
- `status` - Filter by status
- `countryId` - Filter by country
- `workstreamId` - Filter by workstream
- `programmeId` - Filter by programme
- `search` - Full-text search (where supported)
- `startDate` / `endDate` - Date range filters

## Best Practices

1. **Authentication:**
   - Store JWT tokens securely
   - Include `Authorization: Bearer {token}` header in all requests
   - Handle 401 errors by redirecting to login

2. **Error Handling:**
   - Always check response status codes
   - Parse error messages for user feedback
   - Implement retry logic for 5xx errors

3. **Performance:**
   - Use pagination for large datasets
   - Apply filters to reduce response size
   - Cache responses when appropriate

4. **Security:**
   - Never expose JWT secrets
   - Use HTTPS in production
   - Validate all user input
   - Implement CSRF protection

## Code Examples

### JavaScript/Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});
localStorage.setItem('token', data.token);

// Get ToRs
const tors = await api.get('/tors', {
  params: { status: 'Approved', page: 1 }
});
```

### Python/Requests

```python
import requests

BASE_URL = 'http://localhost:5000/api'
token = None

# Login
response = requests.post(f'{BASE_URL}/auth/login', json={
    'email': 'user@example.com',
    'password': 'password'
})
token = response.json()['token']

# Get ToRs
headers = {'Authorization': f'Bearer {token}'}
response = requests.get(f'{BASE_URL}/tors', 
                       headers=headers,
                       params={'status': 'Approved'})
tors = response.json()
```

## Support

For API issues or questions:
- Check error messages and status codes
- Review this documentation
- Check the main README.md
- Contact the development team

