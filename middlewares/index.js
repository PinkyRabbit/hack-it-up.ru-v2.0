'use strict';

const path    = require('path');
const helmet  = require('helmet');
const favicon = require('serve-favicon');
const csrf    = require('csurf');
const flash   = require('connect-flash');

const sessions    = require('./sessions');
const compression = require('./compression');

module.exports = (app) => {
  app.use(helmet());
  compression(app);
  // view engine setup
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'twig');

  // session
  sessions(app);

  app.use(csrf({ cookie: true }));

  // serve static files
  app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.png')));

  app.use(flash());
};
