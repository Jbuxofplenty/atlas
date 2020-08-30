// Your company name to include in the emails
const APP_NAME = 'Atlas One';

const functions = require('firebase-functions');
const rp = require('request-promise');
const cors = require('cors');

// Express for parsing body
var checkRecaptcha = require('express')()
var bodyParser = require('body-parser')

checkRecaptcha.use(bodyParser.json()) // for parsing application/json
checkRecaptcha.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
checkRecaptcha.use(cors({ origin: true }));

checkRecaptcha.post('*', (req, res) => {
  const response = req.body.response;
  console.log("recaptcha response", response)
  rp({
      uri: 'https://recaptcha.google.com/recaptcha/api/siteverify',
      method: 'POST',
      form: {
          secret: functions.config().recaptcha.key,
          response
      },
      json: true
  }).then(result => {
      console.log("recaptcha result", result)
      if (result.success) {
          res.send({type: 'success'})
      }
      else {
          res.send({type: 'recaptchaFailure'})
      }
  }).catch(reason => {
      console.log("Recaptcha request failure", reason)
      res.send({type: 'apiFailure', error: reason })
  })
});

const nodemailer = require('nodemailer');

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Sends a welcome email to the given user.
async function sendWelcomeEmail(email, displayName) {
    const mailOptions = {
        from: `${APP_NAME} <noreply@atlasone.com>`,
        to: email,
    };

    mailOptions.subject = `Welcome to ${APP_NAME}!`;
    mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
    await mailTransport.sendMail(mailOptions);
    console.log('New welcome email sent to:', email);
    return null;
}

// Sends a goodbye email to the given user.
async function sendGoodbyeEmail(email, displayName) {
    const mailOptions = {
        from: `${APP_NAME} <noreply@atlasone.com>`,
        to: email,
    };

    mailOptions.subject = `Bye!`;
    mailOptions.text = `Hey ${displayName || ''}! We confirm that we have deleted your ${APP_NAME} account.`;
    await mailTransport.sendMail(mailOptions);
    console.log('Account deletion confirmation email sent to:', email);
    return null;
}

module.exports = {
    checkRecaptcha,
    sendWelcomeEmail,
    sendGoodbyeEmail,
};
  