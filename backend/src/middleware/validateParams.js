// UUID v4 regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validate if a string is a valid UUID
 */
const isValidUUID = (str) => {
  return str && typeof str === 'string' && UUID_REGEX.test(str);
};

/**
 * Middleware to validate UUID parameters
 * Validates req.params.id and returns 400 if invalid
 */
export const validateUUID = (req, res, next) => {
  if (req.params.id && !isValidUUID(req.params.id)) {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'ID must be a valid UUID'
    });
  }
  next();
};

/**
 * Middleware to validate multiple UUID parameters
 * @param {string[]} paramNames - Array of parameter names to validate
 */
export const validateUUIDs = (paramNames) => {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const value = req.params[paramName];
      if (value && !isValidUUID(value)) {
        return res.status(400).json({
          error: 'Invalid ID format',
          message: `${paramName} must be a valid UUID`
        });
      }
    }
    next();
  };
};

