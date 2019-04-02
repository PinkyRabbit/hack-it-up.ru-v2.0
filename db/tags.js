'use strict';

const Tags = require('./index').get('tags');

module.exports.getAll = () => Tags.find({});
module.exports.insert = val => Tags.insert(val);
module.exports.findByNames = names => Tags.find({ name: { $in: names } });
module.exports.bySlug = slug => Tags.findOne({ url: slug });
module.exports.delete = name => Tags.remove({ name });
