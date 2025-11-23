import { getPaginationParams, getPaginatedResponse } from '../utils/pagination.js';
import { buildWhereClause } from '../utils/filters.js';

// Generic controller factory for simple CRUD operations
export const createGenericController = (Model, options = {}) => {
  const { 
    include = [], 
    allowedFilters = [], 
    orderBy = [['createdAt', 'DESC']] 
  } = options;

  return {
    getAll: async (req, res, next) => {
      try {
        const { page, limit, offset } = getPaginationParams(req);
        const where = buildWhereClause(req.query, allowedFilters);

        const { count, rows } = await Model.findAndCountAll({
          where,
          include,
          limit,
          offset,
          order: orderBy
        });

        res.json(getPaginatedResponse(rows, count, page, limit));
      } catch (error) {
        next(error);
      }
    },

    getById: async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id, { include });

        if (!item) {
          return res.status(404).json({ error: `${Model.name} not found` });
        }

        res.json({ [Model.name.toLowerCase()]: item });
      } catch (error) {
        next(error);
      }
    },

    create: async (req, res, next) => {
      try {
        const item = await Model.create(req.body);
        const fullItem = await Model.findByPk(item.id, { include });

        res.status(201).json({ [Model.name.toLowerCase()]: fullItem });
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id);

        if (!item) {
          return res.status(404).json({ error: `${Model.name} not found` });
        }

        await item.update(req.body);
        const updated = await Model.findByPk(item.id, { include });

        res.json({ [Model.name.toLowerCase()]: updated });
      } catch (error) {
        next(error);
      }
    },

    remove: async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id);

        if (!item) {
          return res.status(404).json({ error: `${Model.name} not found` });
        }

        await item.destroy();
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  };
};

