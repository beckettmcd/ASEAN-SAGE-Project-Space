import { sequelize, User, Organisation, Country, Programme, Workstream, ToR, Consultant, Assignment, Budget, Indicator, Result, Evidence, Risk, Issue, SafeguardingIncident, Commitment, Supplier, Invoice, LoEEntry, Deliverable, Decision, Lesson, Expense, Fee, DonorOrganisation, DonorProject } from '../models/index.js';
import { USER_ROLES, TOR_STATUS, ASSIGNMENT_STATUS, PILLARS, INDICATOR_TYPE } from '../config/constants.js';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Sync database (this will create tables)
    await sequelize.sync({ force: true });
    console.log('✓ Database synced');

    // Create Organisations
    const fcdo = await Organisation.create({
      name: 'UK Foreign, Commonwealth & Development Office',
      type: 'Donor',
      country: 'United Kingdom',
      contactPerson: 'John Smith',
      contactEmail: 'john.smith@fcdo.gov.uk'
    });

    const aseansec = await Organisation.create({
      name: 'ASEAN Secretariat',
      type: 'ASEAN Body',
      country: 'Indonesia',
      contactPerson: 'Maya Sutanto',
      contactEmail: 'maya@asean.org'
    });

    const implementer = await Organisation.create({
      name: 'DAI Global',
      type: 'Implementer',
      country: 'International',
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah.johnson@dai.com'
    });

    // Phase 2 Organizations
    const edtechPartner = await Organisation.create({
      name: 'Asia EdTech Collaborative',
      type: 'EdTech Partner',
      country: 'Singapore',
      contactPerson: 'David Tan',
      contactEmail: 'david.tan@asiaedtech.org'
    });

    const tvetInstitute = await Organisation.create({
      name: 'ASEAN Skills Development Network',
      type: 'TVET Institution',
      country: 'Malaysia',
      contactPerson: 'Fatimah Ibrahim',
      contactEmail: 'fatimah@asean-skills.org'
    });

    const girlsEducationNGO = await Organisation.create({
      name: 'Girls\' Learning Alliance Southeast Asia',
      type: 'NGO',
      country: 'Thailand',
      contactPerson: 'Nantana Srisawat',
      contactEmail: 'nantana@girlslearning-sea.org'
    });

    const climateCenterOrg = await Organisation.create({
      name: 'SEAMEO Regional Centre for STEM Education',
      type: 'Regional Body',
      country: 'Indonesia',
      contactPerson: 'Dr. Bambang Susilo',
      contactEmail: 'bambang@seameo-stem.org'
    });

    const privateSectorPartner = await Organisation.create({
      name: 'ASEAN Business Coalition for Education',
      type: 'Private Sector',
      country: 'International',
      contactPerson: 'Jennifer Wong',
      contactEmail: 'j.wong@abce.org'
    });

    const ecdNetwork = await Organisation.create({
      name: 'Early Childhood Asia Network',
      type: 'NGO',
      country: 'Philippines',
      contactPerson: 'Dr. Rosa Mercado',
      contactEmail: 'rosa@ecan.org'
    });

    console.log('✓ Organisations created');

    // Create Users
    const adminUser = await User.create({
      email: 'admin@sage.org',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: USER_ROLES.ADMIN,
      organisationId: implementer.id
    });

    const fcdoUser = await User.create({
      email: 'sro@fcdo.gov.uk',
      password: 'fcdo123',
      firstName: 'Rachel',
      lastName: 'Thompson',
      role: USER_ROLES.FCDO_SRO,
      organisationId: fcdo.id
    });

    const focalUser = await User.create({
      email: 'focal@edu.gov.th',
      password: 'focal123',
      firstName: 'Somchai',
      lastName: 'Rattana',
      role: USER_ROLES.COUNTRY_FOCAL,
      organisationId: aseansec.id
    });

    const implUser = await User.create({
      email: 'impl@dai.com',
      password: 'impl123',
      firstName: 'Maria',
      lastName: 'Santos',
      role: USER_ROLES.IMPLEMENTER,
      organisationId: implementer.id
    });

    console.log('✓ Users created');

    // Create Countries
    const thailand = await Country.create({ code: 'THA', name: 'Thailand', region: 'ASEAN' });
    const vietnam = await Country.create({ code: 'VNM', name: 'Vietnam', region: 'ASEAN' });
    const indonesia = await Country.create({ code: 'IDN', name: 'Indonesia', region: 'ASEAN' });
    const philippines = await Country.create({ code: 'PHL', name: 'Philippines', region: 'ASEAN' });
    const malaysia = await Country.create({ code: 'MYS', name: 'Malaysia', region: 'ASEAN' });
    const singapore = await Country.create({ code: 'SGP', name: 'Singapore', region: 'ASEAN' });
    const myanmar = await Country.create({ code: 'MMR', name: 'Myanmar', region: 'ASEAN' });
    const laos = await Country.create({ code: 'LAO', name: 'Laos', region: 'ASEAN' });
    const cambodia = await Country.create({ code: 'KHM', name: 'Cambodia', region: 'ASEAN' });
    const brunei = await Country.create({ code: 'BRN', name: 'Brunei', region: 'ASEAN' });
    const timorLeste = await Country.create({ code: 'TLS', name: 'Timor-Leste', region: 'ASEAN+' });

    console.log('✓ Countries created');

    // Create Programmes
    const sageProgramme = await Programme.create({
      code: 'SAGE-001',
      name: 'ASEAN-UK SAGE Programme',
      description: 'Southeast Asia Girls Education programme focusing on learning outcomes and equity',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2026-12-31'),
      totalBudget: 25000000,
      ragStatus: 'Green',
      countryId: null // Regional
    });

    const thaiProgramme = await Programme.create({
      code: 'SAGE-THA',
      name: 'SAGE Thailand Programme',
      description: 'Country-specific interventions in Thailand',
      startDate: new Date('2023-04-01'),
      endDate: new Date('2026-12-31'),
      totalBudget: 5000000,
      ragStatus: 'Amber',
      countryId: thailand.id
    });

    console.log('✓ Programmes created');

    // Create Workstreams
    const ws1 = await Workstream.create({
      code: 'WS1',
      name: 'Learning Assessment',
      pillar: PILLARS[0],
      description: 'Support for SEA-PLM and national learning assessments',
      budget: 6000000,
      ragStatus: 'Green',
      programmeId: sageProgramme.id
    });

    const ws2 = await Workstream.create({
      code: 'WS2',
      name: 'EMIS Development',
      pillar: PILLARS[1],
      description: 'Strengthening education management information systems',
      budget: 5000000,
      ragStatus: 'Green',
      programmeId: sageProgramme.id
    });

    const ws3 = await Workstream.create({
      code: 'WS3',
      name: 'OOSCY Interventions',
      pillar: PILLARS[2],
      description: 'Reaching out-of-school children and youth',
      budget: 7000000,
      ragStatus: 'Amber',
      programmeId: sageProgramme.id
    });

    const ws4 = await Workstream.create({
      code: 'WS4',
      name: 'Teacher Professional Development',
      pillar: PILLARS[3],
      description: 'Continuous professional development for teachers',
      budget: 4000000,
      ragStatus: 'Green',
      programmeId: sageProgramme.id
    });

    const ws5 = await Workstream.create({
      code: 'WS5',
      name: 'Inclusive Education',
      pillar: PILLARS[4],
      description: 'Support for children with disabilities and special needs',
      budget: 3000000,
      ragStatus: 'Amber',
      programmeId: sageProgramme.id
    });

    // Phase 2 Workstreams - New Cross-Cutting Themes
    const ws6 = await Workstream.create({
      code: 'WS6',
      name: 'Digital Learning & EdTech',
      pillar: PILLARS[5],
      description: 'Technology-enabled learning solutions, digital literacy, and teacher capacity for digital pedagogy',
      budget: 4500000,
      ragStatus: 'Green',
      programmeId: sageProgramme.id
    });

    const ws7 = await Workstream.create({
      code: 'WS7',
      name: 'Climate & Environmental Education',
      pillar: PILLARS[6],
      description: 'Climate literacy, green skills development, and sustainability integration in education systems',
      budget: 3200000,
      ragStatus: 'Green',
      programmeId: sageProgramme.id
    });

    const ws8 = await Workstream.create({
      code: 'WS8',
      name: 'Skills & TVET',
      pillar: PILLARS[7],
      description: 'Technical and vocational education, industry partnerships, and youth employability',
      budget: 5000000,
      ragStatus: 'Amber',
      programmeId: sageProgramme.id
    });

    const ws9 = await Workstream.create({
      code: 'WS9',
      name: 'Girls\' Education & Gender Equity',
      pillar: PILLARS[8],
      description: 'Gender-responsive interventions, safe schools, and barriers reduction for girls\' education',
      budget: 4200000,
      ragStatus: 'Green',
      programmeId: sageProgramme.id
    });

    const ws10 = await Workstream.create({
      code: 'WS10',
      name: 'Early Childhood Development',
      pillar: PILLARS[9],
      description: 'Pre-primary education strengthening, play-based learning, and foundational skills development',
      budget: 3800000,
      ragStatus: 'Amber',
      programmeId: sageProgramme.id
    });

    console.log('✓ Workstreams created');

    // Create Consultants
    const consultant1 = await Consultant.create({
      firstName: 'Dr. Anjali',
      lastName: 'Patel',
      email: 'anjali.patel@consultancy.com',
      phone: '+44 7700 900000',
      nationality: 'United Kingdom',
      expertise: ['Learning Assessment', 'Curriculum Development', 'Teacher Training'],
      dayRate: 850
    });

    const consultant2 = await Consultant.create({
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@eduexperts.com',
      phone: '+65 9000 0000',
      nationality: 'Singapore',
      expertise: ['EMIS', 'Data Systems', 'M&E'],
      dayRate: 750
    });

    const consultant3 = await Consultant.create({
      firstName: 'Sofia',
      lastName: 'Rodriguez',
      email: 'sofia.rodriguez@global-edu.org',
      phone: '+34 600 000 000',
      nationality: 'Spain',
      expertise: ['OOSCY', 'Community Engagement', 'Gender Equity'],
      dayRate: 700
    });

    // Phase 2 Consultants - Digital Learning & EdTech
    const consultant4 = await Consultant.create({
      firstName: 'Raj',
      lastName: 'Krishnan',
      email: 'raj.krishnan@edtechglobal.com',
      phone: '+91 98765 43210',
      nationality: 'India',
      expertise: ['EdTech', 'Digital Learning Platforms', 'Teacher Digital Literacy'],
      dayRate: 800
    });

    const consultant5 = await Consultant.create({
      firstName: 'Li',
      lastName: 'Wei',
      email: 'li.wei@digitallearning.cn',
      phone: '+86 138 0000 1234',
      nationality: 'China',
      expertise: ['E-Learning Design', 'Mobile Learning', 'Offline-First Technology'],
      dayRate: 750
    });

    // Climate & Environmental Education
    const consultant6 = await Consultant.create({
      firstName: 'Dr. Amara',
      lastName: 'Okafor',
      email: 'amara.okafor@greenedu.org',
      phone: '+234 803 000 0000',
      nationality: 'Nigeria',
      expertise: ['Climate Education', 'Environmental Curriculum', 'Sustainability'],
      dayRate: 850
    });

    const consultant7 = await Consultant.create({
      firstName: 'Johan',
      lastName: 'Andersson',
      email: 'johan.andersson@climateed.se',
      phone: '+46 70 123 4567',
      nationality: 'Sweden',
      expertise: ['Green Skills', 'Climate Adaptation', 'UNESCO ESD Framework'],
      dayRate: 900
    });

    // Skills & TVET
    const consultant8 = await Consultant.create({
      firstName: 'Fatima',
      lastName: 'Al-Rahman',
      email: 'fatima.alrahman@tvetexperts.org',
      phone: '+971 50 123 4567',
      nationality: 'UAE',
      expertise: ['TVET Systems', 'Industry Partnerships', 'Apprenticeship Models'],
      dayRate: 820
    });

    const consultant9 = await Consultant.create({
      firstName: 'Carlos',
      lastName: 'Mendoza',
      email: 'carlos.mendoza@skillsdev.com',
      phone: '+52 55 1234 5678',
      nationality: 'Mexico',
      expertise: ['Youth Employment', 'Soft Skills Training', 'Entrepreneurship Education'],
      dayRate: 780
    });

    // Girls' Education & Gender Equity
    const consultant10 = await Consultant.create({
      firstName: 'Dr. Aisha',
      lastName: 'Hassan',
      email: 'aisha.hassan@genderedu.org',
      phone: '+254 722 000 000',
      nationality: 'Kenya',
      expertise: ['Girls\' Education', 'Gender-Responsive Pedagogy', 'Safe Schools'],
      dayRate: 880
    });

    const consultant11 = await Consultant.create({
      firstName: 'Maya',
      lastName: 'Sharma',
      email: 'maya.sharma@girlslearning.in',
      phone: '+91 98000 12345',
      nationality: 'India',
      expertise: ['Gender Equity', 'Female Leadership', 'Community Mobilization'],
      dayRate: 760
    });

    // Early Childhood Development
    const consultant12 = await Consultant.create({
      firstName: 'Dr. Emma',
      lastName: 'Thompson',
      email: 'emma.thompson@ecdglobal.org',
      phone: '+44 7800 123456',
      nationality: 'United Kingdom',
      expertise: ['Early Childhood Development', 'Play-Based Learning', 'Pre-Primary Curriculum'],
      dayRate: 920
    });

    const consultant13 = await Consultant.create({
      firstName: 'Nguyen',
      lastName: 'Thi Mai',
      email: 'nguyen.mai@ecdasia.org',
      phone: '+84 90 123 4567',
      nationality: 'Vietnam',
      expertise: ['ECD', 'Parental Engagement', 'Foundational Literacy'],
      dayRate: 720
    });

    console.log('✓ Consultants created');

    // Create ToRs
    const tor1 = await ToR.create({
      referenceNumber: 'TOR-2024-001',
      title: 'SEA-PLM Technical Advisory Support',
      description: 'Provide technical support for SEA-PLM implementation across ASEAN member states',
      objectives: 'Support ministries in preparing for and implementing SEA-PLM assessments',
      deliverables: 'Training materials, technical guidance notes, implementation reports',
      qualifications: 'PhD in Education or related field, 10+ years experience in large-scale assessments',
      estimatedLoE: 45,
      dailyRate: 850,
      estimatedBudget: 38250,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws1.id,
      countryId: null,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-01-15')
    });

    const tor2 = await ToR.create({
      referenceNumber: 'TOR-2024-002',
      title: 'EMIS Database Design Consultant',
      description: 'Design and implement EMIS database structure for Thailand',
      objectives: 'Create comprehensive EMIS architecture and migration plan',
      deliverables: 'Database schema, data dictionary, migration plan, training',
      qualifications: 'Database architecture experience, education sector knowledge',
      estimatedLoE: 30,
      dailyRate: 750,
      estimatedBudget: 22500,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws2.id,
      countryId: thailand.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-02-10')
    });

    const tor3 = await ToR.create({
      referenceNumber: 'TOR-2024-003',
      title: 'OOSCY Community Mobilisation Specialist',
      description: 'Lead community engagement for OOSCY identification and enrollment',
      objectives: 'Develop and implement community mobilization strategy',
      deliverables: 'Mobilization strategy, training materials, monitoring reports',
      qualifications: 'Community development experience, fluency in Vietnamese',
      estimatedLoE: 60,
      dailyRate: 700,
      estimatedBudget: 42000,
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-10-31'),
      status: TOR_STATUS.PENDING_APPROVAL,
      workstreamId: ws3.id,
      countryId: vietnam.id,
      createdBy: implUser.id
    });

    console.log('✓ ToRs created');

    // Create Assignments
    const assign1 = await Assignment.create({
      referenceNumber: 'ASN-2024-001',
      title: 'SEA-PLM Technical Advisory',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-30'),
      contractedLoE: 45,
      actualLoE: 28.5,
      dailyRate: 850,
      totalValue: 38250,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-02-28'),
      location: 'Jakarta, Indonesia',
      torId: tor1.id,
      consultantId: consultant1.id,
      workstreamId: ws1.id,
      countryId: indonesia.id,
      counterpartOrganisation: 'SEAMEO Secretariat',
      counterpartContact: 'Dr. Sita Nurhayati',
      counterpartType: 'Regional Body',
      counterpartEmail: 'sita.nurhayati@seameo.org'
    });

    const assign2 = await Assignment.create({
      referenceNumber: 'ASN-2024-002',
      title: 'EMIS Database Design',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-06-30'),
      contractedLoE: 30,
      actualLoE: 18,
      dailyRate: 750,
      totalValue: 22500,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-03-28'),
      location: 'Bangkok, Thailand',
      torId: tor2.id,
      consultantId: consultant2.id,
      workstreamId: ws2.id,
      countryId: thailand.id,
      counterpartOrganisation: 'Ministry of Education, Thailand',
      counterpartContact: 'Khun Siriwan Yodsombat',
      counterpartType: 'Government',
      counterpartEmail: 'siriwan.y@moe.go.th'
    });

    // Create additional assignments for richer demo
    const assign3 = await Assignment.create({
      referenceNumber: 'ASN-2024-003',
      title: 'OOSCY Community Mobilisation',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-10-31'),
      contractedLoE: 60,
      actualLoE: 22,
      dailyRate: 700,
      totalValue: 42000,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-04-25'),
      location: 'Hanoi, Vietnam',
      torId: tor3.id,
      consultantId: consultant3.id,
      workstreamId: ws3.id,
      countryId: vietnam.id,
      counterpartOrganisation: 'Ministry of Education and Training, Vietnam',
      counterpartContact: 'Ms. Nguyen Thi Lan',
      counterpartType: 'Government',
      counterpartEmail: 'ntlan@moet.edu.vn'
    });

    const assign4 = await Assignment.create({
      referenceNumber: 'ASN-2024-004',
      title: 'Teacher Training Programme Development',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-31'),
      contractedLoE: 55,
      actualLoE: 15,
      dailyRate: 800,
      totalValue: 44000,
      status: ASSIGNMENT_STATUS.MOBILISING,
      mobilisationDate: new Date('2024-05-28'),
      location: 'Manila, Philippines',
      consultantId: consultant1.id,
      workstreamId: ws4.id,
      countryId: philippines.id,
      counterpartOrganisation: 'Department of Education, Philippines',
      counterpartContact: 'Dr. Maria Santos',
      counterpartType: 'Government',
      counterpartEmail: 'maria.santos@deped.gov.ph'
    });

    const assign5 = await Assignment.create({
      referenceNumber: 'ASN-2024-005',
      title: 'Inclusive Education Policy Review',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-11-30'),
      contractedLoE: 40,
      actualLoE: 0,
      dailyRate: 850,
      totalValue: 34000,
      status: ASSIGNMENT_STATUS.PLANNED,
      location: 'Kuala Lumpur, Malaysia',
      consultantId: consultant2.id,
      workstreamId: ws5.id,
      countryId: malaysia.id,
      counterpartOrganisation: 'Malaysian Education Partnership',
      counterpartContact: 'Dr. Aziz Rahman',
      counterpartType: 'Local NGO',
      counterpartEmail: 'aziz.rahman@mep.org.my'
    });

    const assign6 = await Assignment.create({
      referenceNumber: 'ASN-2024-006',
      title: 'Data Quality Assessment for EMIS',
      startDate: new Date('2024-05-15'),
      endDate: new Date('2024-09-15'),
      contractedLoE: 35,
      actualLoE: 20,
      dailyRate: 750,
      totalValue: 26250,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-05-10'),
      location: 'Hanoi, Vietnam',
      consultantId: consultant2.id,
      workstreamId: ws2.id,
      countryId: vietnam.id,
      counterpartOrganisation: 'Vietnam Education Foundation',
      counterpartContact: 'Mr. Tran Van Minh',
      counterpartType: 'Local NGO',
      counterpartEmail: 'tv.minh@vef.org.vn'
    });

    // Create Regional ASEAN Assignments (no countryId)
    const regionalAssign1 = await Assignment.create({
      referenceNumber: 'ASN-2024-REG-001',
      title: 'ASEAN Education Ministers Meeting Support',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-31'),
      contractedLoE: 80,
      actualLoE: 45,
      dailyRate: 900,
      totalValue: 72000,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-02-25'),
      counterpartOrganisation: 'ASEAN Secretariat',
      counterpartContact: 'Dr. Lim Siew Choo',
      counterpartType: 'ASEAN Body',
      counterpartEmail: 'lim.siew.choo@asean.org',
      workstreamId: ws1.id,
      consultantId: consultant1.id,
      torId: tor1.id
    });

    const regionalAssign2 = await Assignment.create({
      referenceNumber: 'ASN-2024-REG-002',
      title: 'Regional Teacher Exchange Programme',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-31'),
      contractedLoE: 60,
      actualLoE: 35,
      dailyRate: 800,
      totalValue: 48000,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-03-28'),
      counterpartOrganisation: 'SEAMEO Secretariat',
      counterpartContact: 'Dr. Ethel Agnes Valenzuela',
      counterpartType: 'Regional Body',
      counterpartEmail: 'e.valenzuela@seameo.org',
      workstreamId: ws2.id,
      consultantId: consultant2.id,
      torId: tor2.id
    });

    const regionalAssign3 = await Assignment.create({
      referenceNumber: 'ASN-2024-REG-003',
      title: 'ASEAN Digital Learning Platform Development',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-31'),
      contractedLoE: 70,
      actualLoE: 20,
      dailyRate: 850,
      totalValue: 59500,
      status: ASSIGNMENT_STATUS.MOBILISING,
      mobilisationDate: new Date('2024-05-25'),
      counterpartOrganisation: 'ASEAN Secretariat',
      counterpartContact: 'Mr. Ahmad Rizki',
      counterpartType: 'ASEAN Body',
      counterpartEmail: 'ahmad.rizki@asean.org',
      workstreamId: ws3.id,
      consultantId: consultant3.id,
      torId: tor3.id
    });

    console.log('✓ Assignments created (including regional)');

    // ============================================
    // PHASE 2: NEW CROSS-CUTTING INTERVENTIONS
    // ============================================
    
    // DIGITAL LEARNING & EDTECH INTERVENTIONS
    
    // 1. Philippines - Digital Learning Platform
    const tor_ph_digital1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-001',
      title: 'Offline-Capable Digital Learning Platform Development',
      description: 'Design and pilot offline-first learning platform for remote areas in Philippines',
      objectives: 'Theory of Change: Limited access to quality learning resources in remote areas → Offline-capable learning app with quality content → Teachers trained in digital pedagogy → Improved teaching practices and learning outcomes. Evidence base: Similar interventions in Kenya and Bangladesh showed 15-20% learning gains.',
      deliverables: 'Mobile learning app, teacher training materials, pilot evaluation report, scale-up strategy',
      qualifications: 'EdTech specialist with experience in offline-first solutions, minimum 5 years in education technology',
      estimatedLoE: 50,
      dailyRate: 800,
      estimatedBudget: 40000,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws6.id,
      countryId: philippines.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-06-01')
    });

    const assign_ph_digital1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-001',
      title: 'Digital Learning Platform Development - Philippines',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      contractedLoE: 50,
      actualLoE: 12,
      dailyRate: 800,
      totalValue: 40000,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-06-25'),
      location: 'Manila & Remote Areas, Philippines',
      torId: tor_ph_digital1.id,
      consultantId: consultant4.id,
      workstreamId: ws6.id,
      countryId: philippines.id,
      counterpartOrganisation: 'DepEd Philippines',
      counterpartContact: 'Dr. Antonio Cruz',
      counterpartType: 'Government',
      counterpartEmail: 'a.cruz@deped.gov.ph'
    });

    // 2. Vietnam - Teacher Digital Literacy
    const tor_vn_digital1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-002',
      title: 'Teacher Digital Literacy Training Programme',
      description: 'National-scale teacher training on digital tools and online pedagogy',
      objectives: 'Theory of Change: Low digital literacy among teachers → Comprehensive digital skills training → Enhanced capacity for technology integration → Improved student engagement through digital tools. Evidence: OECD studies show teacher digital competency correlates with improved student outcomes.',
      deliverables: 'Training curriculum, digital toolkit, 500 teachers trained, monitoring framework',
      qualifications: 'Digital learning specialist with teacher training experience',
      estimatedLoE: 40,
      dailyRate: 750,
      estimatedBudget: 30000,
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-03-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws6.id,
      countryId: vietnam.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-06-15')
    });

    const assign_vn_digital1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-002',
      title: 'Teacher Digital Literacy - Vietnam',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-03-31'),
      contractedLoE: 40,
      actualLoE: 18,
      dailyRate: 750,
      totalValue: 30000,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-07-28'),
      location: 'Hanoi, Vietnam',
      torId: tor_vn_digital1.id,
      consultantId: consultant5.id,
      workstreamId: ws6.id,
      countryId: vietnam.id,
      counterpartOrganisation: 'Ministry of Education Vietnam',
      counterpartContact: 'Dr. Pham Van Long',
      counterpartType: 'Government',
      counterpartEmail: 'pv.long@moet.gov.vn'
    });

    // 3. Thailand - EdTech Innovation Hub
    const tor_th_digital1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-003',
      title: 'EdTech Innovation Hub Establishment',
      description: 'Create national hub for EdTech testing and teacher professional development',
      objectives: 'Theory of Change: Fragmented EdTech adoption → Centralized innovation hub for testing and training → Evidence-based EdTech integration → Scaled proven solutions across education system.',
      deliverables: 'Hub operational plan, partnership framework, 10 EdTech solutions tested, recommendations report',
      qualifications: 'EdTech ecosystem development experience, innovation management',
      estimatedLoE: 35,
      dailyRate: 800,
      estimatedBudget: 28000,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-05-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws6.id,
      countryId: thailand.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-07-20')
    });

    const assign_th_digital1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-003',
      title: 'EdTech Innovation Hub - Thailand',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-05-31'),
      contractedLoE: 35,
      actualLoE: 8,
      dailyRate: 800,
      totalValue: 28000,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-08-25'),
      location: 'Bangkok, Thailand',
      torId: tor_th_digital1.id,
      consultantId: consultant4.id,
      workstreamId: ws6.id,
      countryId: thailand.id,
      counterpartOrganisation: 'Thailand Ministry of Education',
      counterpartContact: 'Dr. Somchai Wongprasert',
      counterpartType: 'Government',
      counterpartEmail: 's.wongprasert@moe.go.th'
    });

    // 4. Indonesia - Mobile Learning for Rural Areas
    const tor_id_digital1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-004',
      title: 'Mobile Learning Solutions for Remote Islands',
      description: 'Develop and deploy mobile-first learning content for Indonesia archipelago',
      objectives: 'Theory of Change: Geographic isolation limits access → Mobile-optimized content delivery → Improved access to quality materials → Reduced learning disparities between urban and remote areas.',
      deliverables: 'Mobile app with offline content, 200 schools piloted, impact evaluation, sustainability plan',
      qualifications: 'Mobile learning technology, experience in archipelagic contexts',
      estimatedLoE: 45,
      dailyRate: 800,
      estimatedBudget: 36000,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-08-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws6.id,
      countryId: indonesia.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-08-15')
    });

    const assign_id_digital1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-004',
      title: 'Mobile Learning - Indonesia',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-08-31'),
      contractedLoE: 45,
      actualLoE: 5,
      dailyRate: 800,
      totalValue: 36000,
      status: ASSIGNMENT_STATUS.MOBILISING,
      mobilisationDate: new Date('2024-09-25'),
      location: 'Jakarta & Eastern Islands, Indonesia',
      torId: tor_id_digital1.id,
      consultantId: consultant5.id,
      workstreamId: ws6.id,
      countryId: indonesia.id,
      counterpartOrganisation: 'Indonesia Ministry of Education',
      counterpartContact: 'Dr. Budi Santoso',
      counterpartType: 'Government',
      counterpartEmail: 'budi.santoso@kemdikbud.go.id'
    });

    // 5. Brunei - Digital Curriculum Development
    const tor_bn_digital1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-005',
      title: 'Digital Curriculum Framework Development',
      description: 'Develop national framework for digital skills integration across subjects',
      objectives: 'Theory of Change: Ad-hoc digital integration → Systematic digital curriculum framework → Structured digital skills development → Future-ready workforce.',
      deliverables: 'Digital curriculum framework, teacher guidance, pilot implementation, evaluation',
      qualifications: 'Curriculum development with digital competency frameworks',
      estimatedLoE: 25,
      dailyRate: 800,
      estimatedBudget: 20000,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-05-31'),
      status: TOR_STATUS.PENDING_APPROVAL,
      workstreamId: ws6.id,
      countryId: brunei.id,
      createdBy: implUser.id
    });

    // CLIMATE & ENVIRONMENTAL EDUCATION INTERVENTIONS

    // 6. Indonesia - Climate Curriculum Integration
    const tor_id_climate1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-006',
      title: 'Climate Change Curriculum Integration',
      description: 'Integrate climate education across national curriculum framework',
      objectives: 'Theory of Change: Lack of climate content in curriculum → Climate-literate teachers trained → Integrated climate lessons delivered → Students develop awareness and adaptive capacity. Evidence base: UNESCO ESD framework, successful Pacific Islands pilots.',
      deliverables: 'Climate curriculum modules, teacher training programme, learning materials, pilot evaluation',
      qualifications: 'Climate education curriculum development, minimum 5 years experience',
      estimatedLoE: 40,
      dailyRate: 850,
      estimatedBudget: 34000,
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-07-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws7.id,
      countryId: indonesia.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-06-20')
    });

    const assign_id_climate1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-006',
      title: 'Climate Curriculum Integration - Indonesia',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-07-31'),
      contractedLoE: 40,
      actualLoE: 15,
      dailyRate: 850,
      totalValue: 34000,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-07-25'),
      location: 'Jakarta, Indonesia',
      torId: tor_id_climate1.id,
      consultantId: consultant6.id,
      workstreamId: ws7.id,
      countryId: indonesia.id,
      counterpartOrganisation: 'National Curriculum Agency Indonesia',
      counterpartContact: 'Dr. Sri Mulyani',
      counterpartType: 'Government',
      counterpartEmail: 'sri.mulyani@kemdikbud.go.id'
    });

    // 7. Philippines - Disaster Risk Reduction Education
    const tor_ph_climate1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-007',
      title: 'School-Based Disaster Risk Reduction Programme',
      description: 'Climate adaptation and disaster preparedness for typhoon-prone regions',
      objectives: 'Theory of Change: High vulnerability to typhoons → DRR education and preparedness training → Enhanced school and community resilience → Reduced education disruption during disasters.',
      deliverables: 'DRR curriculum, school preparedness plans, 100 schools trained, emergency response protocols',
      qualifications: 'Disaster risk reduction in education, climate adaptation experience',
      estimatedLoE: 35,
      dailyRate: 850,
      estimatedBudget: 29750,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws7.id,
      countryId: philippines.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-07-10')
    });

    const assign_ph_climate1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-007',
      title: 'Disaster Risk Reduction - Philippines',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      contractedLoE: 35,
      actualLoE: 10,
      dailyRate: 850,
      totalValue: 29750,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-08-28'),
      location: 'Manila & Visayas Region, Philippines',
      torId: tor_ph_climate1.id,
      consultantId: consultant7.id,
      workstreamId: ws7.id,
      countryId: philippines.id,
      counterpartOrganisation: 'DepEd Disaster Risk Reduction Unit',
      counterpartContact: 'Ms. Maria Reyes',
      counterpartType: 'Government',
      counterpartEmail: 'm.reyes@deped.gov.ph'
    });

    // 8. Vietnam - Green Schools Initiative
    const tor_vn_climate1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-008',
      title: 'Green Schools and Sustainability Programme',
      description: 'Establish green schools network with environmental action projects',
      objectives: 'Theory of Change: Limited environmental awareness → Green schools program with student-led projects → Practical sustainability learning → Environmentally conscious citizens.',
      deliverables: 'Green schools framework, 50 schools certified, student project guidelines, impact report',
      qualifications: 'Environmental education, school sustainability programmes',
      estimatedLoE: 30,
      dailyRate: 850,
      estimatedBudget: 25500,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws7.id,
      countryId: vietnam.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-08-20')
    });

    const assign_vn_climate1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-008',
      title: 'Green Schools Initiative - Vietnam',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-06-30'),
      contractedLoE: 30,
      actualLoE: 4,
      dailyRate: 850,
      totalValue: 25500,
      status: ASSIGNMENT_STATUS.MOBILISING,
      mobilisationDate: new Date('2024-09-25'),
      location: 'Ho Chi Minh City & Mekong Delta, Vietnam',
      torId: tor_vn_climate1.id,
      consultantId: consultant6.id,
      workstreamId: ws7.id,
      countryId: vietnam.id,
      counterpartOrganisation: 'Vietnam Environmental Education Network',
      counterpartContact: 'Dr. Le Thanh Ha',
      counterpartType: 'Local NGO',
      counterpartEmail: 'lt.ha@veen.org.vn'
    });

    // 9. Malaysia - Climate Action Education
    const tor_my_climate1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-009',
      title: 'Youth Climate Action Leadership Programme',
      description: 'Train youth climate leaders and establish school climate clubs',
      objectives: 'Theory of Change: Youth disengagement from climate action → Leadership training and climate clubs → Youth-led initiatives → Multiplier effect in communities.',
      deliverables: 'Leadership curriculum, 200 youth trained, 40 climate clubs established, action projects',
      qualifications: 'Youth leadership development, climate action experience',
      estimatedLoE: 28,
      dailyRate: 900,
      estimatedBudget: 25200,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.PENDING_APPROVAL,
      workstreamId: ws7.id,
      countryId: malaysia.id,
      createdBy: implUser.id
    });

    // SKILLS & TVET INTERVENTIONS

    // 10. Thailand - Industry-Linked TVET Programme
    const tor_th_tvet1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-010',
      title: 'Industry Partnership for TVET Excellence',
      description: 'Establish industry-education partnerships for relevant skills training',
      objectives: 'Theory of Change: Skills mismatch between training and industry needs → Industry partnerships and co-designed curricula → Work-relevant skills development → Improved youth employability. Evidence: ILO studies show 40% higher employment rates with industry partnerships.',
      deliverables: 'Partnership framework, 15 industry partnerships, revised curricula, placement programme',
      qualifications: 'TVET systems strengthening, industry partnership development',
      estimatedLoE: 45,
      dailyRate: 820,
      estimatedBudget: 36900,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws8.id,
      countryId: thailand.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-05-15')
    });

    const assign_th_tvet1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-010',
      title: 'Industry-Linked TVET - Thailand',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      contractedLoE: 45,
      actualLoE: 20,
      dailyRate: 820,
      totalValue: 36900,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-06-25'),
      location: 'Bangkok & Industrial Zones, Thailand',
      torId: tor_th_tvet1.id,
      consultantId: consultant8.id,
      workstreamId: ws8.id,
      countryId: thailand.id,
      counterpartOrganisation: 'Thai TVET Commission',
      counterpartContact: 'Dr. Prasert Chaiwan',
      counterpartType: 'Government',
      counterpartEmail: 'prasert.c@tvet.go.th'
    });

    // 11. Vietnam - Digital Skills for Youth Employment
    const tor_vn_tvet1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-011',
      title: 'Digital Skills Training for Youth Employment',
      description: 'Market-driven digital skills training with job placement support',
      objectives: 'Theory of Change: Youth unemployment due to digital skills gap → Market-relevant digital training → Enhanced employability → Increased youth employment in digital economy.',
      deliverables: 'Digital skills curriculum, 500 youth trained, job placement partnerships, outcome tracking',
      qualifications: 'Digital skills training, youth employment programmes',
      estimatedLoE: 40,
      dailyRate: 780,
      estimatedBudget: 31200,
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-05-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws8.id,
      countryId: vietnam.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-06-20')
    });

    const assign_vn_tvet1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-011',
      title: 'Digital Skills Training - Vietnam',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-05-31'),
      contractedLoE: 40,
      actualLoE: 16,
      dailyRate: 780,
      totalValue: 31200,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-07-28'),
      location: 'Hanoi & Ho Chi Minh City, Vietnam',
      torId: tor_vn_tvet1.id,
      consultantId: consultant9.id,
      workstreamId: ws8.id,
      countryId: vietnam.id,
      counterpartOrganisation: 'Vietnam Chamber of Commerce',
      counterpartContact: 'Mr. Nguyen Van Tuan',
      counterpartType: 'Private Sector',
      counterpartEmail: 'nv.tuan@vcci.org.vn'
    });

    // 12. Indonesia - Entrepreneurship Education
    const tor_id_tvet1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-012',
      title: 'Youth Entrepreneurship and Business Skills Programme',
      description: 'Entrepreneurship training with incubation and mentorship support',
      objectives: 'Theory of Change: Limited entrepreneurship skills → Comprehensive training and mentorship → Youth-led enterprises → Job creation and economic empowerment.',
      deliverables: 'Entrepreneurship curriculum, 300 youth trained, 50 businesses incubated, mentor network',
      qualifications: 'Entrepreneurship education, business incubation experience',
      estimatedLoE: 38,
      dailyRate: 780,
      estimatedBudget: 29640,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws8.id,
      countryId: indonesia.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-07-15')
    });

    const assign_id_tvet1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-012',
      title: 'Entrepreneurship Education - Indonesia',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      contractedLoE: 38,
      actualLoE: 12,
      dailyRate: 780,
      totalValue: 29640,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-08-25'),
      location: 'Jakarta, Surabaya, Bandung, Indonesia',
      torId: tor_id_tvet1.id,
      consultantId: consultant9.id,
      workstreamId: ws8.id,
      countryId: indonesia.id,
      counterpartOrganisation: 'Indonesia Young Entrepreneurs Association',
      counterpartContact: 'Ms. Dewi Kusuma',
      counterpartType: 'Private Sector',
      counterpartEmail: 'dewi.k@iyea.or.id'
    });

    // 13. Philippines - Apprenticeship Programme
    const tor_ph_tvet1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-013',
      title: 'National Apprenticeship System Strengthening',
      description: 'Modernize apprenticeship system with quality standards and employer engagement',
      objectives: 'Theory of Change: Weak apprenticeship system → Strengthened standards and employer participation → Quality work-based learning → Skilled workforce.',
      deliverables: 'Apprenticeship standards, quality framework, 100 employers engaged, monitoring system',
      qualifications: 'Apprenticeship systems, work-based learning frameworks',
      estimatedLoE: 42,
      dailyRate: 820,
      estimatedBudget: 34440,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-08-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws8.id,
      countryId: philippines.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-08-10')
    });

    const assign_ph_tvet1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-013',
      title: 'Apprenticeship System - Philippines',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-08-31'),
      contractedLoE: 42,
      actualLoE: 6,
      dailyRate: 820,
      totalValue: 34440,
      status: ASSIGNMENT_STATUS.MOBILISING,
      mobilisationDate: new Date('2024-09-25'),
      location: 'Manila, Philippines',
      torId: tor_ph_tvet1.id,
      consultantId: consultant8.id,
      workstreamId: ws8.id,
      countryId: philippines.id,
      counterpartOrganisation: 'Technical Education and Skills Development Authority',
      counterpartContact: 'Director Rosa Valdez',
      counterpartType: 'Government',
      counterpartEmail: 'r.valdez@tesda.gov.ph'
    });

    // 14. Malaysia - Green Skills TVET
    const tor_my_tvet1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-014',
      title: 'Green Skills and Sustainable Industries Training',
      description: 'Develop green skills curriculum for emerging sustainable industries',
      objectives: 'Theory of Change: Growing green economy needs skilled workers → Green skills training programmes → Workforce ready for sustainable industries → Economic and environmental benefits.',
      deliverables: 'Green skills curriculum, 5 TVET institutions upgraded, 400 students trained, industry partnerships',
      qualifications: 'Green skills development, TVET curriculum design',
      estimatedLoE: 35,
      dailyRate: 820,
      estimatedBudget: 28700,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-07-31'),
      status: TOR_STATUS.PENDING_APPROVAL,
      workstreamId: ws8.id,
      countryId: malaysia.id,
      createdBy: implUser.id
    });

    // GIRLS' EDUCATION & GENDER EQUITY INTERVENTIONS

    // 15. Cambodia - Girls' Education Scholarship Programme
    const tor_kh_girls1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-015',
      title: 'Conditional Scholarship Programme for Girls\' Secondary Education',
      description: 'Scholarship and mentorship programme to reduce dropout rates for girls',
      objectives: 'Theory of Change: High dropout rates for girls in lower secondary (30% nationally) due to economic barriers → Conditional scholarships and mentorship → Reduced economic barriers → Increased enrollment and completion. Evidence base: Cash transfer programs showing 25% dropout reduction.',
      deliverables: '1000 scholarships awarded, mentorship programme, safe schools assessment, impact evaluation',
      qualifications: 'Girls\' education, cash transfer programmes, gender analysis',
      estimatedLoE: 50,
      dailyRate: 880,
      estimatedBudget: 44000,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-12-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws9.id,
      countryId: cambodia.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-05-20')
    });

    const assign_kh_girls1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-015',
      title: 'Girls\' Scholarship Programme - Cambodia',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-12-31'),
      contractedLoE: 50,
      actualLoE: 22,
      dailyRate: 880,
      totalValue: 44000,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-06-25'),
      location: 'Phnom Penh & Rural Provinces, Cambodia',
      torId: tor_kh_girls1.id,
      consultantId: consultant10.id,
      workstreamId: ws9.id,
      countryId: cambodia.id,
      counterpartOrganisation: 'Ministry of Education, Youth and Sport Cambodia',
      counterpartContact: 'Mrs. Sophea Chan',
      counterpartType: 'Government',
      counterpartEmail: 'sophea.chan@moeys.gov.kh'
    });

    // 16. Laos - Gender-Responsive Pedagogy Training
    const tor_la_girls1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-016',
      title: 'Gender-Responsive Teaching and Learning Materials',
      description: 'Develop gender-responsive pedagogy training and classroom materials',
      objectives: 'Theory of Change: Gender bias in teaching materials and practices → Gender-responsive pedagogy training → Inclusive classroom environment → Improved girls\' participation and learning outcomes.',
      deliverables: 'Gender audit of materials, revised teaching guides, 300 teachers trained, monitoring framework',
      qualifications: 'Gender in education, pedagogy development, curriculum review',
      estimatedLoE: 35,
      dailyRate: 880,
      estimatedBudget: 30800,
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-05-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws9.id,
      countryId: laos.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-06-15')
    });

    const assign_la_girls1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-016',
      title: 'Gender-Responsive Pedagogy - Laos',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-05-31'),
      contractedLoE: 35,
      actualLoE: 14,
      dailyRate: 880,
      totalValue: 30800,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-07-25'),
      location: 'Vientiane & Northern Provinces, Laos',
      torId: tor_la_girls1.id,
      consultantId: consultant11.id,
      workstreamId: ws9.id,
      countryId: laos.id,
      counterpartOrganisation: 'Ministry of Education and Sports, Laos',
      counterpartContact: 'Ms. Bouapha Xayavong',
      counterpartType: 'Government',
      counterpartEmail: 'bouapha.x@moes.gov.la'
    });

    // 17. Myanmar - Safe Schools for Girls
    const tor_mm_girls1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-017',
      title: 'Safe and Inclusive Schools Programme',
      description: 'Create safe learning environments with WASH facilities and safeguarding protocols',
      objectives: 'Theory of Change: Safety concerns limit girls\' school attendance → Safe schools infrastructure and protocols → Increased parental confidence and girls\' attendance → Improved learning continuity.',
      deliverables: 'Safe schools standards, 80 schools upgraded with WASH, safeguarding training, community engagement',
      qualifications: 'Safe schools programming, WASH in schools, conflict-sensitive contexts',
      estimatedLoE: 40,
      dailyRate: 880,
      estimatedBudget: 35200,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-08-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws9.id,
      countryId: myanmar.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-07-10')
    });

    const assign_mm_girls1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-017',
      title: 'Safe Schools Programme - Myanmar',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-08-31'),
      contractedLoE: 40,
      actualLoE: 8,
      dailyRate: 880,
      totalValue: 35200,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-08-25'),
      location: 'Yangon & Ethnic States, Myanmar',
      torId: tor_mm_girls1.id,
      consultantId: consultant10.id,
      workstreamId: ws9.id,
      countryId: myanmar.id,
      counterpartOrganisation: 'Education Partners Network Myanmar',
      counterpartContact: 'Dr. Thein Zaw',
      counterpartType: 'Local NGO',
      counterpartEmail: 'thein.zaw@epn-myanmar.org'
    });

    // 18. Cambodia - Female Teacher Recruitment
    const tor_kh_girls2 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-018',
      title: 'Female Teacher Recruitment and Retention Programme',
      description: 'Increase female teachers in rural areas through incentives and support',
      objectives: 'Theory of Change: Few female role models in rural schools → Targeted recruitment and retention incentives → More female teachers → Improved girls\' enrollment and role modeling.',
      deliverables: 'Recruitment strategy, 200 female teachers recruited, mentorship programme, retention analysis',
      qualifications: 'Teacher recruitment, gender equity in education, rural education',
      estimatedLoE: 32,
      dailyRate: 760,
      estimatedBudget: 24320,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.PENDING_APPROVAL,
      workstreamId: ws9.id,
      countryId: cambodia.id,
      createdBy: implUser.id
    });

    // EARLY CHILDHOOD DEVELOPMENT INTERVENTIONS

    // 19. Laos - Pre-Primary Teacher Training
    const tor_la_ecd1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-019',
      title: 'Pre-Primary Teacher Professional Development Programme',
      description: 'Comprehensive training for pre-primary teachers in play-based pedagogy',
      objectives: 'Theory of Change: Low quality pre-primary education → Teacher training in play-based learning → Improved early learning environments → Better school readiness. Evidence: Studies show quality ECD increases primary completion by 20%.',
      deliverables: 'Training curriculum, 250 teachers trained, classroom observation tools, quality standards',
      qualifications: 'Early childhood education, play-based learning, teacher training',
      estimatedLoE: 38,
      dailyRate: 920,
      estimatedBudget: 34960,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-05-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws10.id,
      countryId: laos.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-05-25')
    });

    const assign_la_ecd1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-019',
      title: 'Pre-Primary Teacher Training - Laos',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-05-31'),
      contractedLoE: 38,
      actualLoE: 18,
      dailyRate: 920,
      totalValue: 34960,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-06-25'),
      location: 'Vientiane, Laos',
      torId: tor_la_ecd1.id,
      consultantId: consultant12.id,
      workstreamId: ws10.id,
      countryId: laos.id,
      counterpartOrganisation: 'National University of Laos',
      counterpartContact: 'Dr. Sengdao Vongxay',
      counterpartType: 'Government',
      counterpartEmail: 'sengdao.v@nuol.edu.la'
    });

    // 20. Myanmar - Community-Based ECD Centres
    const tor_mm_ecd1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-020',
      title: 'Community-Based Early Childhood Development Centres',
      description: 'Establish community ECD centres in conflict-affected areas',
      objectives: 'Theory of Change: Limited ECD access in conflict areas → Community-based centers with local facilitators → Increased access to quality early learning → Improved development outcomes despite conflict.',
      deliverables: 'ECD center model, 40 centers established, facilitator training, parental engagement programme',
      qualifications: 'ECD in emergencies, community mobilization, conflict-sensitive programming',
      estimatedLoE: 45,
      dailyRate: 920,
      estimatedBudget: 41400,
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-07-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws10.id,
      countryId: myanmar.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-06-20')
    });

    const assign_mm_ecd1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-020',
      title: 'Community ECD Centres - Myanmar',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-07-31'),
      contractedLoE: 45,
      actualLoE: 16,
      dailyRate: 920,
      totalValue: 41400,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-07-25'),
      location: 'Shan & Kachin States, Myanmar',
      torId: tor_mm_ecd1.id,
      consultantId: consultant13.id,
      workstreamId: ws10.id,
      countryId: myanmar.id,
      counterpartOrganisation: 'Myanmar ECD Network',
      counterpartContact: 'Ms. Khin Mar Soe',
      counterpartType: 'Local NGO',
      counterpartEmail: 'khin.mar@mecdnet.org'
    });

    // 21. Brunei - ECD Quality Standards
    const tor_bn_ecd1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-021',
      title: 'National ECD Quality Standards Development',
      description: 'Develop and implement comprehensive ECD quality framework',
      objectives: 'Theory of Change: Variable ECD quality across providers → National quality standards and accreditation → Consistent quality improvement → Better development outcomes for all children.',
      deliverables: 'ECD quality standards, accreditation framework, quality improvement plans, monitoring tools',
      qualifications: 'ECD quality assurance, policy development, standards setting',
      estimatedLoE: 28,
      dailyRate: 920,
      estimatedBudget: 25760,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-04-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws10.id,
      countryId: brunei.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-07-15')
    });

    const assign_bn_ecd1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-021',
      title: 'ECD Quality Standards - Brunei',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-04-30'),
      contractedLoE: 28,
      actualLoE: 8,
      dailyRate: 920,
      totalValue: 25760,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-08-25'),
      location: 'Bandar Seri Begawan, Brunei',
      torId: tor_bn_ecd1.id,
      consultantId: consultant12.id,
      workstreamId: ws10.id,
      countryId: brunei.id,
      counterpartOrganisation: 'Ministry of Education, Brunei',
      counterpartContact: 'Hajah Norhayati Rahman',
      counterpartType: 'Government',
      counterpartEmail: 'norhayati.rahman@moe.gov.bn'
    });

    // 22. Singapore - Regional ECD Knowledge Hub
    const tor_sg_ecd1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-022',
      title: 'ASEAN Regional ECD Knowledge Hub',
      description: 'Establish regional hub for ECD research and policy exchange',
      objectives: 'Theory of Change: Fragmented ECD approaches across ASEAN → Regional knowledge hub → Evidence-based policy learning → Improved ECD policies region-wide.',
      deliverables: 'Hub operational framework, knowledge platform, 3 regional workshops, policy briefs',
      qualifications: 'ECD policy, regional collaboration, knowledge management',
      estimatedLoE: 30,
      dailyRate: 920,
      estimatedBudget: 27600,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.PENDING_APPROVAL,
      workstreamId: ws10.id,
      countryId: singapore.id,
      createdBy: implUser.id
    });

    // Additional interventions to reach 40+ total...

    // 23. Philippines - Foundational Literacy Programme
    const tor_ph_ecd1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-023',
      title: 'Mother Tongue-Based Foundational Literacy',
      description: 'Strengthen mother tongue instruction in early grades',
      objectives: 'Theory of Change: Poor foundational literacy due to language barriers → Mother tongue-based instruction → Stronger literacy foundations → Improved learning outcomes.',
      deliverables: 'Mother tongue materials, teacher training, 150 schools piloted, assessment tools',
      qualifications: 'Foundational literacy, mother tongue education, early grades reading',
      estimatedLoE: 36,
      dailyRate: 720,
      estimatedBudget: 25920,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-07-31'),
      status: TOR_STATUS.PENDING_APPROVAL,
      workstreamId: ws10.id,
      countryId: philippines.id,
      createdBy: implUser.id
    });

    // 24. Indonesia - Parental Engagement for ECD
    const tor_id_ecd1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-024',
      title: 'Parental Engagement in Early Learning Programme',
      description: 'Strengthen parental involvement in early childhood development',
      objectives: 'Theory of Change: Limited parental engagement → Parenting education and engagement activities → Enhanced home learning environment → Better child development.',
      deliverables: 'Parenting curriculum, 1000 parents trained, home visit protocol, monitoring framework',
      qualifications: 'Parental engagement programmes, early childhood development',
      estimatedLoE: 32,
      dailyRate: 720,
      estimatedBudget: 23040,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-08-31'),
      status: TOR_STATUS.DRAFT,
      workstreamId: ws10.id,
      countryId: indonesia.id,
      createdBy: implUser.id
    });

    // CROSS-CUTTING AND ADDITIONAL INTERVENTIONS

    // 25. Malaysia - Education Data Systems Integration
    const tor_my_emis1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-025',
      title: 'Integrated Education Data Platform Development',
      description: 'Create unified platform integrating EMIS, assessment, and HR data',
      objectives: 'Theory of Change: Fragmented data systems → Integrated data platform → Better decision-making with comprehensive data → Improved education outcomes.',
      deliverables: 'Integrated platform architecture, data migration plan, dashboard development, training',
      qualifications: 'EMIS systems, data integration, education sector experience',
      estimatedLoE: 42,
      dailyRate: 750,
      estimatedBudget: 31500,
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws2.id,
      countryId: malaysia.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-06-20')
    });

    const assign_my_emis1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-025',
      title: 'Integrated Data Platform - Malaysia',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-06-30'),
      contractedLoE: 42,
      actualLoE: 14,
      dailyRate: 750,
      totalValue: 31500,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-07-28'),
      location: 'Kuala Lumpur, Malaysia',
      torId: tor_my_emis1.id,
      consultantId: consultant2.id,
      workstreamId: ws2.id,
      countryId: malaysia.id,
      counterpartOrganisation: 'Malaysian Ministry of Education',
      counterpartContact: 'Dato\' Ahmad Razali',
      counterpartType: 'Government',
      counterpartEmail: 'ahmad.razali@moe.gov.my'
    });

    // 26. Singapore - EdTech Innovation Challenge
    const tor_sg_digital1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-026',
      title: 'ASEAN EdTech Innovation Challenge',
      description: 'Regional competition for innovative EdTech solutions addressing ASEAN needs',
      objectives: 'Theory of Change: Limited context-appropriate EdTech → Innovation challenge for local solutions → Scaled proven innovations → Enhanced learning outcomes.',
      deliverables: 'Challenge framework, 50 submissions evaluated, 10 winners scaled, impact study',
      qualifications: 'Innovation management, EdTech evaluation, regional programme management',
      estimatedLoE: 30,
      dailyRate: 800,
      estimatedBudget: 24000,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-05-31'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws6.id,
      countryId: singapore.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-07-10')
    });

    const assign_sg_digital1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-026',
      title: 'EdTech Innovation Challenge - Singapore',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-05-31'),
      contractedLoE: 30,
      actualLoE: 6,
      dailyRate: 800,
      totalValue: 24000,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-08-25'),
      location: 'Singapore',
      torId: tor_sg_digital1.id,
      consultantId: consultant4.id,
      workstreamId: ws6.id,
      countryId: singapore.id,
      counterpartOrganisation: 'Asia EdTech Collaborative',
      counterpartContact: 'David Tan',
      counterpartType: 'EdTech Partner',
      counterpartEmail: 'david.tan@asiaedtech.org'
    });

    // 27. Thailand - Inclusive Digital Learning
    const tor_th_inclusive1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-027',
      title: 'Assistive Technology for Inclusive Education',
      description: 'Deploy assistive technology for learners with disabilities',
      objectives: 'Theory of Change: Limited access for students with disabilities → Assistive technology and teacher training → Inclusive learning environments → Improved outcomes for all learners.',
      deliverables: 'Assistive tech toolkit, 200 teachers trained, 50 schools equipped, accessibility audit',
      qualifications: 'Assistive technology, inclusive education, disability inclusion',
      estimatedLoE: 35,
      dailyRate: 850,
      estimatedBudget: 29750,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws5.id,
      countryId: thailand.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-08-15')
    });

    const assign_th_inclusive1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-027',
      title: 'Assistive Technology - Thailand',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-06-30'),
      contractedLoE: 35,
      actualLoE: 4,
      dailyRate: 850,
      totalValue: 29750,
      status: ASSIGNMENT_STATUS.MOBILISING,
      mobilisationDate: new Date('2024-09-25'),
      location: 'Bangkok & Northern Thailand',
      torId: tor_th_inclusive1.id,
      consultantId: consultant1.id,
      workstreamId: ws5.id,
      countryId: thailand.id,
      counterpartOrganisation: 'Thailand Special Education Bureau',
      counterpartContact: 'Dr. Wilai Sukhont',
      counterpartType: 'Government',
      counterpartEmail: 'wilai.s@moe.go.th'
    });

    // 28. Cambodia - TVET for OOSCY
    const tor_kh_tvet1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-028',
      title: 'TVET Pathways for Out-of-School Youth',
      description: 'Second-chance skills training for youth who left formal education',
      objectives: 'Theory of Change: OOSCY lack skills for employment → Flexible TVET pathways → Skills acquisition and certification → Employment and livelihood opportunities.',
      deliverables: 'Flexible TVET model, 400 youth trained, certification framework, employment linkages',
      qualifications: 'Alternative education, TVET for marginalized youth, equivalency programmes',
      estimatedLoE: 38,
      dailyRate: 780,
      estimatedBudget: 29640,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.APPROVED,
      workstreamId: ws8.id,
      countryId: cambodia.id,
      createdBy: implUser.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-07-10')
    });

    const assign_kh_tvet1 = await Assignment.create({
      referenceNumber: 'ASN-2024-P2-028',
      title: 'TVET for OOSCY - Cambodia',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      contractedLoE: 38,
      actualLoE: 10,
      dailyRate: 780,
      totalValue: 29640,
      status: ASSIGNMENT_STATUS.ACTIVE,
      mobilisationDate: new Date('2024-08-25'),
      location: 'Phnom Penh & Siem Reap, Cambodia',
      torId: tor_kh_tvet1.id,
      consultantId: consultant9.id,
      workstreamId: ws8.id,
      countryId: cambodia.id,
      counterpartOrganisation: 'Cambodian TVET Development Authority',
      counterpartContact: 'Mr. Chea Sokha',
      counterpartType: 'Government',
      counterpartEmail: 'chea.sokha@tvetcambodia.org'
    });

    // 29. Laos - Digital Literacy for Rural Teachers
    const tor_la_digital1 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-029',
      title: 'Rural Teacher Digital Capacity Building',
      description: 'Basic digital skills and offline content delivery for remote area teachers',
      objectives: 'Theory of Change: Digital divide in remote areas → Basic digital training for rural teachers → Enhanced teaching resources → Reduced urban-rural learning gap.',
      deliverables: 'Digital literacy curriculum, 300 teachers trained, offline content library, solar charging kits',
      qualifications: 'Teacher training, appropriate technology, rural education contexts',
      estimatedLoE: 32,
      dailyRate: 750,
      estimatedBudget: 24000,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-06-30'),
      status: TOR_STATUS.PENDING_APPROVAL,
      workstreamId: ws6.id,
      countryId: laos.id,
      createdBy: implUser.id
    });

    // 30. Vietnam - Climate-Smart Agriculture Education
    const tor_vn_climate2 = await ToR.create({
      referenceNumber: 'TOR-2024-P2-030',
      title: 'Climate-Smart Agriculture in TVET Curriculum',
      description: 'Integrate climate adaptation into agricultural TVET programmes',
      objectives: 'Theory of Change: Agricultural TVET lacks climate adaptation → Climate-smart agriculture curriculum → Farmers with adaptive skills → Resilient rural livelihoods.',
      deliverables: 'Climate-smart agriculture modules, 5 TVET institutions upgraded, 300 students trained, field demonstrations',
      qualifications: 'Agricultural education, climate adaptation, TVET curriculum',
      estimatedLoE: 35,
      dailyRate: 850,
      estimatedBudget: 29750,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-08-31'),
      status: TOR_STATUS.DRAFT,
      workstreamId: ws7.id,
      countryId: vietnam.id,
      createdBy: implUser.id
    });

    console.log('✓ Phase 2 interventions (ToRs and Assignments) created');

    // Create Expenses and Fees for all assignments
    const allAssignments = [
      assign1, assign2, assign3, assign4, assign5, assign6, 
      regionalAssign1, regionalAssign2, regionalAssign3,
      // Phase 2 assignments
      assign_ph_digital1, assign_vn_digital1, assign_th_digital1, assign_id_digital1,
      assign_id_climate1, assign_ph_climate1, assign_vn_climate1,
      assign_th_tvet1, assign_vn_tvet1, assign_id_tvet1, assign_ph_tvet1,
      assign_kh_girls1, assign_la_girls1, assign_mm_girls1,
      assign_la_ecd1, assign_mm_ecd1, assign_bn_ecd1,
      assign_my_emis1, assign_sg_digital1, assign_th_inclusive1, assign_kh_tvet1
    ];
    
    for (const assignment of allAssignments) {
      // Create expenses for each assignment
      const expenseCategories = ['Airfare', 'Accommodation', 'Meals', 'LocalTransport', 'Visa', 'PerDiem', 'Other'];
      const vendors = ['Singapore Airlines', 'Marriott Hotel', 'Grab Taxi', 'Ministry of Foreign Affairs', 'Local Restaurant', 'Car Rental Co', 'Office Supplies'];
      const locations = ['Jakarta', 'Bangkok', 'Manila', 'Kuala Lumpur', 'Hanoi', 'Phnom Penh', 'Vientiane', 'Yangon', 'Bandar Seri Begawan'];
      
      // Generate 8-15 expenses per assignment
      const numExpenses = Math.floor(Math.random() * 8) + 8;
      
      for (let i = 0; i < numExpenses; i++) {
        const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        // Generate realistic amounts based on category
        let amount = 0;
        switch (category) {
          case 'Airfare':
            amount = Math.floor(Math.random() * 2000) + 500; // $500-$2500
            break;
          case 'Accommodation':
            amount = Math.floor(Math.random() * 200) + 80; // $80-$280 per night
            break;
          case 'Meals':
            amount = Math.floor(Math.random() * 50) + 20; // $20-$70
            break;
          case 'LocalTransport':
            amount = Math.floor(Math.random() * 100) + 10; // $10-$110
            break;
          case 'Visa':
            amount = Math.floor(Math.random() * 200) + 50; // $50-$250
            break;
          case 'PerDiem':
            amount = Math.floor(Math.random() * 100) + 50; // $50-$150 per day
            break;
          default:
            amount = Math.floor(Math.random() * 150) + 25; // $25-$175
        }
        
        // Generate date within assignment period
        const startDate = new Date(assignment.startDate);
        const endDate = new Date(assignment.endDate);
        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        
        await Expense.create({
          assignmentId: assignment.id,
          category: category,
          date: randomDate,
          amount: amount,
          description: `${category} - ${vendor} in ${location}`,
          receiptReference: `RCP-${assignment.referenceNumber}-${String(i + 1).padStart(3, '0')}`,
          currency: 'USD',
          location: location,
          vendor: vendor,
          status: Math.random() > 0.2 ? 'Approved' : 'Pending',
          notes: `Expense for ${assignment.title}`
        });
      }
      
      // Create fees based on LoE entries
      if (assignment.loeEntries && assignment.loeEntries.length > 0) {
        for (const loeEntry of assignment.loeEntries) {
          const feeAmount = parseFloat(loeEntry.days) * parseFloat(assignment.dailyRate);
          
          await Fee.create({
            assignmentId: assignment.id,
            feeType: 'DailyRate',
            periodStart: loeEntry.entryDate,
            periodEnd: loeEntry.entryDate,
            days: loeEntry.days,
            rate: assignment.dailyRate,
            amount: feeAmount,
            description: `Daily rate for ${loeEntry.days} days - ${loeEntry.description}`,
            invoiceReference: `INV-${assignment.referenceNumber}-${new Date(loeEntry.entryDate).toISOString().substring(0, 7)}`,
            status: 'Approved',
            notes: `Calculated from LoE entry`
          });
        }
      } else {
        // Create some milestone fees if no LoE entries
        const numFees = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numFees; i++) {
          const feeAmount = parseFloat(assignment.dailyRate) * (Math.floor(Math.random() * 10) + 5);
          const startDate = new Date(assignment.startDate);
          const endDate = new Date(assignment.endDate);
          const randomStart = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime() - 7 * 24 * 60 * 60 * 1000));
          const randomEnd = new Date(randomStart.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
          
          await Fee.create({
            assignmentId: assignment.id,
            feeType: 'Milestone',
            periodStart: randomStart,
            periodEnd: randomEnd,
            days: Math.floor(Math.random() * 7) + 1,
            rate: assignment.dailyRate,
            amount: feeAmount,
            description: `Milestone payment for ${assignment.title} - Phase ${i + 1}`,
            invoiceReference: `INV-${assignment.referenceNumber}-M${i + 1}`,
            status: 'Approved',
            notes: `Milestone fee for assignment progress`
          });
        }
      }
    }

    console.log('✓ Expenses and fees created for all assignments');

    // Create LoE Entries
    await LoEEntry.create({
      entryDate: new Date('2024-03-15'),
      days: 5,
      description: 'Initial stakeholder meetings and needs assessment',
      location: 'Jakarta',
      isTravel: false,
      assignmentId: assign1.id,
      approvedBy: implUser.id,
      approvedDate: new Date('2024-03-20')
    });

    await LoEEntry.create({
      entryDate: new Date('2024-04-10'),
      days: 8,
      description: 'Training workshop for assessment coordinators',
      location: 'Bangkok',
      isTravel: true,
      assignmentId: assign1.id,
      approvedBy: implUser.id,
      approvedDate: new Date('2024-04-15')
    });

    await LoEEntry.create({
      entryDate: new Date('2024-04-05'),
      days: 10,
      description: 'Database schema design and documentation',
      location: 'Bangkok',
      isTravel: false,
      assignmentId: assign2.id,
      approvedBy: implUser.id,
      approvedDate: new Date('2024-04-12')
    });

    console.log('✓ LoE Entries created');

    // Create Budgets
    const budget1 = await Budget.create({
      code: 'BDG-WS1-FY24',
      name: 'Learning Assessment FY24',
      budgetLine: '1.1',
      fiscalYear: '2024',
      allocatedAmount: 1500000,
      committedAmount: 850000,
      actualSpend: 425000,
      forecast: 1400000,
      isPBRFlagged: false,
      workstreamId: ws1.id,
      programmeId: sageProgramme.id
    });

    const budget2 = await Budget.create({
      code: 'BDG-WS2-FY24',
      name: 'EMIS Development FY24',
      budgetLine: '1.2',
      fiscalYear: '2024',
      allocatedAmount: 1200000,
      committedAmount: 600000,
      actualSpend: 280000,
      forecast: 1150000,
      isPBRFlagged: false,
      workstreamId: ws2.id,
      programmeId: sageProgramme.id
    });

    const budget3 = await Budget.create({
      code: 'BDG-WS3-FY24',
      name: 'OOSCY Interventions FY24',
      budgetLine: '1.3',
      fiscalYear: '2024',
      allocatedAmount: 1800000,
      committedAmount: 950000,
      actualSpend: 520000,
      forecast: 1900000,
      isPBRFlagged: true,
      workstreamId: ws3.id,
      programmeId: sageProgramme.id
    });

    console.log('✓ Budgets created');

    // Create Suppliers
    const supplier1 = await Supplier.create({
      name: 'Anjali Patel Consulting Ltd',
      type: 'Individual',
      country: 'United Kingdom',
      contactPerson: 'Dr. Anjali Patel',
      email: 'anjali.patel@consultancy.com',
      phone: '+44 7700 900000'
    });

    console.log('✓ Suppliers created');

    // Create Commitments and Invoices
    const commitment1 = await Commitment.create({
      referenceNumber: 'COM-2024-001',
      description: 'SEA-PLM Technical Advisory Services',
      amount: 38250,
      commitmentDate: new Date('2024-02-20'),
      expectedPaymentDate: new Date('2024-07-15'),
      status: 'Active',
      budgetId: budget1.id,
      assignmentId: assign1.id,
      supplierId: supplier1.id
    });

    await Invoice.create({
      invoiceNumber: 'INV-2024-001',
      invoiceDate: new Date('2024-04-30'),
      dueDate: new Date('2024-05-30'),
      amount: 12750,
      description: 'SEA-PLM Advisory - Month 1 and 2',
      status: 'Approved',
      paidDate: new Date('2024-05-15'),
      commitmentId: commitment1.id,
      assignmentId: assign1.id,
      supplierId: supplier1.id,
      approvedBy: fcdoUser.id,
      approvedDate: new Date('2024-05-05')
    });

    console.log('✓ Commitments and Invoices created');

    // Create Indicators
    const indicator1 = await Indicator.create({
      code: 'IND-1.1',
      name: 'Countries participating in SEA-PLM',
      type: INDICATOR_TYPE.OUTCOME,
      description: 'Number of ASEAN countries participating in SEA-PLM assessment',
      unit: 'Number',
      baseline: 6,
      target: 10,
      actual: 8,
      pillar: PILLARS[0],
      isGenderDisaggregated: false,
      isDisabilityTagged: false,
      isOOSCYRelated: false,
      workstreamId: ws1.id,
      programmeId: sageProgramme.id
    });

    const indicator2 = await Indicator.create({
      code: 'IND-2.1',
      name: 'Countries with functional EMIS',
      type: INDICATOR_TYPE.OUTPUT,
      description: 'Number of countries with fully functional EMIS capturing key indicators',
      unit: 'Number',
      baseline: 3,
      target: 8,
      actual: 5,
      pillar: PILLARS[1],
      isGenderDisaggregated: false,
      isDisabilityTagged: false,
      isOOSCYRelated: false,
      workstreamId: ws2.id,
      programmeId: sageProgramme.id
    });

    const indicator3 = await Indicator.create({
      code: 'IND-3.1',
      name: 'OOSCY enrolled in education',
      type: INDICATOR_TYPE.OUTCOME,
      description: 'Number of out-of-school children and youth enrolled in formal or non-formal education',
      unit: 'Number',
      baseline: 0,
      target: 50000,
      actual: 18500,
      pillar: PILLARS[2],
      isGenderDisaggregated: true,
      isDisabilityTagged: true,
      isOOSCYRelated: true,
      workstreamId: ws3.id,
      programmeId: sageProgramme.id
    });

    console.log('✓ Indicators created');

    // Create Results
    await Result.create({
      reportingDate: new Date('2024-03-31'),
      value: 2,
      maleBeneficiaries: 0,
      femaleBeneficiaries: 0,
      notes: 'Two additional countries confirmed participation in SEA-PLM',
      verificationSource: 'SEAMEO confirmation letter',
      indicatorId: indicator1.id,
      countryId: null,
      reportedBy: implUser.id
    });

    await Result.create({
      reportingDate: new Date('2024-04-30'),
      value: 8500,
      maleBeneficiaries: 3800,
      femaleBeneficiaries: 4700,
      disabilityBeneficiaries: 450,
      ooscyBeneficiaries: 8500,
      notes: 'Q1 enrollment figures for OOSCY programme in Vietnam',
      verificationSource: 'Ministry of Education database',
      indicatorId: indicator3.id,
      countryId: vietnam.id,
      reportedBy: focalUser.id
    });

    console.log('✓ Results created');

    // Create Deliverables
    const deliv1 = await Deliverable.create({
      title: 'SEA-PLM Implementation Guide',
      description: 'Comprehensive guide for implementing SEA-PLM assessments',
      dueDate: new Date('2024-05-15'),
      submittedDate: new Date('2024-05-10'),
      status: 'Approved',
      qualityRating: 5,
      reviewNotes: 'Excellent quality, comprehensive coverage',
      assignmentId: assign1.id
    });

    const deliv2 = await Deliverable.create({
      title: 'EMIS Database Schema',
      description: 'Complete database schema and data dictionary for Thailand EMIS',
      dueDate: new Date('2024-05-30'),
      submittedDate: new Date('2024-05-28'),
      status: 'Under Review',
      assignmentId: assign2.id
    });

    console.log('✓ Deliverables created');

    // Create Evidence
    const evidence1 = await Evidence.create({
      title: 'SEA-PLM Training Workshop Report',
      description: 'Report from regional training workshop',
      type: 'Report',
      collectionDate: new Date('2024-04-20'),
      source: 'Workshop facilitator',
      tags: ['training', 'SEA-PLM', 'capacity building'],
      deliverableId: deliv1.id,
      countryId: thailand.id
    });

    await evidence1.addIndicator(indicator1);

    console.log('✓ Evidence created and linked');

    // Create Risks
    await Risk.create({
      referenceNumber: 'RISK-001',
      title: 'Delayed OOSCY identification',
      description: 'Community mobilization facing delays due to seasonal migration patterns',
      category: 'Operational',
      likelihood: 4,
      impact: 4,
      riskScore: 16,
      mitigation: 'Adjust timeline and work with community leaders to plan around migration',
      mitigationOwner: implUser.id,
      status: 'Open',
      reviewDate: new Date('2024-06-30'),
      programmeId: sageProgramme.id,
      workstreamId: ws3.id,
      raisedBy: focalUser.id
    });

    await Risk.create({
      referenceNumber: 'RISK-002',
      title: 'Exchange rate fluctuations',
      description: 'Currency volatility affecting programme budget',
      category: 'Financial',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      mitigation: 'Monitor rates monthly, maintain contingency buffer',
      mitigationOwner: fcdoUser.id,
      status: 'Open',
      reviewDate: new Date('2024-07-31'),
      programmeId: sageProgramme.id,
      raisedBy: implUser.id
    });

    console.log('✓ Risks created');

    // Create Issues
    await Issue.create({
      referenceNumber: 'ISS-001',
      title: 'Data privacy concerns in Thailand EMIS',
      description: 'Stakeholders raised concerns about student data privacy in new EMIS',
      category: 'Technical',
      priority: 'High',
      status: 'Open',
      assignedTo: implUser.id,
      raisedDate: new Date('2024-04-15'),
      targetResolutionDate: new Date('2024-05-31'),
      programmeId: thaiProgramme.id,
      raisedBy: focalUser.id
    });

    console.log('✓ Issues created');

    // Create Safeguarding Incident (sample - normally highly restricted)
    await SafeguardingIncident.create({
      referenceNumber: 'SG-001',
      incidentDate: new Date('2024-03-20'),
      reportedDate: new Date('2024-03-21'),
      category: 'Child Protection Concern',
      severity: 'Medium',
      description: 'Allegation of inappropriate conduct during community visit',
      location: 'Rural Vietnam',
      actionTaken: 'Immediate investigation initiated, consultant suspended pending outcome',
      status: 'Under Investigation',
      caseOwner: fcdoUser.id,
      isConfidential: true,
      programmeId: sageProgramme.id,
      countryId: vietnam.id,
      reportedBy: implUser.id
    });

    console.log('✓ Safeguarding incidents created');

    // Create Decisions
    await Decision.create({
      referenceNumber: 'DEC-001',
      title: 'Approval to extend OOSCY pilot to Philippines',
      description: 'Decision to expand OOSCY pilot programme based on Vietnam success',
      decisionDate: new Date('2024-04-10'),
      decisionMaker: fcdoUser.id,
      rationale: 'Strong results in Vietnam pilot, Philippines government keen to participate',
      implications: 'Budget reallocation of £250k, additional TA mobilisation required',
      programmeId: sageProgramme.id
    });

    console.log('✓ Decisions created');

    // Create Lessons
    await Lesson.create({
      title: 'Community engagement critical for OOSCY identification',
      description: 'Early and sustained community engagement is essential for successful OOSCY identification',
      context: 'Vietnam OOSCY pilot programme',
      whatWorked: 'Working with village chiefs and using local volunteers',
      whatDidntWork: 'Top-down approaches from ministry without community buy-in',
      recommendations: 'Always start with community mapping and leader engagement',
      category: 'Programme Design',
      dateRecorded: new Date('2024-04-25'),
      recordedBy: focalUser.id,
      programmeId: sageProgramme.id,
      workstreamId: ws3.id
    });

    console.log('✓ Lessons created');

    // ============================================
    // PHASE 2: SUPPORTING DATA (Indicators, Budgets, Evidence, Risks)
    // ============================================

    // Phase 2 Budgets
    const budget_ws6 = await Budget.create({
      code: 'BDG-WS6-FY24',
      name: 'Digital Learning & EdTech FY24',
      budgetLine: '2.1',
      fiscalYear: '2024',
      allocatedAmount: 1100000,
      committedAmount: 520000,
      actualSpend: 195000,
      forecast: 1050000,
      isPBRFlagged: false,
      workstreamId: ws6.id,
      programmeId: sageProgramme.id
    });

    const budget_ws7 = await Budget.create({
      code: 'BDG-WS7-FY24',
      name: 'Climate Education FY24',
      budgetLine: '2.2',
      fiscalYear: '2024',
      allocatedAmount: 800000,
      committedAmount: 340000,
      actualSpend: 125000,
      forecast: 780000,
      isPBRFlagged: false,
      workstreamId: ws7.id,
      programmeId: sageProgramme.id
    });

    const budget_ws8 = await Budget.create({
      code: 'BDG-WS8-FY24',
      name: 'Skills & TVET FY24',
      budgetLine: '2.3',
      fiscalYear: '2024',
      allocatedAmount: 1250000,
      committedAmount: 680000,
      actualSpend: 285000,
      forecast: 1300000,
      isPBRFlagged: true,
      workstreamId: ws8.id,
      programmeId: sageProgramme.id
    });

    const budget_ws9 = await Budget.create({
      code: 'BDG-WS9-FY24',
      name: 'Girls\' Education FY24',
      budgetLine: '2.4',
      fiscalYear: '2024',
      allocatedAmount: 1050000,
      committedAmount: 440000,
      actualSpend: 180000,
      forecast: 1020000,
      isPBRFlagged: false,
      workstreamId: ws9.id,
      programmeId: sageProgramme.id
    });

    const budget_ws10 = await Budget.create({
      code: 'BDG-WS10-FY24',
      name: 'Early Childhood Development FY24',
      budgetLine: '2.5',
      fiscalYear: '2024',
      allocatedAmount: 950000,
      committedAmount: 420000,
      actualSpend: 165000,
      forecast: 930000,
      isPBRFlagged: false,
      workstreamId: ws10.id,
      programmeId: sageProgramme.id
    });

    console.log('✓ Phase 2 budgets created');

    // Phase 2 Indicators - Digital Learning
    const indicator_digital1 = await Indicator.create({
      code: 'IND-6.1',
      name: 'Teachers trained in digital pedagogy',
      type: INDICATOR_TYPE.OUTPUT,
      description: 'Number of teachers completing digital literacy and pedagogy training',
      unit: 'Number',
      baseline: 0,
      target: 2000,
      actual: 650,
      pillar: PILLARS[5],
      isGenderDisaggregated: true,
      isDisabilityTagged: false,
      isOOSCYRelated: false,
      workstreamId: ws6.id,
      programmeId: sageProgramme.id
    });

    const indicator_digital2 = await Indicator.create({
      code: 'IND-6.2',
      name: 'Students accessing digital learning platforms',
      type: INDICATOR_TYPE.OUTCOME,
      description: 'Number of students with regular access to quality digital learning content',
      unit: 'Number',
      baseline: 5000,
      target: 50000,
      actual: 18500,
      pillar: PILLARS[5],
      isGenderDisaggregated: true,
      isDisabilityTagged: true,
      isOOSCYRelated: false,
      workstreamId: ws6.id,
      programmeId: sageProgramme.id
    });

    // Phase 2 Indicators - Climate Education
    const indicator_climate1 = await Indicator.create({
      code: 'IND-7.1',
      name: 'Schools implementing climate education',
      type: INDICATOR_TYPE.OUTPUT,
      description: 'Number of schools with integrated climate education in curriculum',
      unit: 'Number',
      baseline: 0,
      target: 300,
      actual: 95,
      pillar: PILLARS[6],
      isGenderDisaggregated: false,
      isDisabilityTagged: false,
      isOOSCYRelated: false,
      workstreamId: ws7.id,
      programmeId: sageProgramme.id
    });

    const indicator_climate2 = await Indicator.create({
      code: 'IND-7.2',
      name: 'Students participating in climate action projects',
      type: INDICATOR_TYPE.OUTCOME,
      description: 'Number of students engaged in school-based climate action initiatives',
      unit: 'Number',
      baseline: 0,
      target: 25000,
      actual: 8200,
      pillar: PILLARS[6],
      isGenderDisaggregated: true,
      isDisabilityTagged: false,
      isOOSCYRelated: false,
      workstreamId: ws7.id,
      programmeId: sageProgramme.id
    });

    // Phase 2 Indicators - TVET
    const indicator_tvet1 = await Indicator.create({
      code: 'IND-8.1',
      name: 'Youth completing skills training',
      type: INDICATOR_TYPE.OUTPUT,
      description: 'Number of youth completing TVET and skills training programmes',
      unit: 'Number',
      baseline: 0,
      target: 3000,
      actual: 1150,
      pillar: PILLARS[7],
      isGenderDisaggregated: true,
      isDisabilityTagged: true,
      isOOSCYRelated: true,
      workstreamId: ws8.id,
      programmeId: sageProgramme.id
    });

    const indicator_tvet2 = await Indicator.create({
      code: 'IND-8.2',
      name: 'Youth employed within 6 months of training',
      type: INDICATOR_TYPE.OUTCOME,
      description: 'Number of trained youth securing employment or starting businesses within 6 months',
      unit: 'Number',
      baseline: 0,
      target: 2000,
      actual: 520,
      pillar: PILLARS[7],
      isGenderDisaggregated: true,
      isDisabilityTagged: true,
      isOOSCYRelated: true,
      workstreamId: ws8.id,
      programmeId: sageProgramme.id
    });

    // Phase 2 Indicators - Girls' Education
    const indicator_girls1 = await Indicator.create({
      code: 'IND-9.1',
      name: 'Girls receiving scholarships',
      type: INDICATOR_TYPE.OUTPUT,
      description: 'Number of girls receiving conditional scholarships for secondary education',
      unit: 'Number',
      baseline: 0,
      target: 2500,
      actual: 1200,
      pillar: PILLARS[8],
      isGenderDisaggregated: true,
      isDisabilityTagged: true,
      isOOSCYRelated: true,
      workstreamId: ws9.id,
      programmeId: sageProgramme.id
    });

    const indicator_girls2 = await Indicator.create({
      code: 'IND-9.2',
      name: 'Girls completing secondary education',
      type: INDICATOR_TYPE.OUTCOME,
      description: 'Number of girls completing lower secondary with programme support',
      unit: 'Number',
      baseline: 0,
      target: 2000,
      actual: 450,
      pillar: PILLARS[8],
      isGenderDisaggregated: true,
      isDisabilityTagged: false,
      isOOSCYRelated: true,
      workstreamId: ws9.id,
      programmeId: sageProgramme.id
    });

    // Phase 2 Indicators - ECD
    const indicator_ecd1 = await Indicator.create({
      code: 'IND-10.1',
      name: 'Pre-primary teachers trained',
      type: INDICATOR_TYPE.OUTPUT,
      description: 'Number of pre-primary teachers trained in play-based pedagogy',
      unit: 'Number',
      baseline: 0,
      target: 800,
      actual: 320,
      pillar: PILLARS[9],
      isGenderDisaggregated: true,
      isDisabilityTagged: false,
      isOOSCYRelated: false,
      workstreamId: ws10.id,
      programmeId: sageProgramme.id
    });

    const indicator_ecd2 = await Indicator.create({
      code: 'IND-10.2',
      name: 'Children in quality ECD programmes',
      type: INDICATOR_TYPE.OUTCOME,
      description: 'Number of children enrolled in quality-assured ECD programmes',
      unit: 'Number',
      baseline: 2000,
      target: 20000,
      actual: 8500,
      pillar: PILLARS[9],
      isGenderDisaggregated: true,
      isDisabilityTagged: true,
      isOOSCYRelated: false,
      workstreamId: ws10.id,
      programmeId: sageProgramme.id
    });

    console.log('✓ Phase 2 indicators created');

    // Phase 2 Results
    await Result.create({
      reportingDate: new Date('2024-09-30'),
      value: 650,
      maleBeneficiaries: 185,
      femaleBeneficiaries: 465,
      notes: 'Digital literacy training completed in Philippines, Vietnam, and Thailand',
      verificationSource: 'Training completion certificates and attendance records',
      indicatorId: indicator_digital1.id,
      countryId: null,
      reportedBy: implUser.id
    });

    await Result.create({
      reportingDate: new Date('2024-09-30'),
      value: 1150,
      maleBeneficiaries: 680,
      femaleBeneficiaries: 470,
      disabilityBeneficiaries: 85,
      ooscyBeneficiaries: 420,
      notes: 'Skills training completions across Thailand, Vietnam, Indonesia, and Philippines',
      verificationSource: 'TVET institution records and certification data',
      indicatorId: indicator_tvet1.id,
      countryId: null,
      reportedBy: implUser.id
    });

    await Result.create({
      reportingDate: new Date('2024-09-30'),
      value: 1200,
      maleBeneficiaries: 0,
      femaleBeneficiaries: 1200,
      disabilityBeneficiaries: 95,
      ooscyBeneficiaries: 380,
      notes: 'Scholarships awarded in Cambodia and Laos for girls\' secondary education',
      verificationSource: 'Ministry of Education scholarship databases',
      indicatorId: indicator_girls1.id,
      countryId: cambodia.id,
      reportedBy: focalUser.id
    });

    console.log('✓ Phase 2 results created');

    // Phase 2 Evidence
    const evidence_digital1 = await Evidence.create({
      title: 'Digital Learning Platform Pilot Evaluation - Philippines',
      description: 'Midterm evaluation of offline digital learning platform in remote areas',
      type: 'Evaluation',
      collectionDate: new Date('2024-09-15'),
      source: 'External evaluator',
      tags: ['digital learning', 'EdTech', 'evaluation', 'Philippines'],
      countryId: philippines.id
    });

    await evidence_digital1.addIndicator(indicator_digital2);

    const evidence_climate1 = await Evidence.create({
      title: 'Climate Curriculum Integration Baseline Study - Indonesia',
      description: 'Baseline assessment of climate knowledge and curriculum content',
      type: 'Report',
      collectionDate: new Date('2024-08-20'),
      source: 'Ministry of Education',
      tags: ['climate education', 'curriculum', 'baseline', 'Indonesia'],
      countryId: indonesia.id
    });

    await evidence_climate1.addIndicator(indicator_climate1);

    const evidence_tvet1 = await Evidence.create({
      title: 'Youth Employment Outcomes Tracking Report',
      description: 'Six-month employment outcomes for TVET graduates',
      type: 'Report',
      collectionDate: new Date('2024-09-30'),
      source: 'Programme M&E team',
      tags: ['TVET', 'employment', 'outcomes', 'youth'],
      countryId: thailand.id
    });

    await evidence_tvet1.addIndicator(indicator_tvet2);

    const evidence_girls1 = await Evidence.create({
      title: 'Girls\' Scholarship Programme Impact Study - Cambodia',
      description: 'Analysis of scholarship impact on enrollment and retention',
      type: 'Study',
      collectionDate: new Date('2024-09-01'),
      source: 'Research partner',
      tags: ['girls education', 'scholarships', 'impact', 'Cambodia'],
      countryId: cambodia.id
    });

    await evidence_girls1.addIndicator(indicator_girls1);
    await evidence_girls1.addIndicator(indicator_girls2);

    const evidence_ecd1 = await Evidence.create({
      title: 'ECD Quality Standards Development Process Documentation',
      description: 'Participatory process for developing national ECD quality standards in Brunei',
      type: 'Report',
      collectionDate: new Date('2024-09-20'),
      source: 'Consultant report',
      tags: ['ECD', 'quality standards', 'policy', 'Brunei'],
      countryId: brunei.id
    });

    await evidence_ecd1.addIndicator(indicator_ecd2);

    console.log('✓ Phase 2 evidence created and linked');

    // Phase 2 Risks
    await Risk.create({
      referenceNumber: 'RISK-P2-001',
      title: 'Digital infrastructure limitations in remote areas',
      description: 'Poor internet connectivity and electricity supply affecting digital learning interventions',
      category: 'Technical',
      likelihood: 4,
      impact: 4,
      riskScore: 16,
      mitigation: 'Focus on offline-first solutions, solar power kits, and community charging stations',
      mitigationOwner: implUser.id,
      status: 'Open',
      reviewDate: new Date('2024-12-31'),
      programmeId: sageProgramme.id,
      workstreamId: ws6.id,
      raisedBy: implUser.id
    });

    await Risk.create({
      referenceNumber: 'RISK-P2-002',
      title: 'Teacher resistance to new digital pedagogy',
      description: 'Teachers lack confidence or willingness to adopt digital teaching methods',
      category: 'Capacity',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      mitigation: 'Enhanced support, peer learning networks, ongoing coaching, and recognition programs',
      mitigationOwner: implUser.id,
      status: 'Open',
      reviewDate: new Date('2024-11-30'),
      programmeId: sageProgramme.id,
      workstreamId: ws6.id,
      raisedBy: focalUser.id
    });

    await Risk.create({
      referenceNumber: 'RISK-P2-003',
      title: 'Industry partnership sustainability for TVET',
      description: 'Private sector partners may reduce engagement due to economic pressures',
      category: 'Partnership',
      likelihood: 3,
      impact: 4,
      riskScore: 12,
      mitigation: 'Diversify partner base, formal MOUs, demonstrate value proposition, government incentives',
      mitigationOwner: fcdoUser.id,
      status: 'Open',
      reviewDate: new Date('2025-01-31'),
      programmeId: sageProgramme.id,
      workstreamId: ws8.id,
      raisedBy: implUser.id
    });

    await Risk.create({
      referenceNumber: 'RISK-P2-004',
      title: 'Cultural sensitivities in girls\' education interventions',
      description: 'Community resistance to girls\' education initiatives in conservative areas',
      category: 'Social',
      likelihood: 3,
      impact: 4,
      riskScore: 12,
      mitigation: 'Community engagement, religious leader involvement, evidence sharing, gradual approach',
      mitigationOwner: implUser.id,
      status: 'Open',
      reviewDate: new Date('2024-12-15'),
      programmeId: sageProgramme.id,
      workstreamId: ws9.id,
      raisedBy: focalUser.id
    });

    await Risk.create({
      referenceNumber: 'RISK-P2-005',
      title: 'Climate education deprioritized in curriculum reforms',
      description: 'Ministries prioritize other subjects over climate education in curriculum revisions',
      category: 'Political',
      likelihood: 2,
      impact: 3,
      riskScore: 6,
      mitigation: 'Advocate for integration approach rather than separate subject, align with national priorities',
      mitigationOwner: fcdoUser.id,
      status: 'Mitigated',
      reviewDate: new Date('2025-02-28'),
      programmeId: sageProgramme.id,
      workstreamId: ws7.id,
      raisedBy: implUser.id
    });

    await Risk.create({
      referenceNumber: 'RISK-P2-006',
      title: 'Conflict-affected areas limit ECD centre operations',
      description: 'Security situation in Myanmar affects ability to operate community ECD centres',
      category: 'Security',
      likelihood: 4,
      impact: 5,
      riskScore: 20,
      mitigation: 'Flexible programming, remote support, local partner implementation, contingency plans',
      mitigationOwner: fcdoUser.id,
      status: 'Open',
      reviewDate: new Date('2024-11-30'),
      programmeId: sageProgramme.id,
      workstreamId: ws10.id,
      raisedBy: implUser.id
    });

    console.log('✓ Phase 2 risks created');

    // Phase 2 Deliverables
    await Deliverable.create({
      title: 'Digital Learning Platform - Philippines Version 1.0',
      description: 'Offline-capable mobile learning application with localized content',
      dueDate: new Date('2024-12-31'),
      status: 'In Progress',
      assignmentId: assign_ph_digital1.id
    });

    await Deliverable.create({
      title: 'Climate Curriculum Modules - Indonesia',
      description: 'Integrated climate education modules for grades 7-9',
      dueDate: new Date('2025-03-31'),
      status: 'In Progress',
      assignmentId: assign_id_climate1.id
    });

    await Deliverable.create({
      title: 'TVET Industry Partnership Framework - Thailand',
      description: 'National framework for industry-education partnerships in TVET',
      dueDate: new Date('2025-02-28'),
      submittedDate: new Date('2024-09-20'),
      status: 'Under Review',
      qualityRating: 4,
      reviewNotes: 'Strong framework, needs minor revisions on monitoring mechanisms',
      assignmentId: assign_th_tvet1.id
    });

    await Deliverable.create({
      title: 'Girls\' Education Scholarship Impact Report - Cambodia',
      description: 'Midterm impact assessment of conditional scholarship programme',
      dueDate: new Date('2024-12-31'),
      status: 'In Progress',
      assignmentId: assign_kh_girls1.id
    });

    await Deliverable.create({
      title: 'ECD Quality Standards Framework - Brunei',
      description: 'Comprehensive quality standards for pre-primary education providers',
      dueDate: new Date('2025-01-31'),
      submittedDate: new Date('2024-09-30'),
      status: 'Approved',
      qualityRating: 5,
      reviewNotes: 'Excellent quality, comprehensive and contextually appropriate',
      assignmentId: assign_bn_ecd1.id
    });

    await Deliverable.create({
      title: 'Teacher Digital Literacy Training Curriculum - Vietnam',
      description: 'Modular training curriculum for teacher digital capacity building',
      dueDate: new Date('2024-11-30'),
      submittedDate: new Date('2024-09-15'),
      status: 'Approved',
      qualityRating: 4,
      reviewNotes: 'Well-designed curriculum with practical activities',
      assignmentId: assign_vn_digital1.id
    });

    console.log('✓ Phase 2 deliverables created');

    // Phase 2 Additional Lessons Learned
    await Lesson.create({
      title: 'Offline-first approach essential for digital equity',
      description: 'Digital learning interventions must prioritize offline functionality to reach remote areas',
      context: 'Phase 2 digital learning rollout across ASEAN',
      whatWorked: 'Apps with offline sync, pre-loaded content, solar charging solutions',
      whatDidntWork: 'Cloud-dependent solutions, streaming video, assumption of constant connectivity',
      recommendations: 'Always design for lowest common denominator of connectivity and power availability',
      category: 'Technology',
      dateRecorded: new Date('2024-09-20'),
      recordedBy: implUser.id,
      programmeId: sageProgramme.id,
      workstreamId: ws6.id
    });

    await Lesson.create({
      title: 'Gender-transformative approaches need community buy-in',
      description: 'Girls\' education interventions more successful with early community engagement',
      context: 'Cambodia and Laos girls\' education programmes',
      whatWorked: 'Engaging religious leaders, male champions, mother support groups',
      whatDidntWork: 'Top-down mandates, external messaging without local voices',
      recommendations: 'Invest time in community mapping and stakeholder engagement before programme launch',
      category: 'Social',
      dateRecorded: new Date('2024-09-15'),
      recordedBy: focalUser.id,
      programmeId: sageProgramme.id,
      workstreamId: ws9.id
    });

    await Lesson.create({
      title: 'Industry partnerships require mutual value proposition',
      description: 'TVET-industry partnerships sustainable when both sides see clear benefits',
      context: 'Thailand and Vietnam TVET programmes',
      whatWorked: 'Co-designed curricula, apprentice-to-hire pipelines, industry input on assessments',
      whatDidntWork: 'One-way asks without demonstrating industry benefits, unclear expectations',
      recommendations: 'Frame partnerships around workforce needs and quality talent pipelines, not charity',
      category: 'Partnership',
      dateRecorded: new Date('2024-09-25'),
      recordedBy: implUser.id,
      programmeId: sageProgramme.id,
      workstreamId: ws8.id
    });

    console.log('✓ Phase 2 lessons learned created');

    // Create Donor Organisations
    const donorADB = await DonorOrganisation.create({
      name: 'Asian Development Bank',
      code: 'ADB',
      description: 'Regional development bank focused on Asia and the Pacific',
      logoUrl: '/assets/donors/ADB.png',
      website: 'https://www.adb.org',
      organizationType: 'multilateral',
      primaryContact: 'Dr. James Anderson',
      contactEmail: 'james.anderson@adb.org',
      contactPhone: '+63 2 8632 4444'
    });

    const donorDFAT = await DonorOrganisation.create({
      name: 'Australian Department of Foreign Affairs and Trade',
      code: 'DFAT',
      description: 'Australian government agency for international development',
      logoUrl: '/assets/donors/DFAT.png',
      website: 'https://www.dfat.gov.au',
      organizationType: 'bilateral',
      primaryContact: 'Karen Mitchell',
      contactEmail: 'karen.mitchell@dfat.gov.au',
      contactPhone: '+61 2 6261 1111'
    });

    const donorEC = await DonorOrganisation.create({
      name: 'European Commission',
      code: 'EC',
      description: 'European Union executive body for development cooperation',
      logoUrl: '/assets/donors/EC.png',
      website: 'https://ec.europa.eu',
      organizationType: 'multilateral',
      primaryContact: 'Dr. Sofia Martinez',
      contactEmail: 'sofia.martinez@ec.europa.eu',
      contactPhone: '+32 2 299 1111'
    });

    const donorFCDO = await DonorOrganisation.create({
      name: 'UK Foreign, Commonwealth & Development Office',
      code: 'FCDO',
      description: 'British government department for international development',
      logoUrl: '/assets/donors/FCDO.png',
      website: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office',
      organizationType: 'bilateral',
      primaryContact: 'Robert Thompson',
      contactEmail: 'robert.thompson@fcdo.gov.uk',
      contactPhone: '+44 20 7008 5000'
    });

    const donorUNICEF = await DonorOrganisation.create({
      name: 'UN Children\'s Fund',
      code: 'UNICEF',
      description: 'United Nations agency for children\'s rights and wellbeing',
      logoUrl: '/assets/donors/UNICEF.png',
      website: 'https://www.unicef.org',
      organizationType: 'multilateral',
      primaryContact: 'Maria Santos',
      contactEmail: 'msantos@unicef.org',
      contactPhone: '+66 2 356 9499'
    });

    const donorUSAID = await DonorOrganisation.create({
      name: 'US Agency for International Development',
      code: 'USAID',
      description: 'American government agency for international development',
      logoUrl: '/assets/donors/US.png',
      website: 'https://www.usaid.gov',
      organizationType: 'bilateral',
      primaryContact: 'Michael Chen',
      contactEmail: 'mchen@usaid.gov',
      contactPhone: '+1 202 712 0000'
    });

    const donorWB = await DonorOrganisation.create({
      name: 'World Bank Group',
      code: 'WB',
      description: 'International financial institution providing loans and grants',
      logoUrl: '/assets/donors/WB.png',
      website: 'https://www.worldbank.org',
      organizationType: 'multilateral',
      primaryContact: 'Dr. Priya Sharma',
      contactEmail: 'psharma@worldbank.org',
      contactPhone: '+1 202 473 1000'
    });

    console.log('✓ Donor organisations created');

    // Create Donor Projects
    const projects = await Country.findAll();
    const donorProjects = [
      {
        title: 'ASEAN Digital Skills Development Initiative',
        description: 'Comprehensive digital skills training programme across ASEAN countries focusing on youth and vulnerable populations',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2027-12-31'),
        totalBudget: 25000000,
        status: 'Active',
        donorOrganisationId: donorADB.id,
        countryId: null,
        isRegional: true,
        focusAreas: ['Digital Skills', 'Youth Employment', 'Vocational Training'],
        keyContacts: [
          { name: 'Dr. James Anderson', role: 'Programme Director', email: 'james.anderson@adb.org', phone: '+63 2 8632 4444' },
          { name: 'Lisa Wang', role: 'Monitoring & Evaluation Manager', email: 'l.wang@adb.org' }
        ]
      },
      {
        title: 'Cambodia Primary Education Quality Improvement',
        description: 'Strengthening primary education systems and teacher capacity in Cambodia',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2026-05-31'),
        totalBudget: 15000000,
        status: 'Active',
        donorOrganisationId: donorDFAT.id,
        countryId: (await Country.findOne({ where: { code: 'KHM' } })).id,
        isRegional: false,
        focusAreas: ['Primary Education', 'Teacher Development', 'Curriculum Reform'],
        keyContacts: [
          { name: 'Karen Mitchell', role: 'Country Director', email: 'karen.mitchell@dfat.gov.au', phone: '+855 23 213 470' },
          { name: 'Sarah Johnson', role: 'Education Specialist', email: 'sarah.j@dfat.gov.au' }
        ]
      },
      {
        title: 'Vietnam Climate-Resilient Education Infrastructure',
        description: 'Building climate-resilient schools and improving disaster preparedness in education sector',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2027-02-28'),
        totalBudget: 32000000,
        status: 'Active',
        donorOrganisationId: donorEC.id,
        countryId: (await Country.findOne({ where: { code: 'VNM' } })).id,
        isRegional: false,
        focusAreas: ['Infrastructure', 'Climate Resilience', 'Disaster Preparedness'],
        keyContacts: [
          { name: 'Dr. Sofia Martinez', role: 'Programme Manager', email: 'sofia.martinez@ec.europa.eu', phone: '+84 24 3941 1496' }
        ]
      },
      {
        title: 'ASEAN Girls\' Education Equality Programme',
        description: 'Regional initiative to improve girls\' access to quality education across ASEAN',
        startDate: new Date('2022-09-01'),
        endDate: new Date('2026-08-31'),
        totalBudget: 45000000,
        status: 'Active',
        donorOrganisationId: donorFCDO.id,
        countryId: null,
        isRegional: true,
        focusAreas: ['Girls\' Education', 'Gender Equality', 'Inclusive Education'],
        keyContacts: [
          { name: 'Robert Thompson', role: 'Regional Director', email: 'robert.thompson@fcdo.gov.uk', phone: '+66 2 305 8333' },
          { name: 'Emma Williams', role: 'Gender Specialist', email: 'emma.williams@fcdo.gov.uk' }
        ]
      },
      {
        title: 'Philippines Early Childhood Development Initiative',
        description: 'Comprehensive ECD programme supporting children 0-5 years in the Philippines',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2025-12-31'),
        totalBudget: 12000000,
        status: 'Active',
        donorOrganisationId: donorUNICEF.id,
        countryId: (await Country.findOne({ where: { code: 'PHL' } })).id,
        isRegional: false,
        focusAreas: ['Early Childhood Development', 'Maternal Health', 'Parenting Support'],
        keyContacts: [
          { name: 'Maria Santos', role: 'Country Representative', email: 'msantos@unicef.org', phone: '+63 2 901 0100' }
        ]
      },
      {
        title: 'Thailand STEM Education Advancement',
        description: 'Enhancing STEM teaching and learning capabilities in Thai secondary schools',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2027-05-31'),
        totalBudget: 18000000,
        status: 'Active',
        donorOrganisationId: donorUSAID.id,
        countryId: (await Country.findOne({ where: { code: 'THA' } })).id,
        isRegional: false,
        focusAreas: ['STEM Education', 'Teacher Training', 'Curriculum Development'],
        keyContacts: [
          { name: 'Michael Chen', role: 'Mission Director', email: 'mchen@usaid.gov', phone: '+66 2 257 3000' }
        ]
      },
      {
        title: 'Myanmar Education System Recovery Support',
        description: 'Supporting recovery and resilience of education systems in Myanmar',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        totalBudget: 28000000,
        status: 'Active',
        donorOrganisationId: donorWB.id,
        countryId: (await Country.findOne({ where: { code: 'MMR' } })).id,
        isRegional: false,
        focusAreas: ['System Recovery', 'Inclusive Education', 'Education Financing'],
        keyContacts: [
          { name: 'Dr. Priya Sharma', role: 'Country Director', email: 'psharma@worldbank.org', phone: '+95 1 654 824' }
        ]
      },
      {
        title: 'Malaysia Technical and Vocational Training Modernization',
        description: 'Modernizing TVET systems and improving industry alignment in Malaysia',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2026-08-31'),
        totalBudget: 22000000,
        status: 'Active',
        donorOrganisationId: donorADB.id,
        countryId: (await Country.findOne({ where: { code: 'MYS' } })).id,
        isRegional: false,
        focusAreas: ['TVET', 'Skills Development', 'Industry Linkages'],
        keyContacts: [
          { name: 'Dr. James Anderson', role: 'Programme Director', email: 'james.anderson@adb.org' }
        ]
      },
      {
        title: 'Indonesia Digital Learning Innovation Hub',
        description: 'Establishing digital learning innovation centres across Indonesia',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2027-03-31'),
        totalBudget: 35000000,
        status: 'Active',
        donorOrganisationId: donorEC.id,
        countryId: (await Country.findOne({ where: { code: 'IDN' } })).id,
        isRegional: false,
        focusAreas: ['Digital Learning', 'Innovation', 'Educational Technology'],
        keyContacts: [
          { name: 'Dr. Sofia Martinez', role: 'Programme Manager', email: 'sofia.martinez@ec.europa.eu' }
        ]
      },
      {
        title: 'Singapore-Myanmar Education Capacity Building Partnership',
        description: 'Knowledge exchange and capacity building between Singapore and Myanmar education systems',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'),
        totalBudget: 5000000,
        status: 'Active',
        donorOrganisationId: donorDFAT.id,
        countryId: null,
        isRegional: false,
        focusAreas: ['Capacity Building', 'Knowledge Exchange', 'South-South Cooperation'],
        keyContacts: [
          { name: 'Karen Mitchell', role: 'Country Director', email: 'karen.mitchell@dfat.gov.au' }
        ]
      },
      {
        title: 'Brunei Inclusive Education Framework',
        description: 'Developing inclusive education systems to support children with disabilities in Brunei',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2026-02-28'),
        totalBudget: 8000000,
        status: 'Active',
        donorOrganisationId: donorUNICEF.id,
        countryId: (await Country.findOne({ where: { code: 'BRN' } })).id,
        isRegional: false,
        focusAreas: ['Inclusive Education', 'Special Needs', 'Disability Rights'],
        keyContacts: [
          { name: 'Maria Santos', role: 'Country Representative', email: 'msantos@unicef.org' }
        ]
      },
      {
        title: 'Laos Lower Secondary Education Strengthening',
        description: 'Improving quality and access to lower secondary education in rural Laos',
        startDate: new Date('2023-08-01'),
        endDate: new Date('2026-07-31'),
        totalBudget: 16000000,
        status: 'Active',
        donorOrganisationId: donorWB.id,
        countryId: (await Country.findOne({ where: { code: 'LAO' } })).id,
        isRegional: false,
        focusAreas: ['Secondary Education', 'Rural Education', 'Quality Improvement'],
        keyContacts: [
          { name: 'Dr. Priya Sharma', role: 'Country Director', email: 'psharma@worldbank.org' }
        ]
      }
    ];

    for (const projectData of donorProjects) {
      await DonorProject.create(projectData);
    }

    console.log('✓ Donor projects created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Sample login credentials:');
    console.log('   Admin: admin@sage.org / admin123');
    console.log('   FCDO SRO: sro@fcdo.gov.uk / fcdo123');
    console.log('   Country Focal: focal@edu.gov.th / focal123');
    console.log('   Implementer: impl@dai.com / impl123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

