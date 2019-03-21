'use strict';

const Tags = require('./index').get('tags');

module.exports.getAll = () => Tags.find({});
module.exports.insert = val => Tags.insert(val);
