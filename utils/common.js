const transliteration = require('transliteration.cyr');

module.exports.translit = (str) => {
  let result = transliteration.transliterate(str);
  if (!str.length) return '';
  result = result.replace(/\s/g, '-');
  result = result.replace(/\./g, '-');
  return result.trim();
};

// отдаём ошибки в виде массива
module.exports.mapValidationErrorsForFlash = (errs) => {
  const validationErrors = errs.mapped();
  return Object
    .keys(validationErrors)
    .map(key => validationErrors[key].msg);
};
