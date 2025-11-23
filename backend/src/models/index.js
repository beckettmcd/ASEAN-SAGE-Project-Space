import sequelize from '../config/database.js';

// Import all models
import User from './User.js';
import Organisation from './Organisation.js';
import Country from './Country.js';
import Programme from './Programme.js';
import Workstream from './Workstream.js';
import ToR from './ToR.js';
import Consultant from './Consultant.js';
import Assignment from './Assignment.js';
import LoEEntry from './LoEEntry.js';
import Budget from './Budget.js';
import Commitment from './Commitment.js';
import Invoice from './Invoice.js';
import Supplier from './Supplier.js';
import Indicator from './Indicator.js';
import Result from './Result.js';
import Deliverable from './Deliverable.js';
import Evidence from './Evidence.js';
import Risk from './Risk.js';
import Issue from './Issue.js';
import SafeguardingIncident from './SafeguardingIncident.js';
import Decision from './Decision.js';
import Lesson from './Lesson.js';
import Expense from './Expense.js';
import Fee from './Fee.js';
import DonorOrganisation from './DonorOrganisation.js';
import DonorProject from './DonorProject.js';

// Define relationships

// User relationships
User.belongsTo(Organisation, { foreignKey: 'organisationId', as: 'organisation' });
Organisation.hasMany(User, { foreignKey: 'organisationId', as: 'users' });

// Programme relationships
Programme.hasMany(Workstream, { foreignKey: 'programmeId', as: 'workstreams' });
Workstream.belongsTo(Programme, { foreignKey: 'programmeId', as: 'programme' });

Programme.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
Country.hasMany(Programme, { foreignKey: 'countryId', as: 'programmes' });

// ToR relationships
ToR.belongsTo(Workstream, { foreignKey: 'workstreamId', as: 'workstream' });
Workstream.hasMany(ToR, { foreignKey: 'workstreamId', as: 'tors' });

ToR.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
Country.hasMany(ToR, { foreignKey: 'countryId', as: 'tors' });

ToR.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
ToR.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

// Assignment relationships
Assignment.belongsTo(ToR, { foreignKey: 'torId', as: 'tor' });
ToR.hasMany(Assignment, { foreignKey: 'torId', as: 'assignments' });

Assignment.belongsTo(Consultant, { foreignKey: 'consultantId', as: 'consultant' });
Consultant.hasMany(Assignment, { foreignKey: 'consultantId', as: 'assignments' });

Assignment.belongsTo(Workstream, { foreignKey: 'workstreamId', as: 'workstream' });
Workstream.hasMany(Assignment, { foreignKey: 'workstreamId', as: 'assignments' });

Assignment.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
Country.hasMany(Assignment, { foreignKey: 'countryId', as: 'assignments' });

// LoE Entry relationships
LoEEntry.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
Assignment.hasMany(LoEEntry, { foreignKey: 'assignmentId', as: 'loeEntries' });

LoEEntry.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

// Expense relationships
Expense.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
Assignment.hasMany(Expense, { foreignKey: 'assignmentId', as: 'expenses' });

// Fee relationships
Fee.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
Assignment.hasMany(Fee, { foreignKey: 'assignmentId', as: 'fees' });

// Budget relationships
Budget.belongsTo(Workstream, { foreignKey: 'workstreamId', as: 'workstream' });
Workstream.hasMany(Budget, { foreignKey: 'workstreamId', as: 'budgets' });

Budget.belongsTo(Programme, { foreignKey: 'programmeId', as: 'programme' });
Programme.hasMany(Budget, { foreignKey: 'programmeId', as: 'budgets' });

// Commitment relationships
Commitment.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });
Budget.hasMany(Commitment, { foreignKey: 'budgetId', as: 'commitments' });

Commitment.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
Assignment.hasMany(Commitment, { foreignKey: 'assignmentId', as: 'commitments' });

Commitment.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
Supplier.hasMany(Commitment, { foreignKey: 'supplierId', as: 'commitments' });

// Invoice relationships
Invoice.belongsTo(Commitment, { foreignKey: 'commitmentId', as: 'commitment' });
Commitment.hasMany(Invoice, { foreignKey: 'commitmentId', as: 'invoices' });

Invoice.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
Assignment.hasMany(Invoice, { foreignKey: 'assignmentId', as: 'invoices' });

Invoice.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
Supplier.hasMany(Invoice, { foreignKey: 'supplierId', as: 'invoices' });

Invoice.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

// Indicator relationships
Indicator.belongsTo(Workstream, { foreignKey: 'workstreamId', as: 'workstream' });
Workstream.hasMany(Indicator, { foreignKey: 'workstreamId', as: 'indicators' });

Indicator.belongsTo(Programme, { foreignKey: 'programmeId', as: 'programme' });
Programme.hasMany(Indicator, { foreignKey: 'programmeId', as: 'indicators' });

Indicator.belongsTo(Indicator, { foreignKey: 'parentIndicatorId', as: 'parentIndicator' });
Indicator.hasMany(Indicator, { foreignKey: 'parentIndicatorId', as: 'childIndicators' });

