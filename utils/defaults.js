'use strict';

require('dotenv').config();

const bcrypt = require('bcrypt');
const logger = require('./logger');
const User = require('../db/user');

function createDefaultUser() {
  bcrypt.hash(process.env.ADMIN_PASSWORD, 10, (err, hash) => {
    if (err) return logger.error(err);
    const update = {
      username: process.env.ADMIN_EMAIL,
      password: hash,
    };
    return User.update(
      { email: process.env.ADMIN_EMAIL },
      { $set: update },
      { upsert: true },
    );
  });
}

module.exports = async () => {
  await createDefaultUser();
};
