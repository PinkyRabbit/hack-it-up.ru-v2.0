const createError  = require('http-errors');

const Posts = require('../db/posts');

const article = async (req, res, next) => {
  const { articleId } = req.params;

  const requestedArticle = await Posts.getById(articleId);
  if (!requestedArticle) {
    return next(createError(404, 'Not found'));
  }

  req.session.article = requestedArticle;
  return next();
};

const fullArticle = async (req, res, next) => {
  const {
    articleSlug,
    categorySlug,
  } = req.params;

  const requestedArticle = await Posts.getOneBySlugWithRelations(articleSlug);
  if (
    !requestedArticle
    || !requestedArticle.category
    || !requestedArticle.category.slug
    || requestedArticle.category.slug !== categorySlug
  ) {
    return next(createError(404, 'Not found'));
  }

  req.session.article = requestedArticle;
  return next();
};

module.exports = {
  article,
  fullArticle,
};
