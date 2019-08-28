const fs = require('fs');
const path = require('path');

const Posts = require('../db/posts');
const logger = require('../utils/logger');

const createNewArticle = async () => {
  const post = await Posts.new();
  return post;
};

const updateImage = async (article, file) => {
  const { postimage } = article;
  if (postimage) {
    try {
      fs.unlinkSync(path.join(__dirname, `../public/images/${postimage}`));
    } catch (err) {
      logger.warn(err.message);
    }
  }
  const newImage = `uploads/${file.filename}`;
  await Posts.updateImage(article._id, newImage);
  return newImage;
};

const updateArticle = async (_id, update) => {
  await Posts.update(_id, update);
  return 'Article successfully updated';
};

const getArcticleWithRelations = async (_id) => {
  const post = await Posts.getOneByIdWithRelations(_id);
  return post;
};

const publish = async (_id) => {
  const post = await Posts.published(_id, true);
  return post;
};

const makeUnpublished = async (_id) => {
  await Posts.published(_id, false);
  return 'Post was unpublished';
};

module.exports = {
  createNewArticle,
  updateImage,
  updateArticle,
  getArcticleWithRelations,
  publish,
  makeUnpublished,
};
