// const createError   = require('http-errors');
const moment        = require('moment');

const {
  mongodbId,
  Post,
} = require('../db');
// const config        = require('../config');
// const getPagination = require('../utils/pagination');

const join = {
  tags: {
    from: 'tags',
    localField: 'tags',
    foreignField: 'name',
    as: 'tags',
  },
  categories: {
    from: 'categories',
    localField: 'category',
    foreignField: 'name',
    as: 'categories',
  },
};

const sanitilize = article => ({
  dateurl: article.dateurl || null,
  isPublished: article.isPublished || false,
  updatedAt: article.updatedAt || null,
  body: article.body || '',
  category: article.category || null,
  description: article.description || '',
  h1: article.h1 || '',
  keywords: article.keywords || '',
  postimage: article.postimage || '',
  slug: article.slug || '',
  title: article.title || '',
  tags: Array.isArray(article.tags)
    ? article.tags
    : [article.tags].filter(Boolean),
});

const getFullAggrigationWithoutQuery = [
  { $lookup: join.tags },
  { $lookup: join.categories },
  {
    $unwind: {
      path: '$categories',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project:
      {
        _id: 1,
        published: 1,
        updatedAt: 1,
        body: 1,
        description: 1,
        h1: 1,
        keywords: 1,
        postimage: 1,
        slug: 1,
        title: 1,
        tags: 1,
        category: {
          name: {
            $cond: { if: '$categories.name', then: '$categories.name', else: '$category' },
          },
          slug: '$categories.slug',
        },
      },
  },
];

const PostsQuery = {
  getById: _id => Post.findOne({ _id }),
  findBySlug: slug => Post.findOne({ slug }),
  new: () => {
    const date = new Date();
    return Post.insert({
      dateurl: moment(date).format('MM-YYYY'),
      isPublished: false,
      createdAt: date,
      updatedAt: date,
    });
  },
  update: (_id, update) => {
    console.log(sanitilize({ ...update, updatedAt: new Date() }))
    return Post.update(
    { _id },
    { $set: sanitilize({ ...update, updatedAt: new Date() }) },
  );},
  // update: (_id, update) => Post.update(
  //   { _id },
  //   { $set: sanitilize({ ...update, updatedAt: new Date() }) },
  // ),
  published: (_id, isPublished) => Post.update({ _id }, {
    $set: {
      isPublished,
      updatedAt: new Date(),
    },
  }),
  updateImage: (_id, postimage) => Post.update({ _id }, {
    $set: {
      postimage,
      updatedAt: new Date(),
    },
  }),
  getOneByIdWithRelations: _id => new Promise((resolve, reject) => {
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { _id: mongodbId(_id) } });
    Post
      .aggregate(aggregation)
      .then(posts => resolve(posts[0]))
      .catch(err => reject(err));
  }),
  getOneBySlugWithRelations: slug => new Promise((resolve, reject) => {
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { slug } });
    Post
      .aggregate(aggregation)
      .then(posts => resolve(posts[0]))
      .catch(err => reject(err));
  }),
};

module.exports = PostsQuery;
/*


// get all posts
module.exports.getAll = filters => Posts.find(filters);
module.exports.findById = _id => Posts.findOne({ _id });

// @TODO: need work
module.exports.getAllWithPagination = filters => Posts.find(filters);

// @FIXME: need to rework:
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
        .then(filtred => resolve({ filtred, pagination }));
    });
  });
};

module.exports.findBySlug = slug => Posts.findOne({ slug });

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

module.exports.search = re => Posts.find({
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

module.exports.addComment = (_id, comment) => Posts
  .update({ _id }, { $push: { comments: comment } });
*/
