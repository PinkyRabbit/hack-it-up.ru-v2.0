const Categories = require('../db/category');
const { createSlug } = require('../utils/helpers');

const getAllCategories = async () => {
  const categories = Categories.getAll();
  return categories;
};

const createOrUpdateCategory = async (name) => {
  const slug = createSlug(name);
  const category = await Categories.createOrUpdate({ name, slug });
  return category;
};

module.exports = {
  getAllCategories,
  createOrUpdateCategory,
};
