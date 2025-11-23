import { Risk, Programme, Workstream, User } from '../models/index.js';
import { getPaginationParams, getPaginatedResponse } from '../utils/pagination.js';
import { buildWhereClause } from '../utils/filters.js';

export const getRisks = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const where = buildWhereClause(req.query, ['status', 'category', 'programmeId', 'workstreamId']);

    const { count, rows } = await Risk.findAndCountAll({
      where,
      include: [
        { model: Programme, as: 'programme' },
        { model: Workstream, as: 'workstream' },
        { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'raiser', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      limit,
      offset,
      order: [['riskScore', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json(getPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getRiskById = async (req, res, next) => {
  try {
    const risk = await Risk.findByPk(req.params.id, {
      include: [
        { model: Programme, as: 'programme' },
        { model: Workstream, as: 'workstream' },
        { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'raiser', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    if (!risk) {
      return res.status(404).json({ error: 'Risk not found' });
    }

    res.json({ risk });
  } catch (error) {
    next(error);
  }
};

export const createRisk = async (req, res, next) => {
  try {
    const risk = await Risk.create({
      ...req.body,
      raisedBy: req.user.id
    });

    const fullRisk = await Risk.findByPk(risk.id, {
      include: [
        { model: Programme, as: 'programme' },
        { model: Workstream, as: 'workstream' },
        { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({ risk: fullRisk });
  } catch (error) {
    next(error);
  }
};

export const updateRisk = async (req, res, next) => {
  try {
    const risk = await Risk.findByPk(req.params.id);

    if (!risk) {
      return res.status(404).json({ error: 'Risk not found' });
    }

    await risk.update(req.body);
    const updatedRisk = await Risk.findByPk(risk.id, {
      include: [
        { model: Programme, as: 'programme' },
        { model: Workstream, as: 'workstream' },
        { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.json({ risk: updatedRisk });
  } catch (error) {
    next(error);
  }
};

export const deleteRisk = async (req, res, next) => {
  try {
    const risk = await Risk.findByPk(req.params.id);

    if (!risk) {
      return res.status(404).json({ error: 'Risk not found' });
    }

    await risk.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getRiskMatrix = async (req, res, next) => {
  try {
    const { programmeId } = req.query;
    const where = { status: 'Open' };
    
    if (programmeId) where.programmeId = programmeId;

    const risks = await Risk.findAll({
      where,
      attributes: ['id', 'title', 'likelihood', 'impact', 'riskScore', 'category'],
      include: [
        { model: Programme, as: 'programme', attributes: ['id', 'name'] }
      ]
    });

    // Group by risk score for matrix display
    const matrix = {};
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        const score = i * j;
        if (!matrix[score]) matrix[score] = [];
        matrix[score].push(...risks.filter(r => r.likelihood === i && r.impact === j));
      }
    }

    res.json({ risks, matrix });
  } catch (error) {
    next(error);
  }
};

