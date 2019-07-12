const Posts = require('../db/posts');

module.exports.getAll = async (params = {}) => {
  const articles = await Posts.getAllWithPagination(params);

  return articles;
};

module.exports.getUnpublished = async () => {
  const articles = await Posts.getAll({ published: false });

  return articles;
};
