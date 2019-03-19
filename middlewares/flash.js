'use strict';

module.exports = (req, res, next) => {
  const messages = [];
  // primary success danger
  if (req.flash) {
    const FL = req.flash();
    if (Object.keys(FL).length) {
      for (const prop in FL) { // eslint-disable-line no-restricted-syntax
        if (Object.prototype.hasOwnProperty.call(FL, prop) && FL[prop].length) {
          for (let count = 0; count < FL[prop].length; count += 1) {
            messages.push({ type: prop, msg: FL[prop][count] });
          }
        }
      }
    }
  }

  if (req.session && req.session.validationErrors) {
    const ve = req.session.validationErrors;
    for (let i = 0; i < ve.length; i += 1) {
      messages.push({ type: 'warning', msg: ve[i] });
    }
    req.session.validationErrors = null;
  }

  if (messages) res.locals.messages = messages;
  next();
};
