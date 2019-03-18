'use strict';

const Posts = require('../db/posts');
const Cats = require('../db/cats');

module.exports.article = {
  get: (req, res, next) => {
    if (!req.params || !req.params.slug) return next();
    let p;
    return Posts.findBySlug(req.params.slug)
      .then((post) => {
        if (!post) return next();
        res.locals.seo = {
          google: post.published,
          sidebar: true,
          title: post.title,
          h1: post.h1,
          keywords: post.keywords,
          image: `/uploads/${post.postimage}`,
          description: post.description,
        };

        p = Object.assign({}, post);
        return Cats.bySlug(post.category);
      })
      .then(c => res.render('public/article', { post: p, postcat: c }))
      .catch(err => next(err));
  },
};
