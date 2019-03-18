const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');
const User          = require('../db/user');

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
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    User.findOne({ username })
      .then((user) => {
        if (!user) return done(null, false, 'Ошибка в логине или пароле');
        const result = bcrypt.compareSync(password, user.password);
        if (!result) return done(null, false, 'Ошибка в логине или пароле');
        return done(null, user);
      });
  }
));

exports.isAuthenticated = passport.authenticate('local');

