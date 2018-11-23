'use strict';

const utils = require('../utilities');

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      default: utils.helpers.generateId(),
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    origin: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'metadata.createdAt',
      updatedAt: 'metadata.updatedAt'
    }
  }
);

module.exports = mongoose.model('SSOToken', schema);
