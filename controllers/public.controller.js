'use strict';

const moment               = require('moment');
const passport             = require('passport');
const { validationResult } = require('express-validator/check');
const { valErr }           = require('../utils/common');
const email                = require('../utils/email');
const Posts                = require('../db/posts');
const Categories           = require('../db/cats');
const Tag                  = require('../db/tags');

const author = {
  username: process.env.TG_USERNAME,
  url: process.env.TG_LINK,
};

module.exports.home = async (req, res, next) => {
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

  const p = await Posts.getAllNews(page);
  const posts = p.filtred.map(x => ({
    ...x,
    createdate: moment(x.createdAt).format('lll'),
    author,
  }));

  return res.render('public/posts', { posts, pagination: p.pagination });
};

module.exports.login = {
  get: (req, res) => {
    res.locals.scripts = {};
    res.locals.scripts.costume = 'https://www.google.com/recaptcha/api.js';

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

let lastq = '';
let lastTO = '';
function activateSearch(cb) {
  if (lastTO) {
    return cb([]);
  }
  lastTO = setTimeout(() => {
    const re = lastq
      .trim()
      .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    Posts.search(re)
      .then((posts) => {
        const links = posts.map(x => ({
          text: x.h1,
          url: x.slug,
        }));

        clearTimeout(lastTO);
        lastTO = null;

        cb(links);
      })
      .catch((err) => {
        logger.error(err);
        cb([]);
      });
  }, 200);
}

module.exports.search = (req, res) => {
  lastq = req.params.q;
  activateSearch(result => res.send(result));
}

module.exports.category = {
  get: async (req, res, next) => {
    const { slug } = req.params;
    const cat = await Categories.bySlug(slug);

    res.locals.seo = {
      google: true,
      sidebar: true,
      title: cat.name,
      h1: cat.name,
      keywords: '',
      image: 'standart/main.jpg',
      description: '',
    };

    const page = req.query && req.query.page ? parseInt(req.query.page, 10) : 1;
    if (page !== 1) {
      res.locals.seo.title += ` - Страница ${page}`;
      res.locals.seo.h1 += ` - Страница ${page}`;
      res.locals.seo.description += `Страница ${page}. ${res.locals.seo.description}`;
    }

    const p = await Posts.getAllNews(page, { category: cat.name });
    const author = {
      username: process.env.TG_USERNAME,
      url: process.env.TG_LINK,
    };
    const posts = p.filtred.map(x => ({
      ...x,
      createdate: moment(x.createdAt).format('lll'),
      author,
    }));

    return res.render('public/posts', { posts, pagination: p.pagination });
  }
}

module.exports.tag = {
  get: async (req, res, next) => {
    const { slug } = req.params;
    const tag = await Tag.bySlug(slug);

    res.locals.seo = {
      google: true,
      sidebar: true,
      title: tag.name,
      h1: tag.name,
      keywords: '',
      image: 'standart/main.jpg',
      description: '',
    };

    const page = req.query && req.query.page ? parseInt(req.query.page, 10) : 1;
    if (page !== 1) {
      res.locals.seo.title += ` - Страница ${page}`;
      res.locals.seo.h1 += ` - Страница ${page}`;
      res.locals.seo.description += `Страница ${page}. ${res.locals.seo.description}`;
    }

    const p = await Posts.getAllNews(page, { tag: tag.name });
    const author = {
      username: process.env.TG_USERNAME,
      url: process.env.TG_LINK,
    };
    const posts = p.filtred.map(x => ({
      ...x,
      createdate: moment(x.createdAt).format('lll'),
      author,
    }));

    return res.render('public/posts', { posts, pagination: p.pagination });
  }
}

module.exports.error = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.validationErrors = valErr(errors);
    return res.redirect('back');
  }

  if (req.body.body.length < 10) return res.redirect('back');

  const {
    name,
    email,
    body,
  } = req.body;

  const obj = {
    to: process.env.ADMIN_EMAIL,
    subject: 'Ошибка, которую нашёл пользователь сайта',
    text: `От ${name}<${email}>\n\n${body}`
  };

  email(obj)
    .then(() => {
      req.flash('success', '<strong>Спасибо!</strong> Ваше сообщение успешно отправлено администрации сайта.');
      res.redirect('/');
    })
    .catch(err => next(err));
}
