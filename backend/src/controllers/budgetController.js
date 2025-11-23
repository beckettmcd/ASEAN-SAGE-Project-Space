import { Budget, Workstream, Programme, Commitment, Invoice } from '../models/index.js';
import { getPaginationParams, getPaginatedResponse } from '../utils/pagination.js';
import { buildWhereClause } from '../utils/filters.js';
import { sequelize } from '../models/index.js';

export const getBudgets = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const where = buildWhereClause(req.query, ['fiscalYear', 'workstreamId', 'programmeId', 'isPBRFlagged']);

    const { count, rows } = await Budget.findAndCountAll({
      where,
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Programme, as: 'programme' }
      ],
      limit,
      offset,
      order: [['fiscalYear', 'DESC'], ['code', 'ASC']]
    });

    res.json(getPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id, {
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Programme, as: 'programme' },
        { model: Commitment, as: 'commitments' }
      ]
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Calculate variance and burn rate
    const allocatedAmount = parseFloat(budget.allocatedAmount) || 0;
    const actualSpend = parseFloat(budget.actualSpend) || 0;
    const variance = allocatedAmount - actualSpend;
    const variancePercentage = allocatedAmount > 0 ? (variance / allocatedAmount) * 100 : 0;
    const burnRate = allocatedAmount > 0 ? (actualSpend / allocatedAmount) * 100 : 0;

    res.json({ 
      budget,
      stats: {
        variance: variance.toFixed(2),
        variancePercentage: variancePercentage.toFixed(2),
        burnRate: burnRate.toFixed(2),
        available: (parseFloat(budget.allocatedAmount) - parseFloat(budget.committedAmount)).toFixed(2)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createBudget = async (req, res, next) => {
  try {
    const budget = await Budget.create(req.body);
    const fullBudget = await Budget.findByPk(budget.id, {
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Programme, as: 'programme' }
      ]
    });

    res.status(201).json({ budget: fullBudget });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id);

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await budget.update(req.body);
    res.json({ budget });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id);

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await budget.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getBudgetSummary = async (req, res, next) => {
  try {
    const { fiscalYear, programmeId } = req.query;
    const where = {};
    
    if (fiscalYear) where.fiscalYear = fiscalYear;
    if (programmeId) where.programmeId = programmeId;

    const summary = await Budget.findAll({
      where,
      attributes: [
        'fiscalYear',
        [sequelize.fn('SUM', sequelize.col('allocatedAmount')), 'totalAllocated'],
        [sequelize.fn('SUM', sequelize.col('committedAmount')), 'totalCommitted'],
        [sequelize.fn('SUM', sequelize.col('actualSpend')), 'totalSpend'],
        [sequelize.fn('SUM', sequelize.col('forecast')), 'totalForecast']
      ],
      group: ['fiscalYear'],
      raw: true
    });

    res.json({ summary });
  } catch (error) {
    next(error);
  }
};

