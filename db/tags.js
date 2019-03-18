'use strict';

// const createError = require('http-errors');
// const config      = require('../config');
const Tags        = require('./index').get('tags');

// { "_id" : ObjectId("59380ca7b1b81845d68ff89a"), "name" : "nginx", "url" : "nginx", "description" : "Всё что связано с работой в NginX. Nginx - это отличный http сервер, который сейчас может занять первое место среди себе подобных." }

module.exports.getAll = () => Tags.find({});
module.exports.insert = val => Tags.insert(val);
