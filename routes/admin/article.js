const express = require('express');

const articleController = require('../../controllers/article');
const { validateArticleId } = require('../validator');

const adminArticleRouter = express.Router();

adminArticleRouter
  .get('/new', createAndRedirectToNewArticle)
  .get('/:articleId', validateArticleId, getJson)
  .get('/:articleId/edit', validateArticleId, editArticle)
  // .put('/:articleId/edit', articlePresave)
  // .post('/:articleId/edit', saveArticle)
  // .get('/:articleId/view', viewArticle)
  // .post('/:articleId/view', publishArticle)
  // .get('/:articleId/unpublish', unpublishArticle);
  ;

async function createAndRedirectToNewArticle(req, res) {
  const { _id: articleId } = await articleController.createNewArticle();
  res.redirect(`/admin/article/${articleId}/edit`);
}

async function editArticle(req, res) {
  const { articleId } = req.params;
  await articleController.getArticle(articleId);
  res.locals.scripts = {};
  res.locals.scripts.custom = `${process.env.VUE === 'development' ? 'http://localhost:3000' : ''}/js/edit-news.js`;
  res.render('public/vue');
}

async function getJson(req, res) {
  const { articleId } = req.params;
  const article = await articleController.getArticle(articleId);
  res.json(article);
}

// async function articlePresave(req, res, next) {
//   return next();
// }

// async function saveArticle(req, res, next) {
//   return next();
// }

// async function viewArticle(req, res, next) {
//   return next();
// }

// async function publishArticle(req, res, next) {
//   return next();
// }

module.exports = adminArticleRouter;
