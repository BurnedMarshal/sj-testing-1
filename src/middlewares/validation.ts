import { validationResult } from 'express-validator/check';

module.exports.basicValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrorMessage = {
      errors: errors.array(),
      status: 400,
    };
    next(validationErrorMessage);
  }
  next();
};
