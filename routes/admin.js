'use strict';

const express = require('express');

const router = express.Router();

const AdminController = require('../controllers/admin.controller');
const { isAuthenticated } = require('../utils/authentication');

router.get('*', isAuthenticated, (req, res, next) => {
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
  .get('/', AdminController.dashboard)
  .get('/new', AdminController.new)
  .get('/editpost/:id', AdminController.editpost)
  .get('/edit/:id', AdminController.edit.get)
  .put('/edit/:id', AdminController.edit.put)
  .post('/edit/:id', AdminController.edit.post)
  .get('/publish/:id', AdminController.publish)
  .get('/delete/:id', AdminController.delete.post)
  .get('/category/delete/:url', AdminController.category.delete)
  .get('/tag/delete/:url', AdminController.tag.delete)
  .get('/api', AdminController.api.get)
  .post('/image', AdminController.image.post);

module.exports = router;
