'use strict';

const express = require('express');

const router = express.Router();

const PagesController = require('../controllers/pages.controller');

router.get('/article/:slug', PagesController.article.get);

module.exports = router;
