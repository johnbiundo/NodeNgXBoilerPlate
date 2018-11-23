'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const utils = require('../utilities');
const chalk = require('chalk');
const AccountCode = require('./account-code.model');
const apiKey = require('./api-key.model');
const config = require('./../config');
const LinksStore = require('./../stores/links.store');

var schema = new mongoose.Schema(
  {
    profile: {
      email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        index: true
      },
      firstName: String,
      lastName: String,
      company: {
        type: String,
        required: false
      },
      jobRole: {
        type: String,
        required: false
      },
      avatar: {
        type: String,
        default: false
      }
    },
    password: String,
    status: {
      confirmed: {
        type: Boolean,
        default: false
      },
      optInEmail: {
        type: Boolean,
        default: false
      },
      eula: {
        type: Boolean,
        default: false
      }
    },
    defaults: [],
    providers: {
      facebook: {
        id: String,
        token: String,
        lastUseDate: Date
      },
      linkedin: {
        id: String,
        token: String,
        lastUseDate: Date
      },
      github: {
        id: String,
        token: String,
        lastUseDate: Date
      },
      google: {
        id: String,
        token: String,
        lastUseDate: Date
      },
      sso: {
        id: String,
        token: String,
        lastUseDate: Date
      }
    },
    role: {
      type: String,
      default: 'END_USER',
      enum: ['END_USER', 'TESTER', 'ADMIN']
    },
    accountCodes: [AccountCode],
    metadata: {
      lastLogin: {
        type: Date,
        default: Date.now
      },
      logins: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: {
      createdAt: 'metadata.createdAt',
      updatedAt: 'metadata.updatedAt'
    }
  }
);

// Indexes

schema.index({ 'profile.email': 1, _id: 1 });
schema.index({ 'accountCodes.guid': 1, 'profile.email': 1 });
schema.index(
  {
    'profile.email': 1,
    'profile.lastName': 1,
    'status.confirmed': 1,
    'status.optInEmail': 1,
    'metadata.createdAt': 1
  },
  { background: true }
);

// Virtuals (Computed Props)

schema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

schema.virtual('profile.initials').get(function() {
  return `${this.profile.firstName
    .substring(0, 1)
    .toUpperCase()}${this.profile.lastName.substring(0, 1).toUpperCase()}`;
});

schema.virtual('isAdmin').get(function() {
  return this.role === 'ADMIN';
});

schema.virtual('$resource').get(function() {
  return `${config.API_URL}/account/${this._id}`;
});

schema.virtual('$adminLinks').get(function() {
  return LinksStore.getUserAdminLinks(this);
});
schema.virtual('$adminActions').get(function() {
  return LinksStore.getUserAdminActions(this);
});

// Hook

schema.pre('save', function(next) {
  if (this.isModified('metadata.logins') || this.isModified('metadata.lastLogin') || this.isNew) {
    return next();
  }
  this.metadata.updatedAt = Date.now();

  next();
});

schema.pre('update', function(next) {
  const doc = this.getUpdate();
  doc.metadata.updatedAt = Date.now();

  next();
});

schema.pre('update', function(next) {
  const password = this.getUpdate().$set.password;
  if (!password) {
    return next();
  }
  try {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    this.getUpdate().$set.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

schema.pre('findOneAndUpdate', function(next) {
  const password = this.getUpdate().$set.password;
  if (!password) {
    return next();
  }
  try {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    this.getUpdate().$set.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// This is for registration

schema.pre('save', function(next) {
  let self = this;
  if (!self.isModified('password')) {
    return next();
  }
  bcrypt
    .genSalt(10)
    .then(function(salt) {
      bcrypt
        .hash(self.password, salt)
        .then(function(hash) {
          self.password = hash;
          next();
        })
        .catch(err => {
          utils.helpers.handleError(err, 'UserSchema.middleware.hash');
        });
    })
    .catch(err => {
      utils.helpers.handleError(err, 'UserSchema.middleware.salt');
    });
});
schema.post('update', function(err, doc, next) {
  if (err.code === 11000) {
    next(new Error('Email must be unique.'));
  } else {
    next(err);
  }
});

schema.post('findOneAndUpdate', function(err, doc, next) {
  if (err.code === 11000) {
    next(new Error('Email must be unique.'));
  } else {
    next(err);
  }
});

schema.post('save', function(doc, next) {
  if (this.isNew) {
    utils.logger.info('REGISTER_USER', this, 'Account.Register');
  } else if (
    (!this.isModified('metadata.logins') ||
      !this.isModified('metadata.lastLogin') ||
      !this.isModified('metadata.updatedAt')) &&
    this.isModified()
  ) {
    utils.logger.info('UPDATE_USER', this, 'Account.updateProfile');
  }
  next();
});

schema.post('update', function(doc, next) {
  if (
    (!this.isModified('metadata.logins') || !this.isModified('metadata.lastLogin')) &&
    !this.isNew
  ) {
    utils.logger.info('UPDATE_USER', this, 'Account.updateProfile');
  }
  next();
});

schema.post('remove', function(doc, next) {
  apiKey
    .remove({
      user: doc._id
    })
    .then(res => {
      utils.logger.info('REMOVE_USER', doc, 'Account.updateProfile');
      next();
    })
    .catch(err => {
      utils.helpers.handleError(err);
    });
});

schema.methods.comparePassword = function(password) {
  let hash = this.password;
  return new Promise(function(resolve, reject) {
    bcrypt.compare(password, hash, function(err, isMatch) {
      if (err) {
        reject(err);
      }
      resolve(isMatch);
    });
  });
};

schema.methods.state = function() {
  if (
    !this.profile.email ||
    !this.profile.lastName ||
    !this.profile.firstName ||
    !this.status.confirmed
  ) {
    return 'INVALID';
  } else if (!this.profile.company || !this.profile.jobRole || !this.password) {
    return 'PARTIAL';
  }
  return 'OK';
};

schema
  .set('toJSON', {
    getters: true,
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.password;
      delete ret.accountCodes;
      return ret;
    }
  })
  .set('toObject', { getters: true });

module.exports = mongoose.model('User', schema);
