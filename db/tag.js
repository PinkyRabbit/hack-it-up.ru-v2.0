const { Tag } = require('.');

const TagQuery = {
  getAll: () => Tag.find({}),
  findBySlug: slug => Tag.findOne({ slug }),
  create: newTag => Tag.insert(newTag),
};

module.exports = TagQuery;

// const { Tag } = require('../db');

// module.exports.getAll = () => Tag.find({});
// module.exports.insert = val => Tag.insert(val);
// module.exports.findByNames = names => Tag.find({ name: { $in: names } });
// module.exports.bySlug = slug => Tag.findOne({ url: slug });
// module.exports.delete = name => Tag.remove({ name });
// module.exports.getFive = () => Tag.aggregate([{ $sample: { size: 5 } }]);
