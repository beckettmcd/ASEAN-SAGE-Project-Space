import express from 'express';
import { createGenericController } from '../controllers/genericController.js';
import { 
  Country, 
  Programme, 
  Workstream, 
  Consultant, 
  Organisation,
  Supplier,
  Budget,
  Commitment,
  Invoice,
  LoEEntry,
  Deliverable,
  Issue,
  SafeguardingIncident,
  Decision,
  Lesson,
  Result,
  Assignment,
  User,
  Indicator
} from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Countries
const countryController = createGenericController(Country, {
  allowedFilters: ['region', 'isActive'],
  orderBy: [['name', 'ASC']]
});

router.get('/countries', authenticate, countryController.getAll);
router.get('/countries/:id', authenticate, countryController.getById);
router.post('/countries', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.FCDO_SRO), countryController.create);
router.put('/countries/:id', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.FCDO_SRO), countryController.update);
router.delete('/countries/:id', authenticate, authorize(USER_ROLES.ADMIN), countryController.remove);

// Programmes
const programmeController = createGenericController(Programme, {
  include: [{ model: Country, as: 'country' }],
  allowedFilters: ['countryId', 'ragStatus', 'isActive'],
  orderBy: [['startDate', 'DESC']]
});

router.get('/programmes', authenticate, programmeController.getAll);
router.get('/programmes/:id', authenticate, programmeController.getById);
router.post('/programmes', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.FCDO_SRO), programmeController.create);
router.put('/programmes/:id', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.FCDO_SRO), programmeController.update);
router.delete('/programmes/:id', authenticate, authorize(USER_ROLES.ADMIN), programmeController.remove);

// Workstreams
const workstreamController = createGenericController(Workstream, {
  include: [{ model: Programme, as: 'programme' }],
  allowedFilters: ['programmeId', 'pillar'],
  orderBy: [['name', 'ASC']]
});

router.get('/workstreams', authenticate, workstreamController.getAll);
router.get('/workstreams/:id', authenticate, workstreamController.getById);
router.post('/workstreams', authenticate, workstreamController.create);
router.put('/workstreams/:id', authenticate, workstreamController.update);
router.delete('/workstreams/:id', authenticate, authorize(USER_ROLES.ADMIN), workstreamController.remove);

// Consultants
const consultantController = createGenericController(Consultant, {
  allowedFilters: ['nationality', 'isActive'],
  orderBy: [['lastName', 'ASC'], ['firstName', 'ASC']]
});

router.get('/consultants', authenticate, consultantController.getAll);
router.get('/consultants/:id', authenticate, consultantController.getById);
router.post('/consultants', authenticate, consultantController.create);
router.put('/consultants/:id', authenticate, consultantController.update);
router.delete('/consultants/:id', authenticate, authorize(USER_ROLES.ADMIN), consultantController.remove);

// Organisations
const organisationController = createGenericController(Organisation, {
  allowedFilters: ['type', 'country', 'isActive'],
  orderBy: [['name', 'ASC']]
});

router.get('/organisations', authenticate, organisationController.getAll);
router.get('/organisations/:id', authenticate, organisationController.getById);
router.post('/organisations', authenticate, organisationController.create);
router.put('/organisations/:id', authenticate, organisationController.update);
router.delete('/organisations/:id', authenticate, authorize(USER_ROLES.ADMIN), organisationController.remove);

// Suppliers
const supplierController = createGenericController(Supplier, {
  allowedFilters: ['type', 'country', 'isActive'],
  orderBy: [['name', 'ASC']]
});

router.get('/suppliers', authenticate, supplierController.getAll);
router.get('/suppliers/:id', authenticate, supplierController.getById);
router.post('/suppliers', authenticate, supplierController.create);
router.put('/suppliers/:id', authenticate, supplierController.update);
router.delete('/suppliers/:id', authenticate, authorize(USER_ROLES.ADMIN), supplierController.remove);

// Commitments
const commitmentController = createGenericController(Commitment, {
  include: [
    { model: Budget, as: 'budget' },
    { model: Supplier, as: 'supplier' }
  ],
  allowedFilters: ['status', 'budgetId', 'supplierId'],
  orderBy: [['commitmentDate', 'DESC']]
});

router.get('/commitments', authenticate, commitmentController.getAll);
router.get('/commitments/:id', authenticate, commitmentController.getById);
router.post('/commitments', authenticate, commitmentController.create);
router.put('/commitments/:id', authenticate, commitmentController.update);
router.delete('/commitments/:id', authenticate, authorize(USER_ROLES.ADMIN), commitmentController.remove);

// Invoices
const invoiceController = createGenericController(Invoice, {
  include: [
    { model: Commitment, as: 'commitment' },
    { model: Supplier, as: 'supplier' }
  ],
  allowedFilters: ['status', 'supplierId'],
  orderBy: [['invoiceDate', 'DESC']]
});

