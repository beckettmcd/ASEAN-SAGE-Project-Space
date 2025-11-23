import { Assignment, ToR, Consultant, Workstream, Country, LoEEntry, Deliverable } from '../models/index.js';
import { getPaginationParams, getPaginatedResponse } from '../utils/pagination.js';
import { buildWhereClause } from '../utils/filters.js';

export const getAssignments = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const where = buildWhereClause(req.query, ['status', 'workstreamId', 'countryId', 'consultantId']);

    const { count, rows } = await Assignment.findAndCountAll({
      where,
      include: [
        { model: ToR, as: 'tor' },
        { model: Consultant, as: 'consultant' },
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' }
      ],
      limit,
      offset,
      order: [['startDate', 'DESC']]
    });

    res.json(getPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [
        { model: ToR, as: 'tor' },
        { model: Consultant, as: 'consultant' },
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' },
        { model: LoEEntry, as: 'loeEntries', order: [['entryDate', 'DESC']] },
        { model: Deliverable, as: 'deliverables' }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Calculate LoE burn rate
    const totalLoEUsed = assignment.loeEntries?.reduce((sum, entry) => sum + parseFloat(entry.days || 0), 0) || 0;
    const contractedLoE = parseFloat(assignment.contractedLoE) || 0;
    const burnRate = contractedLoE > 0 ? (totalLoEUsed / contractedLoE) * 100 : 0;

    res.json({ 
      assignment,
      stats: {
        totalLoEUsed,
        burnRate: burnRate.toFixed(2),
        remainingLoE: Math.max(0, contractedLoE - totalLoEUsed)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.create(req.body);
    const fullAssignment = await Assignment.findByPk(assignment.id, {
      include: [
        { model: ToR, as: 'tor' },
        { model: Consultant, as: 'consultant' },
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' }
      ]
    });

    res.status(201).json({ assignment: fullAssignment });
  } catch (error) {
    next(error);
  }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await assignment.update(req.body);
    const updatedAssignment = await Assignment.findByPk(assignment.id, {
      include: [
        { model: ToR, as: 'tor' },
        { model: Consultant, as: 'consultant' },
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' }
      ]
    });

    res.json({ assignment: updatedAssignment });
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await assignment.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

