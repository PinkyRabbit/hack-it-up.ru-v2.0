'use strict';

const Twitter = require('twitter');
const logger  = require('../utils/logger');
const config  = require('../config');

const twit = new Twitter({
  consumer_key: config.twitter.key,
  consumer_secret: config.twitter.secret,
  access_token_key: config.twitter.token_key,
  access_token_secret: config.twitter.token_secret,
});

module.exports = (app) => {
  app.get('*', async (req, res, next) => {
    try {
      const twits = await twit.get('/statuses/user_timeline.json', { count: 5 });
      console.log(twits);
    } catch (err) {
      logger.error(err);
    }
    return next();
  });
};
