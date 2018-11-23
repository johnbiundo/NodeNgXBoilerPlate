'use strict';

const mongoose = require('mongoose');
const sid = require('shortid');
const ident = require('crypto-random-string');
const utils = require('../utilities');
const origins = require('../origins-cache');

const schema = new mongoose.Schema({
  client_id: {
    type: String,
    default: sid.generate(),
    index: true
  },
  client_secret: {
    type: String,
    default: ident(21),
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  origins: {
    type: Array,
    index: true
  }
});

schema.post('save', function(doc, next) {
  if (this.isNew) {
    utils.logger.info('NEW_API_KEY', this, 'APIKey.Create');
  }
  origins.set();
  next();
});

module.exports = mongoose.model('ApiKey', schema);
