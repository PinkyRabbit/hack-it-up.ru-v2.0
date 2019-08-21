const adminArticleRoute = require('./article');
const adminTagsRoute = require('./tags');
const adminCategoryRoute = require('./category');
const adminCommentRoute = require('./comment');

module.exports = (app) => {
  app.use('/article', adminArticleRoute);
  app.use('/tags', adminTagsRoute);
  app.use('/categories', adminCategoryRoute);
  app.use('/comments', adminCommentRoute);
};
