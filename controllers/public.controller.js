'use strict';

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

  Posts.getAll() // @NOTE: Заменить на только опубликованные и по номерам страниц
    .then((docs) => {
      console.log(docs);
      res.render('public/home');
    });
};
