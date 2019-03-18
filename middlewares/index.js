'use strict';

const path       = require('path');
const helmet     = require('helmet');
const favicon    = require('serve-favicon');
const csrf       = require('csurf');
const flash      = require('connect-flash');
const bodyParser = require('body-parser');
const passport    = require('passport');

const sessions    = require('./sessions');
const twitter     = require('./twitter');
const compression = require('./compression');

module.exports = (app) => {
  app.use(helmet());
  compression(app);
  // view engine setup
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'twig');

  // body parser
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.use(bodyParser.json());

  // session
  sessions(app);

  // passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(csrf({ cookie: true }));

  // serve static files
  app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.png')));

  app.use(flash());

  app.use('*', (req, res, next) => {
    console.log('req.user = ', req.user);
    next();
  });

  // twitter(app); //@TODO: жду ответа от твиттера для ключиков
};
