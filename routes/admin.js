'use strict';

const express = require('express');

const router = express.Router();

const AdminController = require('../controllers/admin.controller');

// @TODO: СДЕЛАТЬ ПРОВЕРКУ НА АВТОРИЗАЦИЮ с 404

router.get('*', (req, res, next) => {
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
  .get('/editpost/:id', AdminController.editpost)
  .get('/edit/:id', AdminController.edit.get)
  .put('/edit/:id', AdminController.edit.put)
  .post('/edit/:id', AdminController.edit.post)
  .get('/publish/:id', AdminController.publish)
  .get('/api', AdminController.api.get)
  .post('/image', AdminController.image.post);

module.exports = router;
