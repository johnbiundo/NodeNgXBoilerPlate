'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['REGISTER_USER', 'SEND_EMAIL', 'UPDATE_USER', 'REMOVE_USER', 'APP']
    },
    source: {
      type: String,
      required: true
    },
    body: String,
    component: {
      type: String,
      required: false,
      enum: ['MAILER', 'ACCOUNT', 'GENERIC']
    },
    level: {
      type: String,
      default: 'INFO',
      enum: ['INFO', 'WARN', 'ERROR'],
      uppercase: true,
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

module.exports = mongoose.model('Log', schema);

