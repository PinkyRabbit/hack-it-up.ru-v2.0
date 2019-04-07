'use strict';

const Cats = require('./index').get('categories');
const { createSlug } = require('../utils/common');

module.exports.getAll = () => Cats.find({ name: { $ne: '' } });
module.exports.getNames = () => Cats.find({ name: { $ne: '' } }, { name: 1 });
module.exports.bySlug = slug => Cats.findOne({ url: slug });
module.exports.byName = name => Cats.findOne({ name });
module.exports.delete = name => Cats.remove({ name });
module.exports.createNew = (name) => {
  const date = new Date();
  return Cats.update(
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
