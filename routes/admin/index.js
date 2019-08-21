const express = require('express');

const { isAuthenticated } = require('../../utils/authentication');
const adminArticleRoute = require('./article');
// const adminTagsRoute = require('./tags');
// const adminCategoryRoute = require('./category');
// const adminCommentRoute = require('./comment');

const adminRouter = express.Router();

adminRouter
  .use('*', isAuthenticated)
  .use('/article', adminArticleRoute);
  // .use('/tags', adminArticleRoute)
  // .use('/categories', adminArticleRoute)
  // .use('/comments', adminArticleRoute);

module.exports = adminRouter;
