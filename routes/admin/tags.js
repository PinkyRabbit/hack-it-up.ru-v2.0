const express = require('express');

const adminTagsRouter = express.Router();

adminTagsRouter
  .get('/', tagsList)
  .post('/', createTag)
  .put('/:tagId', updateTag)
  .delete('/:tagId', deleteTag);

async function tagsList(req, res, next) {
  return next();
}

async function createTag(req, res, next) {
  return next();
}

async function updateTag(req, res, next) {
  return next();
}

async function deleteTag(req, res, next) {
  return next();
}

module.exports = adminTagsRouter;
