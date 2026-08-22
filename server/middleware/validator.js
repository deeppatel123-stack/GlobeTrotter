const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(422).json({
      success: false,
      message: extractedErrors[0]?.message || 'Validation failed',
      errors: extractedErrors,
      data: null,
    });
  }
  next();
};

module.exports = { validate };
