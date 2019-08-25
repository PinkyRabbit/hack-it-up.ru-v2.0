const express = require('express');

const articleController = require('../../controllers/article');
const {
  validateArticleId,
  validateArticle,
  flashErrors,
} = require('../validator');
const { uploadImage } = require('../../services/multer');

const adminArticleRouter = express.Router();

adminArticleRouter
  .get('/new', createAndRedirectToNewArticle)
  .get('/:articleId', validateArticleId, getJson)
  .get('/:articleId/edit', validateArticleId, editArticle)
  .put('/:articleId/edit', validateArticleId, articlePresave)
  .post('/:articleId/edit', validateArticleId, validateArticle, flashErrors, saveArticle)
  .post('/:articleId/image', validateArticleId, uploadImage, checkUploadedImage)
  .get('/:articleId/view', viewArticle)
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

async function checkUploadedImage(req, res) {
  const { articleId } = req.params;
  const { file } = req;
  const fileName = await articleController.updateImage(articleId, file);
  res.json({ fileName });
}

async function articlePresave(req, res) {
  const { articleId } = req.params;
  const { body } = req;
  const result = await articleController.updateArticle(articleId, body);
  res.send(result);
}

async function saveArticle(req, res) {
  const { articleId } = req.params;
  const { body } = req;
  await articleController.updateArticle(articleId, body);
  res.redirect(`/admin/article/${articleId}/view`);
}

async function viewArticle(req, res) {
  const { articleId } = req.params;
  const post = await articleController.getArcticleWithRelations(articleId);
  res.locals.seo = {
    google: false,
    sidebar: true,
    title: 'Передпросмотр',
    h1: post.h1,
    keywords: post.keywords,
    image: post.postimage,
    description: post.description,
  };
  console.log(post);
  return res.render('public/article', post);
  // return res.render('public/article', {
  //   post: p,
  //   postcat: cats,
  //   posttags: tags,
  //   tags: JSON.stringify(tags),
  // });
}

// async function publishArticle(req, res, next) {
//   return next();
// }

module.exports = adminArticleRouter;
