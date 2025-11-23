import { safeParseInt } from './numbers.js';

export const getPaginationParams = (req) => {
  const page = Math.max(1, safeParseInt(req.query.page, 1));
  const limit = Math.max(1, Math.min(100, safeParseInt(req.query.limit, 20))); // Max 100 items per page
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

export const getPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};

