const Tags = require('../db/tag');
const { createSlug } = require('../utils/helpers');

const getAlltags = async () => {
  const tags = await Tags.getAll();
  return tags;
};

const createTag = async (tag) => {
  const slug = createSlug(tag);
  const existsTagWithSlug = await Tags.findBySlug(slug);
  if (existsTagWithSlug) {
    return { error: `Возможно нам нужен тег "${existsTagWithSlug.name}"?` };
  }
  const newTag = await Tags.create({
    name: tag,
    slug,
  });
  return { tag: newTag };
};

module.exports = {
  getAlltags,
  createTag,
};
