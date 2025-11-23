import { sequelize, Programme, Workstream, Assignment, Budget, Indicator, Result, ToR, Country, Consultant, Deliverable, Risk, User, Expense, Fee } from '../models/index.js';
import { Op } from 'sequelize';
import { subMonths } from 'date-fns';

export const getRegionalDashboard = async (req, res, next) => {
  try {
    const { pillar, countryId, fiscalYear } = req.query;
    const where = {};
    
    if (pillar) where.pillar = pillar;

    // Total spend and budget
    const budgetStats = await Budget.findAll({
      where: fiscalYear ? { fiscalYear } : {},
      attributes: [
        [sequelize.fn('SUM', sequelize.col('allocatedAmount')), 'totalBudget'],
        [sequelize.fn('SUM', sequelize.col('actualSpend')), 'totalSpend'],
        [sequelize.fn('SUM', sequelize.col('committedAmount')), 'totalCommitted']
      ],
      raw: true
    });

    // TA coverage by pillar
    const taCoverageByPillar = await Workstream.findAll({
      where,
      attributes: [
        'pillar',
        [sequelize.fn('COUNT', sequelize.col('assignments.id')), 'assignmentCount'],
        [sequelize.fn('SUM', sequelize.col('assignments.contractedLoE')), 'totalLoE']
      ],
      include: [{
        model: Assignment,
        as: 'assignments',
        attributes: [],
        where: countryId ? { countryId } : {}
      }],
      group: ['Workstream.pillar'],
      raw: true
    });

    // Active assignments by status
    const assignmentsByStatus = await Assignment.findAll({
      where: countryId ? { countryId } : {},
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Indicator progress
    const indicatorProgress = await Indicator.findAll({
      where: pillar ? { pillar } : {},
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('AVG', sequelize.literal('(actual / NULLIF(target, 0)) * 100')), 'avgProgress']
      ],
      group: ['type'],
      raw: true
    });

    // ToR status distribution
    const torByStatus = await ToR.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Top performing countries
    const countryPerformance = await Country.findAll({
      attributes: [
        'id',
        'name',
        'code',
        [sequelize.fn('COUNT', sequelize.col('assignments.id')), 'activeAssignments']
      ],
      include: [{
        model: Assignment,
        as: 'assignments',
        attributes: [],
        where: { status: ['Active', 'Mobilising'] }
      }],
      group: ['Country.id', 'Country.name', 'Country.code'],
      order: [[sequelize.literal('"activeAssignments"'), 'DESC']],
      limit: 10,
      subQuery: false,
      raw: true
    });

    res.json({
      budgetStats: budgetStats[0] || { totalBudget: 0, totalSpend: 0, totalCommitted: 0 },
      taCoverageByPillar,
      assignmentsByStatus,
      indicatorProgress,
      torByStatus,
      countryPerformance
    });
  } catch (error) {
    next(error);
  }
};

export const getCountryDashboard = async (req, res, next) => {
  try {
    const { countryId } = req.params;
    const { pillar } = req.query;

    // Country overview
    const country = await Country.findByPk(countryId);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Active assignments
    const activeAssignments = await Assignment.findAll({
      where: {
        countryId,
        status: ['Active', 'Mobilising']
      },
      include: [
        { model: ToR, as: 'tor' },
        { model: Consultant, as: 'consultant' },
        { model: Workstream, as: 'workstream' }
      ],
      order: [['startDate', 'DESC']],
      limit: 20
    });

    // Budget and spend for country
    const countryBudgets = await Budget.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('allocatedAmount')), 'totalBudget'],
        [sequelize.fn('SUM', sequelize.col('actualSpend')), 'totalSpend'],
        [sequelize.fn('SUM', sequelize.col('committedAmount')), 'totalCommitted']
      ],
      include: [{
        model: Workstream,
        as: 'workstream',
        attributes: [],
        include: [{
          model: Programme,
          as: 'programme',
          attributes: [],
          where: { countryId }
        }]
      }],
      raw: true
    });

    // Indicators for country
    const countryIndicators = await Indicator.findAll({
      where: pillar ? { pillar } : {},
      include: [{
        model: Result,
        as: 'results',
        where: { countryId },
        required: false
      }]
    });

    res.json({
      country,
      activeAssignments,
      budgetStats: countryBudgets[0] || { totalBudget: 0, totalSpend: 0, totalCommitted: 0 },
      indicators: countryIndicators
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkstreamDashboard = async (req, res, next) => {
  try {
    const { workstreamId } = req.params;

    const workstream = await Workstream.findByPk(workstreamId, {
      include: [
        { model: Programme, as: 'programme' }
      ]
    });

    if (!workstream) {
      return res.status(404).json({ error: 'Workstream not found' });
    }

    // Assignments
    const assignments = await Assignment.findAll({
      where: { workstreamId },
      include: [
        { model: ToR, as: 'tor' },
        { model: Consultant, as: 'consultant' }
      ]
    });

    // Budget
    const budgets = await Budget.findAll({
      where: { workstreamId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('allocatedAmount')), 'totalBudget'],
        [sequelize.fn('SUM', sequelize.col('actualSpend')), 'totalSpend'],
        [sequelize.fn('SUM', sequelize.col('committedAmount')), 'totalCommitted']
      ],
      raw: true
    });

    // Indicators
    const indicators = await Indicator.findAll({
      where: { workstreamId },
      include: [{ model: Result, as: 'results' }]
    });

    res.json({
      workstream,
      assignments,
      budgetStats: budgets[0] || { totalBudget: 0, totalSpend: 0, totalCommitted: 0 },
      indicators
    });
  } catch (error) {
    next(error);
  }
};

