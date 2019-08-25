const fs = require('fs');
const path = require('path');

const Posts = require('../db/posts');
const logger = require('../utils/logger');

const createNewArticle = async () => {
  const post = await Posts.new();
  return post;
};

const getArticle = async (_id) => {
  const post = await Posts.getById(_id);
  return post;
};

const updateImage = async (_id, file) => {
  const post = await Posts.getById(_id);
  const { postimage } = post;
  if (postimage) {
    try {
      fs.unlinkSync(path.join(__dirname, `../public/images/${postimage}`));
    } catch (err) {
      logger.warn(err.message);
    }
  }
  const newImage = `uploads/${file.filename}`;
  const update = { postimage: newImage };
  await Posts.update(_id, update);
  return newImage;
};

const updateArticle = async (_id, update) => {
  await Posts.update(_id, update);
  return 'Article successfully updated';
};

const getArcticleWithRelations = async (_id) => {
  // @NOTE: debug only
  const debug = await Posts.getById(_id);
  console.log(debug);

  const post = await Posts.getOneWithRelations(_id);
  return post;
};

module.exports = {
  createNewArticle,
  getArticle,
  updateImage,
  updateArticle,
  getArcticleWithRelations,
};
