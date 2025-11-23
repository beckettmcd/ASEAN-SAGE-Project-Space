import { Op } from 'sequelize';

export const buildWhereClause = (query, allowedFilters) => {
  const where = {};

  allowedFilters.forEach(filter => {
    if (query[filter]) {
      if (Array.isArray(query[filter])) {
        where[filter] = { [Op.in]: query[filter] };
      } else {
        where[filter] = query[filter];
      }
    }
  });

  // Handle date ranges
  if (query.startDate || query.endDate) {
    where.createdAt = {};
    if (query.startDate) {
      where.createdAt[Op.gte] = new Date(query.startDate);
    }
    if (query.endDate) {
      where.createdAt[Op.lte] = new Date(query.endDate);
    }
  }

  // Handle search
  if (query.search) {
    // This would be customized per entity
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query.search}%` } },
      { title: { [Op.iLike]: `%${query.search}%` } },
      { description: { [Op.iLike]: `%${query.search}%` } }
    ];
  }

  return where;
};

