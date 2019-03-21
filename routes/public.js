'use strict';

const express = require('express');

const router = express.Router();

const { loginValidation } = require('../utils/validators');
const PublicController = require('../controllers/public.controller');

router.get(/^.*[^.]+\w$/, (req, res, next) => {
  if (req.user) res.locals.user = req.user.email;
  if (process.env.NODE_ENV === 'development') res.locals.development = 'development';
  next();
});

router.get('/flash', (req, res) => {
  req.flash('info', 'Hello world!');
  res.redirect('back');
});

router.get('/login', PublicController.login.get);
router.post('/login', loginValidation, PublicController.login.post);
router.get('/', PublicController.home);

module.exports = router;
