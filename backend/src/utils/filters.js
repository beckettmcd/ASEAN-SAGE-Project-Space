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
      const startDate = new Date(query.startDate);
      if (isNaN(startDate.getTime())) {
        throw new Error('Invalid startDate format. Expected ISO 8601 date string.');
      }
      where.createdAt[Op.gte] = startDate;
    }
    if (query.endDate) {
      const endDate = new Date(query.endDate);
      if (isNaN(endDate.getTime())) {
        throw new Error('Invalid endDate format. Expected ISO 8601 date string.');
      }
      where.createdAt[Op.lte] = endDate;
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

