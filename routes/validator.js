const { check, validationResult } = require('express-validator/check');
const createError = require('http-errors');

const { mapValidationErrorsForFlash } = require('../utils/common');

const testForErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.validationErrors = mapValidationErrorsForFlash(errors);
    return next(createError(400, 'Bad request'));
  }
  return next();
};

const flashErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.validationErrors = mapValidationErrorsForFlash(errors);
  }
  return next();
};

const validateArticleId = [
  check('articleId').isMongoId(),
  testForErrors,
];

const validateArticle = [
  'body',
  'category',
  'description',
  'h1',
  'keywords',
  'postimage',
  'slug',
  'tags',
  'title',
].map(item => check(item).not().isEmpty());

module.exports = {
  validateArticleId,
  validateArticle,
  flashErrors,
};
