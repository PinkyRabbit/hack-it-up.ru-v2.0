'use strict';

require('dotenv').config();

module.exports = {
  posts: {
    limit: parseInt(process.env.POST_LIMIT, 10),
  },
};
