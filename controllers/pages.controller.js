'use strict';

const logger = require('../utils/logger');

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
