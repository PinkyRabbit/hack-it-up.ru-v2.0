const { Category } = require('.');

const CategoryQuery = {
  getAll: () => Category.find({}),

  createOrUpdate: category => Category
    .findOneAndUpdate(
      { name: category.name },
      { $set: category },
      { upsert: true, returnNewDocument: true },
    ),

  findBySlug: slug => Category.findOne({ slug }),

  getAllCategories: () => Category.find({}),
};

module.exports = CategoryQuery;

/*
const { createSlug } = require('../utils/common');

module.exports.getAll = () => Category().find({ name: { $ne: '' } });
module.exports.getNames = () => Category().find({ name: { $ne: '' } }, { name: 1 });
module.exports.bySlug = slug => Category().findOne({ url: slug });
module.exports.byName = name => Category().findOne({ name });
module.exports.delete = name => Category().remove({ name });
module.exports.createNew = (name) => {
  const date = new Date();
  return Category().update(
    { name }, {
      $setOnInsert: {
        name,
        url: createSlug(name),
        createdAt: date,
      },
      $set: {
        updatedAt: date,
      },
    }, {
      upsert: true,
    }
  );
};
*/
