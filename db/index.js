const monk = require('monk');

/* eslint-disable prefer-template */
const url = [
  process.env.DB_USER
    ? process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@'
    : '',
  process.env.IP + ':27017',
  process.env.NODE_ENV === 'test' ? '/test' : '/' + process.env.DB,
].join('');
/* eslint-enable prefer-template */

monk(url).catch((err) => {
  console.log(err); // eslint-disable-line
  process.exit(1);
});

module.exports = {
  User: monk(url).get('user'),
  Post: monk(url).get('posts'),
  Category: monk(url).get('categories'),
  Tags: monk(url).get('tags'),
};
