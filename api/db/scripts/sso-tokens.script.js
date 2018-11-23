const SSOToken = require('../../lib/models/sso-token.model');
const utils = require('../../lib/utilities');

SSOToken.findOneAndUpdate(
  {
    name: 'Sample'
  },
  {
    $set: { name: 'Sample', token: 'mysampleapp', origin: '*' }
  },
  {
    upsert: true,
    setDefaultsOnInsert: true
  }
).catch(err => utils.helpers.handleError(err, 'db.email.confirm'));
