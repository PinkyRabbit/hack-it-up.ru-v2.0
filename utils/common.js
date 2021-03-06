'use strict';

const transliteration = require('transliteration.cyr');

module.exports.createSlug = (str) => {
  let result = transliteration.transliterate(str);
  if (!str.length) return '';
  result = result.replace(/\s/g, '-');
  result = result.replace(/\./g, '-');
  result = result.replace(/\[,!?\/\+=|\$#@"'><_]+/g, '-');
  result = result.replace(/--/g, '-');
  return result.toLowerCase().trim();
};

module.exports.translit = (str) => {
  let result = transliteration.transliterate(str);
  if (!str.length) return '';
  result = result.replace(/\s/g, '-');
  result = result.replace(/\./g, '-');
  return result.trim();
};

// отдаём ошибки в виде массива
module.exports.valErr = (errs) => {
  const validationErrors = errs.mapped();
  return Object
    .keys(validationErrors)
    .map((key) => {
      return validationErrors[key].msg;
    });
};
