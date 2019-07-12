/* eslint-disable prefer-template */
const monk = require('monk');

// Connection URL
const url = [
  process.env.DB_USER
    ? process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@'
    : '',
  process.env.BASE_DOMAIN + ':27017',
  process.env.NODE_ENV === 'test' ? '/test' : '/' + process.env.DB,
].join('');

const db = monk(url);

module.exports = db;
