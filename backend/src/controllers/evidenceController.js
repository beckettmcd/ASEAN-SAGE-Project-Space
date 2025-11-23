import { Evidence, Deliverable, Indicator, Country } from '../models/index.js';
import { getPaginationParams, getPaginatedResponse } from '../utils/pagination.js';
import { buildWhereClause } from '../utils/filters.js';

export const getEvidence = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const where = buildWhereClause(req.query, ['type', 'countryId', 'deliverableId']);

    const { count, rows } = await Evidence.findAndCountAll({
      where,
      include: [
        { model: Deliverable, as: 'deliverable' },
        { model: Country, as: 'country' },
        { 
          model: Indicator, 
          as: 'indicators',
          through: { attributes: [] }
        }
      ],
      limit,
      offset,
      order: [['collectionDate', 'DESC']]
    });

    res.json(getPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getEvidenceById = async (req, res, next) => {
  try {
    const evidence = await Evidence.findByPk(req.params.id, {
      include: [
        { model: Deliverable, as: 'deliverable' },
        { model: Country, as: 'country' },
        { 
          model: Indicator, 
          as: 'indicators',
          through: { attributes: [] }
        }
      ]
    });

    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    res.json({ evidence });
  } catch (error) {
    next(error);
  }
};

export const createEvidence = async (req, res, next) => {
  try {
    const { indicatorIds, ...evidenceData } = req.body;
    
    const evidence = await Evidence.create(evidenceData);

    // Link to indicators if provided
    if (indicatorIds && indicatorIds.length > 0) {
      const indicators = await Indicator.findAll({
        where: { id: indicatorIds }
      });
      await evidence.setIndicators(indicators);
    }

    const fullEvidence = await Evidence.findByPk(evidence.id, {
      include: [
        { model: Deliverable, as: 'deliverable' },
        { model: Country, as: 'country' },
        { 
          model: Indicator, 
          as: 'indicators',
          through: { attributes: [] }
        }
      ]
    });

    res.status(201).json({ evidence: fullEvidence });
  } catch (error) {
    next(error);
  }
};

export const updateEvidence = async (req, res, next) => {
  try {
    const evidence = await Evidence.findByPk(req.params.id);

    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    const { indicatorIds, ...updateData } = req.body;
    await evidence.update(updateData);

    // Update indicator links if provided
    if (indicatorIds) {
      const indicators = await Indicator.findAll({
        where: { id: indicatorIds }
      });
      await evidence.setIndicators(indicators);
    }

    const updatedEvidence = await Evidence.findByPk(evidence.id, {
      include: [
        { model: Deliverable, as: 'deliverable' },
        { 
          model: Indicator, 
          as: 'indicators',
          through: { attributes: [] }
        }
      ]
    });

    res.json({ evidence: updatedEvidence });
  } catch (error) {
    next(error);
  }
};

export const deleteEvidence = async (req, res, next) => {
  try {
    const evidence = await Evidence.findByPk(req.params.id);

    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    await evidence.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const linkToIndicator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { indicatorId } = req.body;

    const evidence = await Evidence.findByPk(id);
    const indicator = await Indicator.findByPk(indicatorId);

    if (!evidence || !indicator) {
      return res.status(404).json({ error: 'Evidence or Indicator not found' });
    }

    await evidence.addIndicator(indicator);

    res.json({ message: 'Evidence linked to indicator successfully' });
  } catch (error) {
    next(error);
  }
};

