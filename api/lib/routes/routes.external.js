'use strict';

const express = require('express');
const ExternalCtrl = require('../controllers/external.controller');
const AuthStore = require('../stores/authentication.store.js');
const external = express.Router();

external
  .post('/oauth', ExternalCtrl.getToken)
  .post('/sso', ExternalCtrl.sso)
  .post('/keys', AuthStore.authenticate, ExternalCtrl.generateApiKey)
  .get('/keys', AuthStore.authenticate, ExternalCtrl.getApiKey)
  .put('/keys', AuthStore.authenticate, ExternalCtrl.updateApiKey)
  .get('/ping', ExternalCtrl.ping);

module.exports = external;
