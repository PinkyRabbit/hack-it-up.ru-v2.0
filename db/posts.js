'use strict';

const createError   = require('http-errors');
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
          sort : { createdAt : 1 },
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

function rework() {
  return new Promise((resolve, reject) => {
    Posts.find({}).then((docs) => {
      Posts.bulkWrite(docs.map((obj) => {
        let fixed;
        try {
          // fixed = fixTimestamps(obj); // @FIXME: DONE!
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
