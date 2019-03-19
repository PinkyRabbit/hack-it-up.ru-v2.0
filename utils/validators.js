'use strict';

const { check } = require('express-validator/check');

module.exports.loginValidation = [
  check('email')
    .isEmail()
    .withMessage('Такой почты никогда не существовало =)'),
];