// Result relationships
Result.belongsTo(Indicator, { foreignKey: 'indicatorId', as: 'indicator' });
Indicator.hasMany(Result, { foreignKey: 'indicatorId', as: 'results' });

Result.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
Country.hasMany(Result, { foreignKey: 'countryId', as: 'results' });

Result.belongsTo(User, { foreignKey: 'reportedBy', as: 'reporter' });

// Deliverable relationships
Deliverable.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
Assignment.hasMany(Deliverable, { foreignKey: 'assignmentId', as: 'deliverables' });

// Evidence relationships
Evidence.belongsTo(Deliverable, { foreignKey: 'deliverableId', as: 'deliverable' });
Deliverable.hasMany(Evidence, { foreignKey: 'deliverableId', as: 'evidence' });

// Many-to-many: Evidence can link to multiple Indicators
Evidence.belongsToMany(Indicator, { through: 'EvidenceIndicators', as: 'indicators' });
Indicator.belongsToMany(Evidence, { through: 'EvidenceIndicators', as: 'evidence' });

Evidence.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
Country.hasMany(Evidence, { foreignKey: 'countryId', as: 'evidence' });

// Risk relationships
Risk.belongsTo(Programme, { foreignKey: 'programmeId', as: 'programme' });
Programme.hasMany(Risk, { foreignKey: 'programmeId', as: 'risks' });

Risk.belongsTo(Workstream, { foreignKey: 'workstreamId', as: 'workstream' });
Workstream.hasMany(Risk, { foreignKey: 'workstreamId', as: 'risks' });

Risk.belongsTo(User, { foreignKey: 'mitigationOwner', as: 'owner' });
Risk.belongsTo(User, { foreignKey: 'raisedBy', as: 'raiser' });

// Issue relationships
Issue.belongsTo(Programme, { foreignKey: 'programmeId', as: 'programme' });
Programme.hasMany(Issue, { foreignKey: 'programmeId', as: 'issues' });

Issue.belongsTo(Workstream, { foreignKey: 'workstreamId', as: 'workstream' });
Workstream.hasMany(Issue, { foreignKey: 'workstreamId', as: 'issues' });

Issue.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
Issue.belongsTo(User, { foreignKey: 'raisedBy', as: 'raiser' });

// Safeguarding Incident relationships
SafeguardingIncident.belongsTo(Programme, { foreignKey: 'programmeId', as: 'programme' });
Programme.hasMany(SafeguardingIncident, { foreignKey: 'programmeId', as: 'safeguardingIncidents' });

SafeguardingIncident.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
Country.hasMany(SafeguardingIncident, { foreignKey: 'countryId', as: 'safeguardingIncidents' });

SafeguardingIncident.belongsTo(User, { foreignKey: 'caseOwner', as: 'owner' });
SafeguardingIncident.belongsTo(User, { foreignKey: 'reportedBy', as: 'reporter' });

// Decision relationships
Decision.belongsTo(Programme, { foreignKey: 'programmeId', as: 'programme' });
Programme.hasMany(Decision, { foreignKey: 'programmeId', as: 'decisions' });

Decision.belongsTo(User, { foreignKey: 'decisionMaker', as: 'maker' });

// Lesson relationships
Lesson.belongsTo(Programme, { foreignKey: 'programmeId', as: 'programme' });
Programme.hasMany(Lesson, { foreignKey: 'programmeId', as: 'lessons' });

Lesson.belongsTo(Workstream, { foreignKey: 'workstreamId', as: 'workstream' });
Workstream.hasMany(Lesson, { foreignKey: 'workstreamId', as: 'lessons' });

Lesson.belongsTo(User, { foreignKey: 'recordedBy', as: 'recorder' });

// Donor Organisation relationships
DonorOrganisation.hasMany(DonorProject, { foreignKey: 'donorOrganisationId', as: 'projects' });
DonorProject.belongsTo(DonorOrganisation, { foreignKey: 'donorOrganisationId', as: 'donorOrganisation' });

// Donor Project relationships
DonorProject.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
Country.hasMany(DonorProject, { foreignKey: 'countryId', as: 'donorProjects' });

// Many-to-many: DonorProject can operate in multiple countries
DonorProject.belongsToMany(Country, { through: 'DonorProjectCountries', as: 'countries' });
Country.belongsToMany(DonorProject, { through: 'DonorProjectCountries', as: 'donorProjectsList' });

// Export all models and sequelize
export {
  sequelize,
  User,
  Organisation,
  Country,
  Programme,
  Workstream,
  ToR,
  Consultant,
  Assignment,
  LoEEntry,
  Budget,
  Commitment,
  Invoice,
  Supplier,
  Indicator,
  Result,
  Deliverable,
  Evidence,
  Risk,
  Issue,
  SafeguardingIncident,
  Decision,
  Lesson,
  Expense,
  Fee,
  DonorOrganisation,
  DonorProject
};

