const { Tags }     = require('../db');

const TagsQuery = {
  getAll: () => Tags.find({}),
  findBySlug: slug => Tags.findOne({ slug }),
  create: newTag => Tags.insert(newTag),
};

module.exports = TagsQuery;

// const { Tags } = require('../db');

// module.exports.getAll = () => Tags.find({});
// module.exports.insert = val => Tags.insert(val);
// module.exports.findByNames = names => Tags.find({ name: { $in: names } });
// module.exports.bySlug = slug => Tags.findOne({ url: slug });
// module.exports.delete = name => Tags.remove({ name });
// module.exports.getFive = () => Tags.aggregate([{ $sample: { size: 5 } }]);
