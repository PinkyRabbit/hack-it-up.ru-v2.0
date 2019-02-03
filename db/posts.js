'use strict';

const Posts = require('./index').get('posts');

// get all posts
module.exports.getAll = () => Posts.find({});

