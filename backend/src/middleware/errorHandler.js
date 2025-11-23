export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize Validation Errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors?.map(e => ({
        field: e.path,
        message: e.message
      })) || []
    });
  }

  // Sequelize Unique Constraint Errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Duplicate entry',
      details: err.errors?.map(e => ({
        field: e.path,
        message: `${e.path} already exists`
      })) || []
    });
  }

  // Sequelize Foreign Key Constraint Errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid reference',
      message: 'The referenced record does not exist'
    });
  }

  // Sequelize Database Errors
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      error: 'Database error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'A database error occurred'
    });
  }

  // Sequelize Connection Errors
  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    return res.status(503).json({
      error: 'Database connection error',
      message: 'Unable to connect to the database. Please try again later.'
    });
  }

  // Sequelize Timeout Errors
  if (err.name === 'SequelizeTimeoutError') {
    return res.status(504).json({
      error: 'Database timeout',
      message: 'The database operation timed out. Please try again.'
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Invalid authentication token',
      message: err.message || 'Authentication token is invalid or expired'
    });
  }

  // Custom application errors with status codes
  if (err.status) {
    return res.status(err.status).json({
      error: err.message || 'An error occurred'
    });
  }

  // Default error handler
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' 
      ? err.message || 'Internal server error'
      : 'Internal server error'
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
};

