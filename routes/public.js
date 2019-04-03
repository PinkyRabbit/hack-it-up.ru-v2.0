'use strict';

const express = require('express');
const Categories = require('../db/cats');
const Tags       = require('../db/tags');

const router = express.Router();

const recaptcha           = require('../utils/recaptcha');
const { emailValidation } = require('../utils/validators');
const PublicController    = require('../controllers/public.controller');
const PagesController     = require('../controllers/pages.controller');

const globals = async (req, res, next) => {
  if (req.user) res.locals.user = req.user.email;
  if (process.env.NODE_ENV === 'development') res.locals.development = 'development';

  const menucats = await Categories.getAll();
  if (menucats) res.locals.menucats = menucats;

  const tags = await Tags.getFive();
  res.locals.asidetags = tags
    .map(x => ({
      name: x.name,
      url: x.url,
    }));

  res.locals.csrf = req.csrfToken();

  next();
};

router.get(/^https?:\/\/www\.hack-it-up.ru\/[^\.]+$/, globals);

router.get('/flash', (req, res) => {
  req.flash('info', 'Hello world!');
  res.redirect('back');
});

router.get('/article/:slug', PagesController.article.get);
router.get('/about-me', PagesController.me);
router.get('/category/:slug', PublicController.category.get);
router.get('/tag/:slug', PublicController.tag.get);
router.get('/login', PublicController.login.get);
router.post('/login', recaptcha, emailValidation, PublicController.login.post);
router.get('/search/:q', PublicController.search);
router.post('/send-err', recaptcha, emailValidation, PublicController.error);
router.post('/subscribe', emailValidation, PagesController.subscribe);
router.get('/', globals, PublicController.home);

module.exports = router;
