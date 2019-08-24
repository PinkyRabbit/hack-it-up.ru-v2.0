const express = require('express');

const { isAuthenticated } = require('../../utils/authentication');
const adminArticleRoute = require('./article');
const adminCategoryRoute = require('./category');
const adminTagsRoute = require('./tags');
const { generator } = require('../../utils/helpers');
// const adminCommentRoute = require('./comment');

const adminRouter = express.Router();

adminRouter
  .use('*', isAuthenticated, addSeoAdmin)
  .use('/article', adminArticleRoute)
  .use('/categories', adminCategoryRoute)
  .use('/tags', adminTagsRoute)
  .get('/generate', generateData);
  // .use('/comments', adminCommentRoute);

function addSeoAdmin(req, res, next) {
  res.locals.seo = {
    google: false,
    sidebar: false,
    title: 'Админка',
    description: 'Админка',
    h1: 'Админка',
    keywords: 'Админка',
    image: 'standart/admin.jpg',
  };

  return next();
}

async function generateData(req, res) {
  const result = await generator(req.query);
  return res.json(result);
}

module.exports = adminRouter;
