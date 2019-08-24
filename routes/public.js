const express = require('express');

const publicRouter = express.Router();

publicRouter
  // .get('/', news)
  .get('/csrf', csrf);
  // .get('/category/:categorySlug', newsInCategory)
  // .get('/category/:categorySlug/article/:articleSlug', article)
  // .get('/article/search', search)
  // .get('/tags/', tagsList)
  // .post('/comment/:articleSlug', newComment)
  // .get('/login', loginPage)
  // .post('/login', authorization);

async function csrf(req, res) {
  const token = req.csrfToken();
  res.send(token);
}

async function news(req, res, next) {
  return next();
}

async function newsInCategory(req, res, next) {
  return next();
}

async function article(req, res, next) {
  return next();
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
