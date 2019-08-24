const express = require('express');

const tagsController = require('../../controllers/tags');

const adminTagsRouter = express.Router();

adminTagsRouter
  // .get('/', tagsList)
  .post('/', createTag)
  .get('/json', tagsJSON);
// .put('/:tagId', updateTag)
// .delete('/:tagId', deleteTag);

async function tagsJSON(req, res) {
  const tags = await tagsController.getAlltags();
  return res.json(tags);
}

async function createTag(req, res) {
  const { tag } = req.body;
  const result = tagsController.createTag(tag);
  return res.send(result);
}

// async function tagsList(req, res, next) {
//   return next();
// }


// async function updateTag(req, res, next) {
//   return next();
// }

// async function deleteTag(req, res, next) {
//   return next();
// }

module.exports = adminTagsRouter;
