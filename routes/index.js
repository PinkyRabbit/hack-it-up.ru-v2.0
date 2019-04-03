'use strict';

const createError  = require('http-errors');
const errorHandler = require('../utils/error_handler');

// routes
const pub   = require('./public');
const admin = require('./admin');

module.exports = (app) => {
  app.use('/', pub);
  app.use('/admin', admin);

  // protection
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // 404 Error response
  app.use((req, res, next) => next(createError(404, 'Страница не существует')));

  app.use(errorHandler);
};
