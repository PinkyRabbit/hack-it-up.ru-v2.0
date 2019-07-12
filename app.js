const path            = require('path');
const express         = require('express');
const initRoutes      = require('./routes');
const initMiddlewares = require('./middlewares');
const initDefaults    = require('./utils/defaults');
const db              = require('./db');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

initMiddlewares(app);

app.start = async () => {
  await db();
  initRoutes(app);
  initDefaults();
};

if (process.env.NODE_ENV !== 'test') app.start();

module.exports = app;
