'use strict';

const moment = require('moment');
const Posts = require('../db/posts');

module.exports.home = (req, res, next) => {
  res.locals.seo = {
    google: true,
    sidebar: true,
    title: 'Главная',
    h1: 'Hello world!',
    keywords: 'developer, примеры, nodejs, учить',
    image: 'standart/main.jpg',
    description: 'Этот блог родился, когда я делал первые шаги в NodeJS. В нём я публикую свои мысли и заметки про программирование и лучше писать код.',
  };

  const page = req.query && req.query.page ? parseInt(req.query.page, 10) : 1;
  Posts.getAllNews(page) // @NOTE: Заменить на только опубликованные и по номерам страниц
    .then((p, pagination) => {
      const posts = p.filtred.map(x => ({
        ...x,
        createdate: moment(x.createdAt).format('lll'),
      }));

      res.render('public/posts', { posts, pagination: p.pagination });
    })
    .catch(err => next(err));
};
