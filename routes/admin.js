const express = require('express');

const Articles = require('../controllers/articles');
const Categories = require('../controllers/categories');
const Tags = require('../controllers/tags');
const validate = require('./validator');
const { isAuthenticated } = require('../utils/authentication');

const router = express.Router();

router.get('*', (req, res, next) => {
// router.get('*', isAuthenticated, (req, res, next) => {
  res.locals.seo = {
    google: false,
    sidebar: false,
    title: 'Админка',
    description: 'Админка',
    h1: 'Админка',
    keywords: 'Админка',
    image: 'standart/admin.jpg',
  };

  return next();
});

// routes
router
  .get('/', showDashboard)
  .get('/new', startNewArticle)
  .get('/edit/:id', validate.postId, articleEditPage)
  ;
  // .get('/', AdminController.dashboard)
  // .get('/new', AdminController.new)
  // .get('/editpost/:id', AdminController.editpost)
  // .get('/edit/:id', AdminController.edit.get)
  // .put('/edit/:id', AdminController.edit.put)
  // .post('/edit/:id', AdminController.edit.post)
  // .get('/publish/:id', AdminController.publish)
  // .get('/delete/:id', AdminController.delete.post)
  // .get('/category/delete/:url', AdminController.category.delete)
  // .get('/tag/delete/:url', AdminController.tag.delete)
  // .get('/api', AdminController.api.get)
  // .post('/image', AdminController.image.post);

async function showDashboard(req, res) {
  const posts = await Articles.getUnpublished();
  const categories = await Categories.getAll();
  const tags = await Tags.getAll();

  res.render('admin/dashboard', { posts, categories, tags });
}

async function startNewArticle(req, res) {
  const article = await Articles.createEmptyTemplate();
  res.redirect(`/admin/edit/${article._id}`);
}

async function articleEditPage(req, res) {
  res.locals.scripts = {};
  res.locals.scripts.costume = process.env.VUE === 'development' ? 'http://localhost:3000' : '';
  res.locals.scripts.costume += '/js/edit-news.js';

  res.render('public/vue');
}

module.exports = router;
