'use strict';

const logger = require('./logger');

module.exports = (err, req, res, next) => { // eslint-disable-line
  console.log(err);
  const errObj = {};
  errObj.status = err.status || err.errorCode || 502;
  errObj.message = err.message || '';
  if (req.originalUrl.indexOf('/!') === 0) errObj.status = 400;
  if (errObj.status === 400) errObj.message = 'The request cannot be fulfilled due to bad syntax.';

  // Отправляю хедер
  res.locals.seo = {
    title: `Ошибка ${errObj.status}`,
    description: 'Такой страницы не существует! Ошибка!',
  };

  if (errObj.status >= 500) {
    logger.fatal(`${req.originalUrl} -> ${errObj.message}`);
  } else {
    const pathSplit = req.originalUrl.split('/');
    if (!pathSplit.length || pathSplit[1] !== 'images') {
      logger.warn(`${req.originalUrl} [${errObj.status}] -> ${errObj.message}`);
    }
  }

  res.status(errObj.status).render('public/error', { error: errObj });
};