export const getComprehensiveDashboard = async (req, res, next) => {
  try {
    // Get all active/mobilising assignments with full details
    const assignments = await Assignment.findAll({
      where: {
        status: {
          [Op.in]: ['Active', 'Mobilising', 'Planned']
        }
      },
      include: [
        {
          model: Consultant,
          as: 'consultant',
          attributes: ['id', 'firstName', 'lastName', 'email', 'expertise', 'nationality']
        },
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Workstream,
          as: 'workstream',
          attributes: ['id', 'name', 'pillar']
        },
        {
          model: ToR,
          as: 'tor',
          attributes: ['id', 'referenceNumber', 'title']
        }
      ],
      order: [['startDate', 'DESC']]
    });

    // Calculate LoE stats for each assignment
    const assignmentsWithStats = (assignments || []).map(assignment => {
      const actualLoE = parseFloat(assignment.actualLoE || 0);
      const contractedLoE = parseFloat(assignment.contractedLoE || 0);
      const burnRate = contractedLoE > 0 
        ? (actualLoE / contractedLoE) * 100 
        : 0;
      
      return {
        ...assignment.toJSON(),
        burnRate: Math.round(burnRate * 10) / 10,
        remainingLoE: Math.max(0, contractedLoE - actualLoE)
      };
    });

    // Get country-level assignment counts for map
    const countryAssignmentCounts = await Assignment.findAll({
      where: {
        status: {
          [Op.in]: ['Active', 'Mobilising']
        },
        countryId: {
          [Op.ne]: null
        }
      },
      attributes: [
        'countryId',
        [sequelize.fn('COUNT', sequelize.col('Assignment.id')), 'count']
      ],
      include: [
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'name', 'code']
        }
      ],
      group: ['countryId', 'country.id', 'country.name', 'country.code'],
      raw: false
    });

    // Enhanced metrics
    const assignmentsArray = assignments || [];
    const totalActive = assignmentsArray.filter(a => a.status === 'Active').length;
    const countriesEngaged = new Set(assignmentsArray.filter(a => a.countryId).map(a => a.countryId)).size;
    const totalTAValue = assignmentsArray.reduce((sum, a) => sum + parseFloat(a.totalValue || 0), 0);
    const avgBurnRate = assignmentsArray.length > 0
      ? assignmentsArray.reduce((sum, a) => {
          const actualLoE = parseFloat(a.actualLoE || 0);
          const contractedLoE = parseFloat(a.contractedLoE || 0);
          const burnRate = contractedLoE > 0 
            ? (actualLoE / contractedLoE) * 100 
            : 0;
          return sum + burnRate;
        }, 0) / assignmentsArray.length
      : 0;
    
    // Upcoming completions (ending this month)
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    const upcomingCompletions = assignmentsArray.filter(a => {
      if (!a.endDate) return false;
      const endDate = new Date(a.endDate);
      return endDate <= endOfMonth && endDate >= new Date();
    }).length;

    // Unique consultants deployed
    const consultantsDeployed = new Set(assignmentsArray.filter(a => a.consultantId).map(a => a.consultantId)).size;

    // Recent activities - last 20 actions
    const recentActivities = [];

    // ToR approvals in last 3 months
    const recentToRApprovals = await ToR.findAll({
      where: {
        status: 'Approved',
        approvedDate: {
          [Op.gte]: subMonths(new Date(), 3)
        }
      },
      include: [
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['approvedDate', 'DESC']],
      limit: 10
    });

    recentToRApprovals.forEach(tor => {
      recentActivities.push({
        type: 'tor_approved',
        title: `ToR Approved: ${tor.title}`,
        timestamp: tor.approvedDate,
        actor: tor.approver ? `${tor.approver.firstName} ${tor.approver.lastName}` : 'System',
        relatedId: tor.id,
        relatedType: 'tor'
      });
    });

    // Recent assignment mobilisations
    const recentMobilisations = await Assignment.findAll({
      where: {
        mobilisationDate: {
          [Op.gte]: subMonths(new Date(), 3),
          [Op.ne]: null
        }
      },
      include: [
        {
          model: Consultant,
          as: 'consultant',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['mobilisationDate', 'DESC']],
      limit: 10
    });

    recentMobilisations.forEach(assignment => {
      recentActivities.push({
        type: 'assignment_mobilised',
        title: `Assignment Mobilised: ${assignment.title}`,
        timestamp: assignment.mobilisationDate,
        actor: assignment.consultant ? `${assignment.consultant.firstName} ${assignment.consultant.lastName}` : 'Unknown',
        relatedId: assignment.id,
        relatedType: 'assignment'
      });
    });

    // Recent deliverable submissions
    const recentDeliverables = await Deliverable.findAll({
      where: {
        submittedDate: {
          [Op.gte]: subMonths(new Date(), 3),
          [Op.ne]: null
        }
      },
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title']
        }
      ],
      order: [['submittedDate', 'DESC']],
      limit: 10
    });

    recentDeliverables.forEach(deliverable => {
      recentActivities.push({
        type: 'deliverable_submitted',
        title: `Deliverable Submitted: ${deliverable.title}`,
        timestamp: deliverable.submittedDate,
        actor: 'Consultant',
        relatedId: deliverable.id,
        relatedType: 'deliverable'
      });
    });

    // Recent risks raised
    const recentRisks = await Risk.findAll({
      where: {
        createdAt: {
          [Op.gte]: subMonths(new Date(), 3)
        }
      },
      include: [
        {
          model: User,
          as: 'raiser',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    recentRisks.forEach(risk => {
      recentActivities.push({
        type: 'risk_raised',
        title: `Risk Raised: ${risk.title}`,
        timestamp: risk.createdAt,
        actor: risk.raiser ? `${risk.raiser.firstName} ${risk.raiser.lastName}` : 'System',
        relatedId: risk.id,
        relatedType: 'risk'
      });
    });

    // Sort all activities by timestamp and take top 20
    recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const topActivities = recentActivities.slice(0, 20);

    // Calculate financial totals across all assignments
    let totalFees = 0;
    let totalExpenses = 0;
    
    // Get all expenses for active assignments
    const allExpenses = await Expense.findAll({
      where: {
        assignmentId: {
          [Op.in]: assignmentsArray.map(a => a.id).filter(Boolean)
        }
      }
    });
    totalExpenses = allExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    
    // Calculate fees from LoE entries and stored fees
    // Optimize: Fetch all fees in one query instead of N queries
    const assignmentIds = assignmentsArray.map(a => a.id).filter(Boolean);
    const allStoredFees = assignmentIds.length > 0 
      ? await Fee.findAll({
          where: { assignmentId: { [Op.in]: assignmentIds } }
        })
      : [];
    
    // Create a map of assignmentId -> fees for quick lookup
    const feesByAssignment = allStoredFees.reduce((acc, fee) => {
      if (!acc[fee.assignmentId]) {
        acc[fee.assignmentId] = [];
      }
      acc[fee.assignmentId].push(fee);
      return acc;
    }, {});

    // Calculate fees for each assignment
    for (const assignment of assignmentsArray) {
      // Fees from LoE entries
      const dailyRate = parseFloat(assignment.dailyRate) || 0;
      if (assignment.loeEntries && assignment.loeEntries.length > 0) {
        const loeFees = assignment.loeEntries.reduce((sum, loe) => 
          sum + (parseFloat(loe.days || 0) * dailyRate), 0
        );
        totalFees += loeFees;
      }
      
      // Stored fees from the pre-fetched map
      const storedFees = feesByAssignment[assignment.id] || [];
      totalFees += storedFees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
    }

    const grandTotal = totalFees + totalExpenses;

    res.json({
      assignments: assignmentsWithStats,
      countryAssignmentCounts,
      metrics: {
        totalActive,
        countriesEngaged,
        totalTAValue: Math.round(grandTotal), // Updated to include expenses
        totalFees: Math.round(totalFees),
        totalExpenses: Math.round(totalExpenses),
        avgBurnRate: Math.round(avgBurnRate * 10) / 10,
        upcomingCompletions,
        consultantsDeployed
      },
      recentActivities: topActivities
    });
  } catch (error) {
    next(error);
  }
};

