'use strict';

const express = require('express');
const AccountCtrl = require('../controllers/account.controller');
const admin = express.Router();

admin
  .patch('/account/role/:searchString/:role', AccountCtrl.role)
  .patch('/account/confirm/:searchString', AccountCtrl.confirmUserById)
  .patch('/account/unsubscribe/:searchString', AccountCtrl.unsubscribeUserById)
  .delete('/account/remove', AccountCtrl.removeAll)
  .get('/account/:_id', AccountCtrl.getById)
  .get('/accounts', AccountCtrl.getAll);

module.exports = admin;
