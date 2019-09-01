const moment = require('moment');

const {
  mongodbId,
  Post,
} = require('.');

const limit = parseInt(process.env.PAGE_LIMIT, 10);

const join = {
  tags: {
    from: 'tag',
    localField: 'tags',
    foreignField: 'name',
    as: 'tags',
  },
  categories: {
    from: 'category',
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

const projectForFullArticle = {
  $project:
    {
      _id: 1,
      isPublished: 1,
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
        $cond: {
          if: '$categories',
          then: '$categories',
          else: {
            name: '$category',
          },
        },
      },
    },
};

const getFullAggrigationWithoutQuery = [
  { $lookup: join.tags },
  { $lookup: join.categories },
  {
    $unwind: {
      path: '$categories',
      preserveNullAndEmptyArrays: true,
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

  update: (_id, update) => Post.update(
    { _id },
    { $set: sanitilize({ ...update, updatedAt: new Date() }) },
  ),

  published: (_id, isPublished) => Post.findOneAndUpdate({ _id }, {
    $set: {
      isPublished,
      updatedAt: new Date(),
    },
  },
  {
    returnNewDocument: true,
  }),

  updateImage: (_id, postimage) => Post.update({ _id }, {
    $set: {
      postimage,
      updatedAt: new Date(),
    },
  }),

  getOneByIdWithRelations: _id => new Promise(async (resolve, reject) => {
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { _id: mongodbId(_id) } });
    aggregation.push(projectForFullArticle);
    Post
      .aggregate(aggregation)
      .then(posts => resolve(posts[0]))
      .catch(err => reject(err));
  }),

  getOneBySlugWithRelations: slug => new Promise((resolve, reject) => {
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { slug } });
    aggregation.push(projectForFullArticle);
    Post
      .aggregate(aggregation)
      .then(posts => resolve(posts[0]))
      .catch(err => reject(err));
  }),

  getNews: (page, filter = null) => {
    const offset = limit * (page - 1);
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { isPublished: true } });
    aggregation.push(projectForFullArticle);
    if (filter) {
      aggregation.push({ $match: filter });
    }
    aggregation.push({ $limit: limit });
    aggregation.push({ $skip: offset });
    aggregation.push({ $sort: { updatedAt: -1 } });
    console.log(aggregation);
    return Post.aggregate(aggregation);
  },

  getCount: (filter = null) => new Promise((resolve, reject) => {
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { isPublished: true } });
    if (filter) {
      aggregation.push({ $match: filter });
    }
    aggregation.push({ $count: 'postsCount' });
    return Post.aggregate(aggregation)
      .then(posts => resolve(posts[0] ? posts[0].postsCount : []))
      .catch(err => reject(err));
  }),

  getUnpublished: () => Post.find({ isPublished: false }),
};

module.exports = PostsQuery;
/*
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
