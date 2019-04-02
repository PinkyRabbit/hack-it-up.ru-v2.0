'use strict';

require('dotenv').config();

const createError = require('http-errors');
const path        = require('path');
const multer      = require('multer');
const moment      = require('moment');
const sharp       = require('sharp');
const base64      = require('node-base64-image');
const Posts       = require('../db/posts');
const Tags        = require('../db/tags');
const Categories  = require('../db/cats');
const common      = require('../utils/common');
const logger      = require('../utils/logger');

module.exports.dashboard = async (req, res) => {
  const posts = await Posts.findUnpublished();
  res.locals.posts = posts
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(x => ({
      _id: x._id,
      h1: x.h1,
      createdAt: moment(x.createdAt).format('DD.MM.YY, hh:mm'),
    }));

  const cats = await Categories.getAll();
  res.locals.categories = cats;

  const tags = await Tags.getAll();
  res.locals.tags = tags;

  res.render('admin/dashboard');
};

module.exports.new = (req, res, next) => {
  Posts.createNew(req.user)
    .then(post => res.redirect(`/admin/edit/${post._id}`))
    .catch(err => next(err));
};

module.exports.editpost = (req, res, next) => {
  if (!req.params || !req.params.id) return next();
  return Posts.makeUnpublished(req.params.id)
    .then((result) => {
      if (!result.n) return next();
      return res.redirect(`/admin/edit/${req.params.id}`);
    })
    .catch(err => next(err));
};

module.exports.publish = (req, res, next) => {
  if (!req.params || !req.params.id) return next();
  return Posts.publish(req.params.id)
    .then((result) => {
      if (!result.n) return next();
      let url = '/';
      if (req.query && req.query.slug) url = `/article/${req.query.slug}`;
      return res.redirect(url);
    })
    .catch(err => next(err));
};


module.exports.edit = {
  get: (req, res, next) => {
    if (!req.params || !req.params.id) return next();
    res.locals.scripts = {};
    res.locals.scripts.costume = process.env.VUE === 'development' ? 'http://localhost:3000' : '';
    res.locals.scripts.costume += '/js/edit-news.js';
    return Posts.findById(req.params.id)
      .then((post) => {
        if (!post) return next();
        return res.render('public/vue');
      })
      .catch(err => next(err));
  },
  post: async (req, res, next) => {
    if (!req.params || !req.params.id) return next();
    if (!req.user) return next(createError(401, 'Unauthorized'));
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags.split(',');

    const update = {
      body: req.body.body,
      category: req.body.category,
      description: req.body.description,
      h1: req.body.h1,
      keywords: req.body.keywords,
      postimage: req.body.postimage,
      slug: req.body.slug || req.params.id,
      tags,
      title: req.body.title,
      updatedAt: new Date(),
    };

    try {
      await Categories.createNew(req.body.category);
      await Posts.updateById(req.params.id, update);
      req.flash('success', 'Статья успешно сохранена!');
    } catch (err) {
      logger.error(err);
      req.flash('warning', 'Статья сохранена с ошибками. При повторе этого сообщения пишите администратору.');
    }

    const url = `/article/${update.slug}`;
    return res.redirect(url);
  },
  put: (req, res) => {
    if (!req.params || !req.params.id) return res.json({ success: false });
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags.split(',');

    const update = {
      body: req.body.body,
      category: req.body.category,
      description: req.body.description,
      h1: req.body.h1,
      keywords: req.body.keywords,
      postimage: req.body.postimage,
      slug: req.body.slug,
      tags,
      title: req.body.title,
      updatedAt: new Date(),
    };
    return Posts.updateById(req.params.id, update)
      .then(() => res.json({ success: true }))
      .catch(err => res.send(err));
  },
};

module.exports.api = {
  get: (req, res) => {
    if (!req.query) return res.json(createError(403, 'query id is empty'));
    if (req.query.post) {
      return Posts.findById(req.query.post)
        .then((post) => {
          // eslint-disable-next-line
          if (!post.author && req.user) post.author = req.user.username;
          return res.json(post);
        })
        .catch(err => res.send(err));
    }

    if (req.query.csrf) {
      return res.send(req.csrfToken());
    }

    if (req.query.tag) {
      if (req.query.tag === 'find') {
        return Tags.getAll()
          .then((tags) => {
            const t = tags.map(x => ({
              name: x.name,
              url: x.url,
            }));
            res.json(t);
          })
          .catch(err => res.json(err));
      }

      return Tags.insert({
        name: req.query.tag,
        url: common.translit(req.query.tag),
      })
        .then(res.json({ success: true }))
        .catch(err => res.json(err));
    }

    if (req.query.categories) {
      if (req.query.categories === 'find') {
        return Categories.getNames()
          .then(cats => res.json(cats))
          .catch(err => res.json(err));
      }
    }

    if (req.query.slug) {
      const slug = common.createSlug(req.query.slug);
      return Posts.findBySlug(slug)
        .then((post) => {
          if (!post) return { slug, doubled: false };
          return createRecursiveSlug(slug);
        })
        .then(result => res.json(result))
        .catch(err => res.json(err));
    }

    return res.json(createError(403, 'Unknown query'));
  },
};

function createRecursiveSlug(s = 'no-slug', index = 2) {
  return new Promise((resolve, reject) => {
    const slug = `${s}-${index}`;
    Posts.findBySlug(slug)
      .then((post) => {
        if (!post) return resolve({ slug, doubled: true });
        return createRecursiveSlug(s, index + 1);
      })
      .catch(err => reject(err));
  });
}

module.exports.image = {
  post: (req, res) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) { // eslint-disable-line
        cb(null, path.join(__dirname, '../public/images/uploads'));
      },
      filename: function (req, file, cb) { // eslint-disable-line
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${Date.now()}${ext}`;

        cb(null, filename);
      },
    });

    const upload = multer({ storage }).single('image');
    upload(req, res, (err) => {
      if (err) {
        logger.warn(err);
        req.flash('error', 'Ошибка при загрузке изображения');
        return res.redirect('back');
      }
      return sharp(req.file.path)
        .webp({ quality: 60 })
        .toBuffer()
        .then(data => base64.decode(data, { filename: req.file.path },
          (err) => {
            if (err) return res.send(err);
            return res.json({ filename: req.file.filename });
          }))
        .catch(err => res.send(err));
    });
  },
};

module.exports.delete = {
  post: (req, res, next) => {
    if (!req.params.id) return next(createError(403, 'query id is empty'));
    return Posts.delete(req.params.id)
      .then(() => {
        req.flash('danger', 'Неопубликованный пост успешно удалён');
        return res.redirect('back');
      })
      .catch(err => res.send(err));
  },
};

module.exports.category = {
  delete: async (req, res, next) => {
    if (!req.params.url) return next(createError(403, 'param url is empty'));

    let name;
    try {
      const cat = await Categories.bySlug(req.params.url);
      name = cat.name; // eslint-disable-line
      await Posts.removeCat(name);
      await Categories.delete(name);
    } catch (err) {
      return next(err);
    }

    req.flash('info', `Категория ${name} успешно удалена`);
    return res.redirect('back');
  },
};

module.exports.tag = {
  delete: async (req, res, next) => {
    if (!req.params.url) return next(createError(403, 'param url is empty'));

    let name;
    try {
      const tag = await Tags.bySlug(req.params.url);
      name = tag.name; // eslint-disable-line
      await Posts.removeTag(name);
      await Tags.delete(name);
    } catch (err) {
      return next(err);
    }

    req.flash('info', `Тег ${name} успешно удалён`);
    return res.redirect('back');
  },
};
