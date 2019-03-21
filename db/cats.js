'use strict';

const Cats = require('./index').get('categories');

module.exports.getAll = () => Cats.find({});
module.exports.getNames = () => Cats.find({}, { name: 1 });
module.exports.bySlug = slug => Cats.findOne({ url: slug });
