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
  console.log(cats)

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
    res.locals.scripts.costume = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';
    res.locals.scripts.costume += '/js/edit-news.js';
    return Posts.findById(req.params.id)
      .then((post) => {
        if (!post) return next();
        return res.render('public/vue');
      })
      .catch(err => next(err));
  },
  post: (req, res, next) => {
    if (!req.params || !req.params.id) return next();
    const update = {
      body: req.body.body,
      category: req.body.category,
      description: req.body.description,
      h1: req.body.h1,
      keywords: req.body.keywords,
      postimage: req.body.postimage,
      slug: req.body.slug || req.params.id,
      tags: req.body.tags.split(','),
      title: req.body.title,
      updatedAt: new Date(),
    };
    return Posts.updateById(req.params.id, update)
      .then(() => {
        const url = `/article/${update.slug}`;
        req.flash('Статья успешно сохранена!');
        return res.redirect(url);
      })
      .catch(err => next(err));
  },
  put: (req, res) => {
    if (!req.params || !req.params.id) return res.json({ success: false });
    const update = {
      body: req.body.body,
      category: req.body.category,
      description: req.body.description,
      h1: req.body.h1,
      keywords: req.body.keywords,
      postimage: req.body.postimage,
      slug: req.body.slug,
      tags: req.body.tags.split(','),
      title: req.body.title,
      updatedAt: new Date(),
    };
    return Posts.update({ _id: req.params.id }, { $set: update })
      .then(() => res.json({ success: true }))
      .catch(err => res.send(err));
  },
};

module.exports.api = {
  get: (req, res) => {
    if (!req.query) return res.json(createError(403, 'query id is empty'));
    if (req.query.post) {
      return Posts.findById(req.query.post)
        .then(post => res.json(post))
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
