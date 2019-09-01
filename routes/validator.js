const Joi = require('joi');
const createError = require('http-errors');
const { uniq } = require('lodash');

const config = require('./validator.config');

Joi.objectId = require('joi-objectid')(Joi);

const articleSchema = Object
  .assign(...config.articleFields.map((prop) => {
    if (prop === 'tags') {
      return { [prop]: Joi.array().items(Joi.string().min(2)).required() };
    }

    return { [prop]: Joi.string().min(2).required() };
  }));

const getSlugsSchema = slugsArray => Object
  .assign(...slugsArray.map(slug => ({ [slug]: Joi.string().regex(/^[a-z0-9-]+$/) })));

const articleSlugsSchema = {
  categorySlug: Joi.string().regex(/^[a-z0-9-]+$/).required(),
  articleSlug: Joi.string().regex(/^[a-z0-9-]+$/).required(),
};

const categorySlugSchema = {
  categorySlug: Joi.string().regex(/^[a-z0-9-]+$/).required(),
};

const validateSlugs = (slugsArray) => {
  const slugsSchema = getSlugsSchema(slugsArray);
  return (req, res, next) => {
    const { error } = Joi.validate(req.params, slugsSchema);

    if (error) {
      return next(createError(400, 'Bad request'));
    }
    return next();
  };
};

const validateArticle = (isErrorThrowing = true) => (req, res, next) => {
  const { error: err } = Joi.validate(req.params, {
    articleId: Joi.objectId().required(),
  });

  if (err) {
    return next(createError(400, 'Bad request'));
  }

  const { body } = req;
  const { error } = Joi.validate(body, articleSchema);
  if (error) {
    const erroredFields = uniq(error.details.map(element => element.path[0]));
    erroredFields
      .forEach(field => req.flash('success', `Пустое значение в поле ${field.toUpperCase()}`));

    if (isErrorThrowing) {
      res.status(400);
      return res.redirect('back');
    }
  }

  return next();
};

const validateArticleId = (req, res, next) => {
  const { error } = Joi.validate(req.params, {
    articleId: Joi.objectId().required(),
  });

  if (error) {
    return next(createError(400, 'Bad request'));
  }
  return next();
};

const validateArticleSlugs = (slugs) => {
  const { error } = Joi.validate(slugs, articleSlugsSchema);
  return { error };
};

const validateCategorySlug = (slug) => {
  const { error } = Joi.validate(slug, categorySlugSchema);
  return { error };
};

module.exports = {
  validateArticleId,
  validateArticle,
  validateSlugs,
  validateArticleSlugs,
  validateCategorySlug,
};
