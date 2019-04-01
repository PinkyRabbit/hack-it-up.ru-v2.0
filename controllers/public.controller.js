'use strict';

const moment               = require('moment');
const passport             = require('passport');
const { validationResult } = require('express-validator/check');
const { valErr }           = require('../utils/common');
const Posts                = require('../db/posts');

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
  if (page !== 1) {
    res.locals.seo.title += ` - Страница ${page}`;
    res.locals.seo.h1 += ` - Страница ${page}`;
    res.locals.seo.description += `Страница ${page}. ${res.locals.seo.description}`;
  }

  Posts.getAllNews(page)
    .then((p) => {
      // console.log(p)
      const posts = p.filtred.map(x => ({
        ...x,
        createdate: moment(x.createdAt).format('lll'),
      }));

      return res.render('public/posts', { posts, pagination: p.pagination });
    })
    .catch(err => next(err));
};

module.exports.login = {
  get: (req, res) => {
    if (req.user) return res.redirect('/admin');
    res.locals.seo = {
      google: false,
      sidebar: false,
      title: 'Вход...',
      h1: 'Дорога в эхо',
      keywords: 'login',
      image: 'standart/login.jpg',
      description: 'Страничка входа =) Только нафиг она вам сдалась-то?',
    };

    res.locals.csrf = req.csrfToken();
    return res.render('public/login');
  },
  post: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.validationErrors = valErr(errors);
      return res.redirect('back');
    }

    return passport.authenticate('local', (err, user, msg) => {
      if (err) return next(err);
      if (msg) {
        req.flash('info', msg.message);
        return res.redirect('back');
      }
      return req.logIn(user, (err) => {
        if (err) return next(err);
        return req.session.save(() => {
          req.flash('success', 'Вижу вас как на яву!');
          res.redirect('/admin');
        });
      });
    })(req, res, next);
  },
};
