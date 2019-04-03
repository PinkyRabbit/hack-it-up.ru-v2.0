'use strict';

const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
  service: 'Mail.ru',
  auth: {
    user: process.env.EMAIL_DELIVERY_EMAIL,
    pass: process.env.EMAIL_DELIVERY_PASSWORD,
  },
});

const mailOptions = { from: `Hello World <${process.env.EMAIL_DELIVERY_EMAIL}>` };

function toHtml(str) {
  return str
    .replace(/[\s\r\n]+$/, '')
    .replace(/^[\s\r\n]+/, '')
    .replace(/\r\n/gm, '<br>')
    .replace(/\n/gm, '<br>');
}

module.exports = ({ to, subject, text }) => {
  return new Promise((resolve, reject) => {
    mailOptions.to = to;
    mailOptions.subject = subject;
    mailOptions.text = text;
    mailOptions.html = toHtml(text);
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) return reject(error);
      console.log(response);
      smtpTransport.close();
      return resolve();
    });
  });
};
