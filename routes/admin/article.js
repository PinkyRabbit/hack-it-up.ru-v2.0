const express = require('express');

const adminArticleRouter = express.Router();

adminArticleRouter
  .get('/new', createAndRedirectToNewArticle)
  .get('/:articleId/edit', editPage)
  .put('/:articleId/edit', articlePresave)
  .post('/:articleId/edit', saveArticle)
  .get('/:articleId/view', viewArticle)
  .post('/:articleId/view', publishArticle);

async function createAndRedirectToNewArticle(req, res, next) {
  return next();
}

async function editPage(req, res, next) {
  return next();
}

async function articlePresave(req, res, next) {
  return next();
}

async function saveArticle(req, res, next) {
  return next();
}

async function viewArticle(req, res, next) {
  return next();
}

async function publishArticle(req, res, next) {
  return next();
}

module.exports = adminArticleRouter;
