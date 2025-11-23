import { Indicator, Result, Evidence, Workstream, Programme, Country } from '../models/index.js';
import { getPaginationParams, getPaginatedResponse } from '../utils/pagination.js';
import { buildWhereClause } from '../utils/filters.js';

export const getIndicators = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const where = buildWhereClause(req.query, ['type', 'pillar', 'workstreamId', 'programmeId']);

    const { count, rows } = await Indicator.findAndCountAll({
      where,
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Programme, as: 'programme' },
        { model: Indicator, as: 'parentIndicator' },
        { model: Indicator, as: 'childIndicators' }
      ],
      limit,
      offset,
      order: [['code', 'ASC']]
    });

    res.json(getPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getIndicatorById = async (req, res, next) => {
  try {
    const indicator = await Indicator.findByPk(req.params.id, {
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Programme, as: 'programme' },
        { model: Indicator, as: 'parentIndicator' },
        { model: Indicator, as: 'childIndicators' },
        { 
          model: Result, 
          as: 'results',
          include: [{ model: Country, as: 'country' }],
          order: [['reportingDate', 'DESC']]
        },
        { 
          model: Evidence, 
          as: 'evidence',
          through: { attributes: [] }
        }
      ]
    });

    if (!indicator) {
      return res.status(404).json({ error: 'Indicator not found' });
    }

    // Calculate progress
    const progress = indicator.target > 0 ? (indicator.actual / indicator.target) * 100 : 0;

    res.json({ 
      indicator,
      progress: progress.toFixed(2)
    });
  } catch (error) {
    next(error);
  }
};

export const createIndicator = async (req, res, next) => {
  try {
    const indicator = await Indicator.create(req.body);
    const fullIndicator = await Indicator.findByPk(indicator.id, {
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Programme, as: 'programme' }
      ]
    });

    res.status(201).json({ indicator: fullIndicator });
  } catch (error) {
    next(error);
  }
};

export const updateIndicator = async (req, res, next) => {
  try {
    const indicator = await Indicator.findByPk(req.params.id);

    if (!indicator) {
      return res.status(404).json({ error: 'Indicator not found' });
    }

    await indicator.update(req.body);
    res.json({ indicator });
  } catch (error) {
    next(error);
  }
};

export const deleteIndicator = async (req, res, next) => {
  try {
    const indicator = await Indicator.findByPk(req.params.id);

    if (!indicator) {
      return res.status(404).json({ error: 'Indicator not found' });
    }

    await indicator.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const indicator = await Indicator.findByPk(id);

    if (!indicator) {
      return res.status(404).json({ error: 'Indicator not found' });
    }

    const result = await Result.create({
      ...req.body,
      indicatorId: id,
      reportedBy: req.user.id
    });

    // Update indicator's actual value
    await indicator.increment('actual', { by: parseFloat(req.body.value) });

    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

