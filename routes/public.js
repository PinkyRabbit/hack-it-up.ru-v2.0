'use strict';

const express = require('express');

const router = express.Router();

const PublicController = require('../controllers/public.controller');



router.get('/login', PublicController.login.get);
router.get('/', PublicController.home);

module.exports = router;
