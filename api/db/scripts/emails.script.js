const Message = require('../../lib//models/message.model');
const utils = require('../../lib/utilities');

let confirm = {
  messageType: 'CONFIRM',
  subject: 'Confirm Your Account',
  body:
    'Hello, ${profile.firstName}.   Thanks for registering! <p>Please confirm your account by clicking on this link and pasting in the code: <a href="${APP_URL}/confirm/${accountCodes[0].guid}">Confirm Account</a></p><p><b>code:</b> ${code.code}</p>'
};

Message.findOneAndUpdate(
  {
    messageType: 'CONFIRM'
  },
  {
    $set: confirm
  },
  {
    upsert: true,
    setDefaultsOnInsert: true
  }
).catch(err => utils.helpers.handleError(err, 'db.email.confirm'));

let reset = {
  messageType: 'RESET',
  subject: 'Scormify Password Reset Requested',
  body:
    'Hello, ${profile.firstName}. <p><b>code:</b> ${code.code}</p><p>Please confirm you wish to reset the password on your account by clicking on this link and pasting in the code: <a href="${APP_URL}/reset-password/${code.guid}">Reset Password</a></p>'
};

Message.findOneAndUpdate(
  {
    messageType: 'RESET'
  },
  {
    $set: reset
  },
  {
    upsert: true,
    setDefaultsOnInsert: true
  }
).catch(err => utils.helpers.handleError(err, 'db.email.reset'));
