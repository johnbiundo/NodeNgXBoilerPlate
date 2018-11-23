'use strict';

const User = require('./../../lib/models/user.model');
const faker = require('faker');

if (process.env.TEST_DATA === 'true') {
  User.deleteMany({ role: 'TESTER', 'profile.jobRole': 'FAKE TESTER' })
    .then(res => {
      for (let i = 0; i < 50; i++) {
        let user = new User({
          'profile.email': `tester${i}@mysampleapp.com`,
          'profile.firstName': faker.name.firstName(),
          'profile.lastName': faker.name.lastName(),
          'profile.company': 'Knowledge Anywhere',
          'profile.jobRole': 'FAKE TESTER',
          password: `Tester${i}!`,
          'status.confirmed': i % 2 === 0 ? true : faker.random.boolean(),
          'status.optInEmail': faker.random.boolean(),
          role: 'TESTER'
        });
        user.save();
      }
    })
    .catch(err => console.log(err));
}
