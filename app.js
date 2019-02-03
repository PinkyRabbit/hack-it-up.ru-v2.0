'use strict';

const path            = require('path');
const express         = require('express');
const initRoutes      = require('./routes');
const initMiddlewares = require('./middlewares');
const db              = require('./db');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

initMiddlewares(app);

db.then(() => {
  initRoutes(app);
});

module.exports = app;
