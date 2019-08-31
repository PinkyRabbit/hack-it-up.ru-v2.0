const express = require('express');
const { isEmpty } = require('lodash');

const articleController = require('../controllers/article');
const use = require('./use');
const { validateSlugs } = require('./validator');

const publicRouter = express.Router();

publicRouter
  .get('/', getNews)
  .get('/csrf', csrf)
  .get(
    '/:categorySlug/:articleSlug',
    validateSlugs(['categorySlug', 'articleSlug'], true),
    use.fullArticle,
    articlePage,
  )
  .get(
    '/:categorySlug',
    validateSlugs(['categorySlug'], true),
    newsInCategory,
  )
  .get(
    '/tag/:tagSlug',
    validateSlugs(['tagSlug']),
    newsByTag,
  );
  // .get('/article/search', search)
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

  if (!news.length && !isEmpty(query)) {
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
  if (req.session && req.session.reserved) {
    return next();
  }

  const { query } = req;
  const { categorySlug } = req.params;
  const { news, pagination, seo } = await articleController
    .getCategoryNews(query, categorySlug);

  if (!news.length && !isEmpty(query)) {
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

async function newsByTag(req, res, next) {
  const { query } = req;
  const { tagSlug } = req.params;
  const { news, pagination, seo } = await articleController
    .getTagNews(query, tagSlug);

  if (!news.length && !isEmpty(query)) {
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

async function articlePage(req, res, next) {
  if (req.session && req.session.reserved) {
    return next();
  }

  const { article } = req.session;
  console.log(article);

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
