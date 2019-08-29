const express = require('express');

const articleController = require('../controllers/article');
const use = require('./use');
const {
  validateSlugs,
  ifErrorsRedirectBackWith400,
} = require('./validator');

const publicRouter = express.Router();

publicRouter
  .get('/', getNews)
  .get('/csrf', csrf)
  .get(
    '/:categorySlug/:articleSlug',
    validateSlugs(['categorySlug', 'articleSlug']),
    ifErrorsRedirectBackWith400,
    use.fullArticle,
    articlePage,
  )
  .get(
    '/:categorySlug',
    validateSlugs(['categorySlug']),
    ifErrorsRedirectBackWith400,
    newsInCategory
  );
  // .get('/article/search', search)
  // .get('/tags/', tagsList)
  // .post('/comment/:articleSlug', newComment)
  // .get('/login', loginPage)
  // .post('/login', authorization);

async function csrf(req, res) {
  const token = req.csrfToken();
  res.send(token);
}

async function getNews(req, res, next) {
  const { query } = req;
  const { news, pagination, seo } = await articleController.getNews(query);

  if (!news.length && query) {
    return next();
  }

  return res.render('public/posts', {
    google: true,
    sidebar: true,
    news,
    pagination,
    ...seo,
  });
}

async function newsInCategory(req, res, next) {
  const { query } = req;
  const { categorySlug } = req.params;
  const { news, pagination, seo } = await articleController
    .getCategoryNews(query, categorySlug);

  if (!news.length && query) {
    return next();
  }

  return res.render('public/posts', {
    google: true,
    sidebar: true,
    news,
    pagination,
    ...seo,
  });
}

async function articlePage(req, res) {
  const { article } = req.session;

  return res.render('public/article', {
    ...article,
    sidebar: true,
    google: true,
    _csrf: req.csrfToken(),
  });
}

async function search(req, res, next) {
  return next();
}

async function tagsList(req, res, next) {
  return next();
}

async function newComment(req, res, next) {
  return next();
}

async function loginPage(req, res, next) {
  return next();
}

async function authorization(req, res, next) {
  return next();
}

module.exports = publicRouter;
