'use strict';

const fs                   = require('fs');
const path                 = require('path');
const { markdown }         = require('markdown');
const { validationResult } = require('express-validator/check');
const { valErr }           = require('../utils/common');
const logger               = require('../utils/logger');

const Posts      = require('../db/posts');
const Categories = require('../db/cats');
const Tags       = require('../db/tags');

module.exports.article = {
  get: (req, res, next) => {
    if (!req.params || !req.params.slug) return next();
    let p;
    return Posts.findBySlug(req.params.slug)
      .then(async (post) => {
        if (!post) return next();
        if (!post.published && !req.user) {
          req.flash('info', 'Сейчас статья редактируется. Вы можете прочесть её позже.');
          return res.redirect('/');
        }

        res.locals.seo = {
          google: post.published,
          sidebar: true,
          title: post.title,
          h1: post.h1,
          keywords: post.keywords,
          image: post.postimage && `/uploads/${post.postimage}`,
          description: post.description,
        };

        p = Object.assign({}, post);

        let cats = [];
        let tags = [];
        try {
          cats = await Categories.byName(post.category);
          tags = await Tags.findByNames(post.tags);
        } catch (err) {
          logger.error(err);
        }

        return res.render('public/article', {
          post: p,
          postcat: cats,
          posttags: tags,
          tags: JSON.stringify(tags),
        });
      })
      .catch(err => next(err));
  },
};

module.exports.me = (req, res, next) => {
  res.locals.seo = {
    google: true,
    sidebar: true,
    title: 'О себе',
    h1: 'Вижу Вас как на яву!',
    keywords: 'Про меня',
    image: 'standart/aboutme.jpg',
    description: 'Тебя тоже нелегко узнать, — согласился Нумминорих. — Но пахнешь-то ты всё так же. — Как свеженькая кошачья какашка, — добавил я.',
  };

  const file = path.join(__dirname, '../README.md');
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) return next(err);
    const html = markdown.toHTML(data);
    return res.render('public/me', { html });
  });
};

module.exports.subscribe = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.validationErrors = valErr(errors);
    return res.redirect('back');
  }

  const emailz = path.join(__dirname, '../subscribers.txt');

  // eslint-disable-next-line
  return fs.appendFile(emailz, req.body.email + '\n', (err) => {
    if (err) logger.error(err);
    req.flash('success', 'Ваша электронная почта успешно подписана на обновления сайта');
    res.redirect('back');
  });
}
