import { ToR, Workstream, Country, Assignment, User } from '../models/index.js';
import { getPaginationParams, getPaginatedResponse } from '../utils/pagination.js';
import { buildWhereClause } from '../utils/filters.js';
import { TOR_STATUS } from '../config/constants.js';

export const getTors = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const where = buildWhereClause(req.query, ['status', 'workstreamId', 'countryId']);

    const { count, rows } = await ToR.findAndCountAll({
      where,
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json(getPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getTorById = async (req, res, next) => {
  try {
    const tor = await ToR.findByPk(req.params.id, {
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Assignment, as: 'assignments' }
      ]
    });

    if (!tor) {
      return res.status(404).json({ error: 'ToR not found' });
    }

    res.json({ tor });
  } catch (error) {
    next(error);
  }
};

export const createTor = async (req, res, next) => {
  try {
    const torData = {
      ...req.body,
      createdBy: req.user.id,
      status: TOR_STATUS.DRAFT
    };

    const tor = await ToR.create(torData);
    const fullTor = await ToR.findByPk(tor.id, {
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' }
      ]
    });

    res.status(201).json({ tor: fullTor });
  } catch (error) {
    next(error);
  }
};

export const updateTor = async (req, res, next) => {
  try {
    const tor = await ToR.findByPk(req.params.id);

    if (!tor) {
      return res.status(404).json({ error: 'ToR not found' });
    }

    // Only allow updates if status is Draft or QA
    if (![TOR_STATUS.DRAFT, TOR_STATUS.QA].includes(tor.status)) {
      return res.status(400).json({ error: 'Cannot update ToR in current status' });
    }

    await tor.update(req.body);
    const updatedTor = await ToR.findByPk(tor.id, {
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' }
      ]
    });

    res.json({ tor: updatedTor });
  } catch (error) {
    next(error);
  }
};

export const approveTor = async (req, res, next) => {
  try {
    const tor = await ToR.findByPk(req.params.id);

    if (!tor) {
      return res.status(404).json({ error: 'ToR not found' });
    }

    if (tor.status !== TOR_STATUS.PENDING_APPROVAL) {
      return res.status(400).json({ error: 'ToR is not pending approval' });
    }

    await tor.update({
      status: TOR_STATUS.APPROVED,
      approvedBy: req.user.id,
      approvedDate: new Date()
    });

    const updatedTor = await ToR.findByPk(tor.id, {
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' },
        { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.json({ tor: updatedTor });
  } catch (error) {
    next(error);
  }
};

export const rejectTor = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const tor = await ToR.findByPk(req.params.id);

    if (!tor) {
      return res.status(404).json({ error: 'ToR not found' });
    }

    if (tor.status !== TOR_STATUS.PENDING_APPROVAL) {
      return res.status(400).json({ error: 'ToR is not pending approval' });
    }

    await tor.update({
      status: TOR_STATUS.REJECTED,
      rejectionReason,
      approvedBy: req.user.id,
      approvedDate: new Date()
    });

    const updatedTor = await ToR.findByPk(tor.id, {
      include: [
        { model: Workstream, as: 'workstream' },
        { model: Country, as: 'country' }
      ]
    });

    res.json({ tor: updatedTor });
  } catch (error) {
    next(error);
  }
};

export const submitForApproval = async (req, res, next) => {
  try {
    const tor = await ToR.findByPk(req.params.id);

    if (!tor) {
      return res.status(404).json({ error: 'ToR not found' });
    }

    if (tor.status !== TOR_STATUS.QA) {
      return res.status(400).json({ error: 'ToR must be in QA status before submitting for approval' });
    }

    await tor.update({ status: TOR_STATUS.PENDING_APPROVAL });

    res.json({ tor });
  } catch (error) {
    next(error);
  }
};

export const deleteTor = async (req, res, next) => {
  try {
    const tor = await ToR.findByPk(req.params.id);

    if (!tor) {
      return res.status(404).json({ error: 'ToR not found' });
    }

    if (tor.status !== TOR_STATUS.DRAFT) {
      return res.status(400).json({ error: 'Can only delete draft ToRs' });
    }

    await tor.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

