const express = require('express');
const { isEmpty } = require('lodash');

const articleController = require('../controllers/article');
const { validateSlugs } = require('./validator');

const publicRouter = express.Router();

publicRouter
  .get('/', getNews)
  .get('/csrf', csrf)
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

  if (!seo || (!news.length && isEmpty(query))) {
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

  if (!seo || (!news.length && isEmpty(query))) {
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
