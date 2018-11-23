'use strict';

const User = require('./../../lib/models/user.model');
const utils = require('./../../lib/utilities');

User.findOne({
  'profile.email': 'mysampleapp@mysampleapp.com'
})
  .then(user => {
    if (!user) {
      user = new User({
        'profile.email': 'mysampleapp@mysampleapp.com',
        'profile.firstName': 'Scormify',
        'profile.lastName': 'Admin',
        'profile.company': 'Knowledge Anywhere',
        'profile.jobRole': 'Make things scormy',
        password: 'Noble64',
        'status.confirmed': true,
        role: 'ADMIN'
      });
      user.save();
    }
  })
  .catch(err => utils.helpers.handleError(err, 'db.admin.insert'));
