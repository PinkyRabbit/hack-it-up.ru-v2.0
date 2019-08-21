const createError  = require('http-errors');

// const publicRoutes   = require('./public');
const adminRoutes = require('./admin');
const errorHandler = require('../utils/error_handler');

module.exports = (app) => {
  app.use('/admin', adminRoutes);
  // app.use('/', publicRoutes);

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use((req, res, next) => next(createError(404, 'Страница не существует')));
  app.use(errorHandler);
};
