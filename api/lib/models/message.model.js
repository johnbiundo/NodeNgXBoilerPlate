'use strict';

const config = require('../config');

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    messageType: {
      type: String,
      enum: ['CONFIRM', 'RESET'],
      index: true
    },
    from: {
      type: String,
      default: config.EMAIL_FROM
    },
    subject: {
      type: String,
      required: true
    },
    body: {
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

module.exports = mongoose.model('Message', schema);
