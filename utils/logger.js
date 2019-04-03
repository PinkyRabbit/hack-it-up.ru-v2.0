'use strict';

require('dotenv').config();

const log4js = require('log4js');
const path = require('path');

const { smtpTransport } = require('./email');

const FILENAME = path.resolve(__dirname, '../logs/app.log');

const mailOps = Object.assign(smtpTransport, {
  type: '@log4js-node/smtp',
  to: process.env.ADMIN_EMAIL,
  subject: 'Ошибка на сайте',
});

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    toFile: { type: 'file', filename: FILENAME },
    email: mailOps,
  },
  categories: {
    default: {
      appenders: ['toFile', 'out'],
      level: 'error',
    },
    dev: {
      appenders: ['out'],
      level: 'debug',
    },
    prod: {
      appenders: ['toFile', 'email'],
      level: 'debug',
    },
  },
});

const type = process.env.NODE_ENV || 'development';

const useLogger = ({
  production: 'prod',
  development: 'dev',
  test: 'default',
})[type];


const logger = log4js.getLogger(useLogger);

module.exports = logger;
