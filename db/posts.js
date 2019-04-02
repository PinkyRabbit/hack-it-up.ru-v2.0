'use strict';

const createError   = require('http-errors');
const moment        = require('moment');
const config        = require('../config');
const getPagination = require('../utils/pagination');
const Posts         = require('./index').get('posts');

// get all posts
module.exports.getAll = () => Posts.find({});

module.exports.getAllNews = (page = 1) => {
  return new Promise((resolve, reject) => {
    /* @NOTE: For rework only!
    Posts.find({})
      .then((docs) => {
        return rework(docs)
      })
      .catch((err) => reject(err))
      .then(() => {
        return Posts.find({ published: true }).then((docs) => {
          // if (docs.length < config.posts.limit) {
            console.log(docs[0])
            const res = docs.sort((a, b) => b.cteatedAt - a.cteatedAt);
            return resolve(res);
          // }
        });
      })
      .catch((err) => reject(err));
    */

    return Posts.find({ published: true }).then((docs) => {
      if (docs.length < config.posts.limit) {
        const res = docs.sort((a, b) => b.createdAt - a.createdAt);
        return resolve({ filtred: res, pagination: null });
      }

      if (config.posts.limit * (page - 1) > docs.length) {
        return reject(createError(404, 'Страница не существует'));
      }

      const pagination = getPagination(docs, page, config.posts.limit, '/');
      return Posts.find({
          published: true,
        }, {
          sort : { createdAt : -1 },
          skip: (page - 1) * config.posts.limit,
          limit : config.posts.limit,
        })
        .then((filtred) => {
          return resolve({ filtred, pagination });
        });
    });

//  ,
  });
};

module.exports.findBySlug = (slug) => Posts.findOne({ slug });
module.exports.findById = (_id) => Posts.findOne({ _id });
module.exports.makeUnpublished = (_id) => Posts.update({ _id }, { $set: { published: false } });
module.exports.publish = (_id) => Posts.update({ _id }, { $set: { published: true } });
module.exports.findUnpublished = () => Posts.find({ published: false });
module.exports.updateById = (_id, update) => Posts.update({ _id }, { $set: update });
module.exports.delete = (_id) => Posts.remove({ _id });
module.exports.removeCat = (name) => Posts.update({ category: name }, { $set: { category: '' } }, { multi: true });
module.exports.removeTag = (name) => Posts.update({ tags: name }, { $pull: { tags: name } }, { multi: true });

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

module.exports.search = (query) => {
  Posts.find({
    // @FIXME: продолжить тут
  })
};

function rework() {
  return new Promise((resolve, reject) => {
    Posts.find({}).then((docs) => {
      Posts.bulkWrite(docs.map((obj) => {
        let fixed;
        try {
          // fixed = fixTimestamps(obj); // @FIXME: DONE!
          fixed = fixSlug(obj); // @FIXME: DONE!
        } catch(err) {
          console.error(err);
          fixed = obj;
        }
        console.log(fixed)
        const { _id, ...newObj } = fixed;
        return {
          updateOne: {
            filter: { _id: _id },
            update: newObj,
          },
        };
      }))
        .then((result) => {
          console.log(result);
          return resolve();
        })
        .catch((err) => reject(err));
    });
  });
}

function fixTimestamps(obj) {
  const { createdate, updatedate, ...base } = obj;
  const newObj = Object.assign(base, {
    createdAt: new Date(createdate),
    updatedAt: new Date(updatedate),
  });

  return newObj;
}

function fixSlug(obj) {
  const { url, ...base } = obj;
  const newObj = url ? Object.assign(base, {
    slug: url,
  }) : obj;

  return newObj;
}
