const { check, validationResult, param } = require('express-validator/check');
const createError = require('http-errors');

const { mapValidationErrorsForFlash } = require('../utils/helpers');

const testForErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.validationErrors = mapValidationErrorsForFlash(errors);
    return next(createError(400, 'Bad request'));
  }
  return next();
};

const ifErrorsRedirectBackWith400 = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.mapped())
    return next(createError(400, 'Bad request'));
  }
  return next();
};

const flashErrors = (req, res, next) => {
  const { back } = req.query;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.validationErrors = mapValidationErrorsForFlash(errors, 'success');
    if (back) {
      return res.redirect('back');
    }
  }
  return next();
};

const validateArticleId = [
  check('articleId').isMongoId(),
  testForErrors,
];

const validateSlugs = slugsArray => slugsArray
  .map(slug => [
    param(slug).not().isEmpty(),
    param(slug).matches(/^[a-z0-9-]+$/i),
  ]);

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
].map(item => check(item).not().isEmpty()
  .withMessage(`Пустое значение в поле ${item.toUpperCase()}`));

module.exports = {
  validateArticleId,
  validateArticle,
  validateSlugs,
  flashErrors,
  ifErrorsRedirectBackWith400,
};
