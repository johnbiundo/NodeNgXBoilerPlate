'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const uuid = require('uuid/v4');
const utils = require('../utilities');

const schema = new mongoose.Schema(
  {
    guid: {
      type: String,
      default: uuid(),
      index: true
    },
    code: {
      type: String,
      default: utils.helpers.generateId(),
      index: true
    },
    expires: {
      type: String,
      default: moment()
        .add(1, 'days')
        .unix()
    },
    type: {
      type: String,
      default: 'CONFIRM'
    },
    used: { type: Boolean, default: false }
  },
  {
    timestamps: {
      createdAt: 'metadata.createdAt',
      updatedAt: 'metadata.updatedAt'
    }
  }
);

module.exports = schema;
