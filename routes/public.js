'use strict';

const express = require('express');

const router = express.Router();

const { loginValidation } = require('../utils/validators');
const PublicController = require('../controllers/public.controller');

router.get('*', (req, res, next) => {
  console.log(req.user);
  if (req.user) res.locals.user = req.user.email;
  next();
});

router.get('/login', PublicController.login.get);
router.post('/login', loginValidation, PublicController.login.post);
router.get('/', PublicController.home);

module.exports = router;
