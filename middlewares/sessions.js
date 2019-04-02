'use strict';

require('dotenv').config();

const session = require('express-session');
const cookieParser = require('cookie-parser');

const RESAVE = !(process.env.NODE_ENV === 'production');

module.exports = (app) => {
  app.use(session({
    name: process.env.SESSION_NAME,
    resave: RESAVE,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: 'auto',
      sameSite: true,
    },
  }));
  app.use(cookieParser());
};
