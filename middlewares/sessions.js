'use strict';

require('dotenv').config();

const session = require('express-session');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
  app.use(session({
    name: process.env.SESSION_NAME,
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: 'auto',
    },
  }));
  app.use(cookieParser());
};
