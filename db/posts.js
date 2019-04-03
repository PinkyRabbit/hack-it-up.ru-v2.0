'use strict';

const createError   = require('http-errors');
const moment        = require('moment');
const config        = require('../config');
const getPagination = require('../utils/pagination');
const Posts         = require('./index').get('posts');

// get all posts
module.exports.getAll = () => Posts.find({});

module.exports.getAllNews = (page = 1, filter = null, urlPrefix = '/') => {
  return new Promise((resolve, reject) => {
    let query = { published: true };
    if (filter) query = Object.assign(query, filter);

    return Posts.find(query).then((docs) => {
      if (docs.length < config.posts.limit) {
        const res = docs.sort((a, b) => b.createdAt - a.createdAt);
        return resolve({ filtred: res, pagination: null });
      }

      if (config.posts.limit * (page - 1) > docs.length) {
        return reject(createError(404, 'Страница не существует'));
      }

      const pagination = getPagination(docs, page, config.posts.limit, urlPrefix);
      return Posts.find({
        published: true,
      }, {
        sort: { createdAt: -1 },
        skip: (page - 1) * config.posts.limit,
        limit: config.posts.limit,
      })
        .then((filtred) => {
          return resolve({ filtred, pagination });
        });
    });
  });
};

module.exports.findBySlug = slug => Posts.findOne({ slug });
module.exports.findById = _id => Posts.findOne({ _id });
module.exports.makeUnpublished = _id => Posts.update({ _id }, { $set: { published: false } });
module.exports.publish = _id => Posts.update({ _id }, { $set: { published: true } });
module.exports.findUnpublished = () => Posts.find({ published: false });
module.exports.updateById = (_id, update) => Posts.update({ _id }, { $set: update });
module.exports.delete = _id => Posts.remove({ _id });
module.exports.removeCat = name => Posts.update({ category: name }, { $set: { category: '' } }, { multi: true });
module.exports.removeTag = name => Posts
  .update({ tags: name }, { $pull: { tags: name } }, { multi: true });

module.exports.createNew = (user) => {
  const date = new Date();
  return Posts.insert({
    author: user.username,
    dateurl: moment(date).format('MM-YYYY'),
    published: false,
    createdAt: date,
    updatedAt: date,
  });
};

module.exports.search = (re) => {
  return Posts.find({
    $and: [
      { published: true },
      {
        $or: [
          { h1: { $regex: re, $options: 'i' } },
          { title: { $regex: re, $options: 'i' } },
          { description: { $regex: re, $options: 'i' } },
          { keywords: { $regex: re, $options: 'i' } },
        ],
      },
    ],
  });
};
