const Posts = require('../db/posts');

const createNewArticle = async () => {
  const post = await Posts.new();
  return post;
};

const getArticle = async (_id) => {
  const post = await Posts.getById(_id);
  return post;
};

module.exports = {
  createNewArticle,
  getArticle,
};
