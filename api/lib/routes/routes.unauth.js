'use strict';
const express = require('express');
const AccountCtrl = require('../controllers/account.controller');
const AuthStore = require('../stores/authentication.store');
const OAuthCtrl = require('../controllers/oauth.controller');
const ContentCtrl = require('../controllers/content.controller');
const unauth = express.Router();

unauth
  .get('/auth/self', AuthStore.isAuthenticated)
  .get('/account/available/:email', AccountCtrl.emailIsAvailable)
  .get('/account/precheck/:type/:searchString', AccountCtrl.precheckCode)
  .put('/account/resend', AccountCtrl.resendCode)
  .put('/account/reset/:code', AccountCtrl.resetPassword)
  .put('/account/confirm/:code', AccountCtrl.confirm)
  .post('/account/register', AccountCtrl.register)
  .post('/account/login', AccountCtrl.login)
  .post('/account/forgot', AccountCtrl.forgotPassword)
  .post('/oauth/link/gh', OAuthCtrl.linkGh)
  .post('/oauth/link/li', OAuthCtrl.linkLi)
  .post('/oauth/link', OAuthCtrl.directUpsert)
  .get('/content/:key', ContentCtrl.get);

module.exports = unauth;