router.get('/invoices', authenticate, invoiceController.getAll);
router.get('/invoices/:id', authenticate, invoiceController.getById);
router.post('/invoices', authenticate, invoiceController.create);
router.put('/invoices/:id', authenticate, invoiceController.update);
router.delete('/invoices/:id', authenticate, authorize(USER_ROLES.ADMIN), invoiceController.remove);

// LoE Entries
const loeController = createGenericController(LoEEntry, {
  include: [{ model: Assignment, as: 'assignment' }],
  allowedFilters: ['assignmentId'],
  orderBy: [['entryDate', 'DESC']]
});

router.get('/loe-entries', authenticate, loeController.getAll);
router.get('/loe-entries/:id', authenticate, loeController.getById);
router.post('/loe-entries', authenticate, loeController.create);
router.put('/loe-entries/:id', authenticate, loeController.update);
router.delete('/loe-entries/:id', authenticate, loeController.remove);

// Deliverables
const deliverableController = createGenericController(Deliverable, {
  include: [{ model: Assignment, as: 'assignment' }],
  allowedFilters: ['status', 'assignmentId'],
  orderBy: [['dueDate', 'DESC']]
});

router.get('/deliverables', authenticate, deliverableController.getAll);
router.get('/deliverables/:id', authenticate, deliverableController.getById);
router.post('/deliverables', authenticate, deliverableController.create);
router.put('/deliverables/:id', authenticate, deliverableController.update);
router.delete('/deliverables/:id', authenticate, deliverableController.remove);

// Issues
const issueController = createGenericController(Issue, {
  include: [
    { model: Programme, as: 'programme' },
    { model: Workstream, as: 'workstream' }
  ],
  allowedFilters: ['status', 'priority', 'programmeId', 'workstreamId'],
  orderBy: [['raisedDate', 'DESC']]
});

router.get('/issues', authenticate, issueController.getAll);
router.get('/issues/:id', authenticate, issueController.getById);
router.post('/issues', authenticate, issueController.create);
router.put('/issues/:id', authenticate, issueController.update);
router.delete('/issues/:id', authenticate, issueController.remove);

// Safeguarding Incidents (restricted access)
const safeguardingController = createGenericController(SafeguardingIncident, {
  include: [
    { model: Programme, as: 'programme' },
    { model: Country, as: 'country' }
  ],
  allowedFilters: ['status', 'severity', 'programmeId'],
  orderBy: [['incidentDate', 'DESC']]
});

router.get('/safeguarding', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.FCDO_SRO), safeguardingController.getAll);
router.get('/safeguarding/:id', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.FCDO_SRO), safeguardingController.getById);
router.post('/safeguarding', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.FCDO_SRO), safeguardingController.create);
router.put('/safeguarding/:id', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.FCDO_SRO), safeguardingController.update);
router.delete('/safeguarding/:id', authenticate, authorize(USER_ROLES.ADMIN), safeguardingController.remove);

// Decisions
const decisionController = createGenericController(Decision, {
  include: [{ model: Programme, as: 'programme' }],
  allowedFilters: ['programmeId'],
  orderBy: [['decisionDate', 'DESC']]
});

router.get('/decisions', authenticate, decisionController.getAll);
router.get('/decisions/:id', authenticate, decisionController.getById);
router.post('/decisions', authenticate, decisionController.create);
router.put('/decisions/:id', authenticate, decisionController.update);
router.delete('/decisions/:id', authenticate, authorize(USER_ROLES.ADMIN), decisionController.remove);

// Lessons
const lessonController = createGenericController(Lesson, {
  include: [
    { model: Programme, as: 'programme' },
    { model: Workstream, as: 'workstream' }
  ],
  allowedFilters: ['category', 'programmeId', 'workstreamId'],
  orderBy: [['dateRecorded', 'DESC']]
});

router.get('/lessons', authenticate, lessonController.getAll);
router.get('/lessons/:id', authenticate, lessonController.getById);
router.post('/lessons', authenticate, lessonController.create);
router.put('/lessons/:id', authenticate, lessonController.update);
router.delete('/lessons/:id', authenticate, lessonController.remove);

// Results
const resultController = createGenericController(Result, {
  include: [
    { model: Indicator, as: 'indicator' },
    { model: Country, as: 'country' }
  ],
  allowedFilters: ['indicatorId', 'countryId'],
  orderBy: [['reportingDate', 'DESC']]
});

router.get('/results', authenticate, resultController.getAll);
router.get('/results/:id', authenticate, resultController.getById);
router.post('/results', authenticate, resultController.create);
router.put('/results/:id', authenticate, resultController.update);
router.delete('/results/:id', authenticate, resultController.remove);

export default router;

