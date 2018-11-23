'use strict';

const express = require('express');
const AccountCtrl = require('../controllers/account.controller');
const AwsCtrl = require('../controllers/aws.controller');
const OAuthCtrl = require('../controllers/oauth.controller');
const auth = express.Router();

auth
  .get('/account/self', AccountCtrl.self)
  .get('/account/:_id', AccountCtrl.self)
  .put('/account/:_id', AccountCtrl.update)
  .delete('/account/:_id', AccountCtrl.remove)
  .delete('/account/remove/:searchString', AccountCtrl.remove)
  .delete('/oauth/:searchString/link/:provider', OAuthCtrl.unlink)
  .get('/aws', AwsCtrl.get)
  .get('/aws/url/:key', AwsCtrl.getSignedUrl)
  .post('/aws', AwsCtrl.post)
  .delete('/aws', AwsCtrl.delete)
module.exports = auth;

