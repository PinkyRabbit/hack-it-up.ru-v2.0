const express = require('express');

const articleController = require('../../controllers/article');
const { createOrUpdateCategory } = require('../../controllers/categories');
const { uploadImage } = require('../../services/multer');
const use = require('../use');
const {
  validateArticleId,
  validateArticle,
  flashErrors,
} = require('../validator');

const adminArticleRouter = express.Router();

adminArticleRouter
  .get('/new', createAndRedirectToNewArticle)
  .get('/:articleId', validateArticleId, use.article, validateArticleId, getJson)
  .get('/:articleId/edit', validateArticleId, use.article, editArticle)
  .put('/:articleId/edit', validateArticleId, use.article, articlePresave)
  .post('/:articleId/edit', validateArticleId, use.article, validateArticle, flashErrors, saveArticle)
  .post('/:articleId/image', validateArticleId, use.article, uploadImage, checkUploadedImage)
  .get('/:articleId/view', validateArticleId, use.article, viewArticle)
  .post('/:articleId/view', validateArticleId, use.article, validateArticle, flashErrors, publishArticle);

async function createAndRedirectToNewArticle(req, res) {
  const { _id: articleId } = await articleController.createNewArticle();
  res.redirect(`/admin/article/${articleId}/edit`);
}

async function editArticle(req, res) {
  const { articleId } = req.params;
  await articleController.makeUnpublished(articleId);

  res.locals.scripts = {};
  res.locals.scripts.custom = `${process.env.VUE === 'development' ? 'http://localhost:3000' : ''}/js/edit-news.js`;
  return res.render('public/vue');
}

async function getJson(req, res) {
  const { article } = req.session;
  res.json(article);
}

async function checkUploadedImage(req, res) {
  const { article } = req.session;
  const { file } = req;
  const fileName = await articleController.updateImage(article, file);
  res.json({ fileName });
}

async function articlePresave(req, res) {
  const { article } = req.session;
  const { body } = req;
  const result = await articleController.updateArticle(article._id, body);
  res.send(result);
}

async function saveArticle(req, res) {
  const { article } = req.session;
  const { body } = req;

  await articleController.updateArticle(article._id, body);
  res.redirect(`/admin/article/${article._id}/view`);
}

async function viewArticle(req, res) {
  const { articleId } = req.params;
  const post = await articleController.getArcticleWithRelations(articleId);

  return res.render('public/article', {
    ...post,
    sidebar: true,
    _csrf: req.csrfToken(),
  });
}

async function publishArticle(req, res) {
  const { articleId } = req.params;

  const article = await articleController.publish(articleId);
  const category = await createOrUpdateCategory(article.category);

  req.flash('success', 'Статья успешно опубликована!');
  const redirectLink = `/${category.slug}/${article.slug}`;
  res.redirect(redirectLink);
}

module.exports = adminArticleRouter;
