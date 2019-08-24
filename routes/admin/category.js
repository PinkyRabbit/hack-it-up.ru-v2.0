const express = require('express');

const categoryController = require('../../controllers/categories');

const adminCategoryRouter = express.Router();

adminCategoryRouter
  .get('/json', categoriesJSON);
  // .get('/', categoriesList)
  // .post('/', createCategory)
  // .get('/:categoryId', editCategory)
  // .put('/:categoryId', updateCategory)
  // .delete('/:categoryId', deleteCategory)
  // .post('/order', changeCategoriesOrder);

async function categoriesJSON(req, res) {
  const categories = await categoryController.getAllCategories();
  return res.json(categories);
}

// async function categoriesList(req, res, next) {
//   return next();
// }

// async function createCategory(req, res, next) {
//   return next();
// }

// async function editCategory(req, res, next) {
//   return next();
// }

// async function updateCategory(req, res, next) {
//   return next();
// }

// async function deleteCategory(req, res, next) {
//   return next();
// }

// async function changeCategoriesOrder(req, res, next) {
//   return next();
// }

module.exports = adminCategoryRouter;
