const express = require('express');

const { isAuthenticated } = require('../../utils/authentication');
const adminArticleRoute = require('./article');
const adminCategoryRoute = require('./category');
const adminTagsRoute = require('./tags');
const { generator } = require('../../utils/helpers');
// const adminCommentRoute = require('./comment');

const adminRouter = express.Router();

adminRouter
  .get('*', (req, res, next) => {
    console.log('adminRouter!');
      console.dir(req.params) // '/admin/new'
      console.dir(req.originalUrl) // '/admin/new'
  console.dir(req.baseUrl) // '/admin'
  console.dir(req.path)
    return next();
  })
  .use('*', isAuthenticated, addSeoAdmin)
  .use('/article', adminArticleRoute)
  .use('/categories', adminCategoryRoute)
  .use('/tags', adminTagsRoute)
  .get('/generate', generateData);
  // .use('/comments', adminCommentRoute);

function addSeoAdmin(req, res, next) {
  res.locals.google = false;
  res.locals.sidebar = false;
  res.locals.title = 'Админка';
  res.locals.description = 'Админка';
  res.locals.h1 = 'Админка';
  res.locals.keywords = 'Админка';
  res.locals.image = 'standart/admin.jpg';

  return next();
}

async function generateData(req, res) {
  const result = await generator(req.query);
  return res.json(result);
}

module.exports = adminRouter;
