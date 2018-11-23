'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      index: true
    },
    name: {
      type: String
    },
    opts: {
      disableScrubber: Boolean
    }
  },
  {
    timestamps: {
      createdAt: 'metadata.createdAt',
      updatedAt: 'metadata.updatedAt'
    }
  }
);

schema.index({ name: 1 });

module.exports = mongoose.model('ObjectTypes', schema);
