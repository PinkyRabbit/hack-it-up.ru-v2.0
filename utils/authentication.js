const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');
const createError   = require('http-errors');

const { User } = require('../db');

module.exports.init = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) return done(null, false, { message: 'Ошибка в логине или пароле' });
          const result = bcrypt.compareSync(password, user.password);
          if (!result) return done(null, false, { message: 'Ошибка в пароле' });
          return done(null, user);
        });
    }
  ));
};


// exports.isAuthenticated = passport.authenticate('local');
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return next(createError(404, 'Страница не существует'));
};
