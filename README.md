# ASEAN-UK SAGE TA Tracker

A comprehensive Technical Assistance tracking and management system for the ASEAN-UK SAGE Programme.

## Overview

The SAGE TA Tracker provides FCDO and ASEAN partners with real-time visibility on technical assistance delivery, spend, outputs, and results across ASEAN Member States (AMS). It serves as a single source of truth for the TA pipeline, mobilisations, Level of Effort (LoE), deliverables, and Key Performance Indicators (KPIs).

## Features

### 1. Dashboard & Reporting
- Regional overview with spend vs plan visualization
- TA coverage by pillar and country
- RAG status indicators
- Real-time KPI tracking
- Drill-down capability to country and workstream levels

### 2. TA Operations
- ToR creation and approval workflow
- Assignment management and tracking
- Consultant profiles and rate cards
- LoE tracking and timesheet entry
- Mobilisation status with SLA monitoring

### 3. Results & Evidence Management
- Indicator hierarchy (Outcome → Output → Activity)
- Target vs actual progress tracking
- Deliverable entry and quality review
- Evidence locker with indicator linkages
- Gender/disability tagging and OOSCY metrics

### 4. Financial Management
- Budget hierarchy and allocation tracking
- Commitment and invoice management
- Spend vs budget variance analysis
- Burn rate calculations
- PBR flagging
- Supplier/vendor profiles

### 5. Risk & Safeguarding
- Risk register with scoring (likelihood × impact)
- Mitigation tracking with owners
- Issue log and resolution tracking
- Safeguarding incident log (restricted access)
- Decisions and lessons learned capture

### 6. Interoperability
- JSON and CSV export functionality
- DevTracker export format
- AR pack generation
- RESTful API for integrations

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 14+
- **ORM:** Sequelize
- **Authentication:** JWT with bcrypt
- **Security:** Helmet, CORS, Rate Limiting

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation
- **UI:** Tailwind CSS
- **Charts:** Recharts
- **Build Tool:** Vite

## Project Structure

```
/backend
  /src
    /config         - Database and app configuration
    /models         - Sequelize database models
    /controllers    - Business logic and request handlers
    /routes         - API route definitions
    /middleware     - Auth, validation, error handling
    /utils          - Helper functions and utilities
    server.js       - Main server entry point

/frontend
  /src
    /components     - Reusable UI components
    /pages          - Route page components
    /contexts       - React contexts (Auth, etc.)
    /services       - API client functions
    /utils          - Helper functions
    App.jsx         - Main app component
    main.jsx        - Entry point

/docs
  API.md           - API documentation
  SETUP.md         - Setup instructions
```

## Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "ASEAN SAGE Project Space"
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure the database**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   # From project root
   npm run dev
   ```

   This will start:
   - Backend API on http://localhost:5000
   - Frontend app on http://localhost:3000

### Demo Credentials

After seeding the database, you can log in with these accounts:

- **Admin**: `admin@sage.org` / `admin123`
- **FCDO SRO**: `sro@fcdo.gov.uk` / `fcdo123`
- **Country Focal Point**: `focal@edu.gov.th` / `focal123`
- **Implementer**: `impl@dai.com` / `impl123`

## Key User Workflows

### 1. ToR Approval Workflow
1. Implementer creates Draft ToR
2. ToR moves to QA status
3. Submits for Approval (Pending Approval)
4. FCDO SRO approves or rejects
5. Approved ToRs can be linked to Assignments

### 2. Assignment Management
1. Create Assignment linked to approved ToR
2. Assign Consultant
3. Track LoE entries and timesheets
4. Monitor burn rate against contracted LoE
5. Record deliverables and evidence

### 3. Evidence Linking
1. Upload evidence documents
2. Link evidence to deliverables
3. Link evidence to indicators
4. Track indicator progress
5. Generate reports and exports

### 4. Financial Tracking
1. Set up budget hierarchy
2. Create commitments against budgets
3. Generate and approve invoices
4. Track actual spend vs budget
5. Monitor burn rates and variances

## API Documentation

The API follows RESTful conventions with JWT authentication.

### Authentication
```bash
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me
```

### Core Endpoints
- `/api/dashboard/*` - Dashboard aggregations
- `/api/tors/*` - Terms of Reference
- `/api/assignments/*` - Assignments
- `/api/indicators/*` - Indicators and results
- `/api/budgets/*` - Budgets and financials
- `/api/risks/*` - Risk register
- `/api/evidence/*` - Evidence locker
- `/api/exports/*` - Data export

For detailed API documentation, see [docs/API.md](docs/API.md)

## Security Features

- JWT-based authentication with secure token storage
- Role-based access control (RBAC) with 5 user roles
- Password hashing with bcrypt
- SQL injection protection via ORM
- XSS protection with Helmet
- CORS configuration
- Rate limiting on API endpoints
- Audit trail for all data changes

## Role-Based Access Control

### Admin
- Full system access
- User management
- System configuration

### FCDO SRO
- ToR approval authority
- Full programme visibility
- Safeguarding incident access
- Financial oversight

### Country Focal Point
- Country-specific data entry
- Results reporting
- Evidence upload
- Issue raising

### Implementer
- ToR creation
- Assignment management
- LoE tracking
- Deliverable submission

### Evaluator
- Read-only access to results and evidence
- Export capabilities
- No data modification rights

## Development

### Running Tests (Future)
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd backend
NODE_ENV=production npm start
```

## Deployment Considerations

### Environment Variables
Configure the following in production:
- `NODE_ENV=production`
- `JWT_SECRET` - Strong secret key
- `DB_*` - Production database credentials
- `PORT` - Server port (default 5000)

### Database
- Enable SSL for PostgreSQL connections
- Configure connection pooling
- Set up regular backups
- Enable audit logging

### Security
- Use HTTPS in production
- Configure CORS for specific origins
- Implement rate limiting
- Enable security headers
- Set up monitoring and alerting

## Support & Maintenance

### Common Issues

**Database connection fails**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

**Frontend won't start**
- Check Node version (18+)
- Clear `node_modules` and reinstall
- Check for port conflicts

**Authentication errors**
- Verify JWT_SECRET is set
- Check token expiration settings
- Clear browser localStorage

## Contributing

This is a demonstration project. For production use, implement:
- Comprehensive test coverage
- CI/CD pipeline
- Enhanced security measures
- Performance optimization
- Monitoring and logging
- Backup and disaster recovery

## License

This project is for demonstration purposes. Contact the development team for licensing information.

## Acknowledgments

Built for the ASEAN-UK SAGE Programme to support education outcomes across Southeast Asia.

