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
  .get('/', AdminController.dashboard);

module.exports = router;
