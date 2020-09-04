// Common packages
const functions = require('firebase-functions');

// Functions to attach to triggers
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  return sendWelcomeEmail(user.email, user.displayName);
});
exports.sendByeEmail = functions.auth.user().onDelete((user) => {
  return sendGoodbyeEmail(user.email, user.displayName);
});

const {
  sendGoodbyeEmail,
  sendWelcomeEmail,
} = require('./auth');
