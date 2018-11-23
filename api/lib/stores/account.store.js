'use strict';

const User = require('../models/user.model');
const utils = require('../utilities');
const moment = require('moment');
const mongoose = require('mongoose');
const config = require('../config');

class AccountStore {
  /** sendConfirm - send a confirmation email
   * @param {object} user
   */

  static sendConfirm(user) {
    return new Promise((resolve, reject) => {
      user.code = user.accountCodes
        .filter(x => {
          return (
            x.type === 'CONFIRM' && x.used === false && moment.unix(x.expires) > moment().unix()
          );
        })
        .sort((a, b) => b.expires - a.expires)[0];
      utils.mailer
        .sendTpl('CONFIRM', user)
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  /** Send a password reset email */

  static sendReset(user) {
    return new Promise((resolve, reject) => {
      user.code = user.accountCodes
        .filter(x => {
          return x.type === 'RESET' && x.used === false && moment.unix(x.expires) > moment().unix();
        })
        .sort((a, b) => b.expires - a.expires)[0];
      utils.mailer
        .sendTpl('RESET', user)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /** Confirm a user without a code.
   * @param {string} searchString - text to search on userid or email
   */

  static unsubscribeUserById(searchString) {
    return new Promise((resolve, reject) => {
      let query = [
        {
          'profile.email': searchString
        }
      ];
      if (mongoose.Types.ObjectId.isValid(searchString)) {
        query.push({
          _id: searchString
        });
      }
      User.findOneAndUpdate(
        {
          $or: query
        },
        {
          $set: {
            'status.optInEmail': false
          }
        }
      )
        .then(result => {
          resolve();
        })
        .catch(err => {
          utils.helpers.handleError(err, 'AccountStore.confirmUser');
          reject(err);
        });
    });
  }

  /** Confirm a user without a code.
   * @param {string} searchString - text to search on userid or email
   */

  static confirmUserById(searchString) {
    return new Promise((resolve, reject) => {
      let query = [
        {
          'profile.email': searchString
        }
      ];
      if (mongoose.Types.ObjectId.isValid(searchString)) {
        query.push({
          _id: searchString
        });
      }
      User.findOneAndUpdate(
        {
          $or: query
        },
        {
          $set: {
            'status.confirmed': true
          }
        }
      )
        .then(result => {
          resolve();
        })
        .catch(err => {
          utils.helpers.handleError(err, 'AccountStore.confirmUser');
          reject(err);
        });
    });
  }

  /** Makes sure a code is valid
   * @param user
   * @param code
   */

  static validateCode(user, code) {
    let accountCode;
    accountCode = user.accountCodes.filter(x => {
      return x.code === code;
    })[0];
    let result = 'CODE_INVALID';
    if (!accountCode) {
      result = 'CODE_NOT_FOUND';
      return result;
    }
    result = accountCode.type === 'CONFIRM' ? 'CONFIRM_OK' : 'RESET_OK';
    if (accountCode.type === 'CONFIRM' && user.status.confirmed === true) {
      result = 'CODE_CONFLICT_USER_CONFIRMED';
      return result;
    }
    if (accountCode.used === true) {
      result = 'CODE_INVALID_USED';
      return result;
    }
    if (moment.unix(accountCode.expires) < moment().unix()) {
      result = 'CODE_INVALID_EXPIRED';
      return result;
    }
    if (accountCode.type === 'RESET') {
      result = 'RESET_OK';
    } else {
      result = 'CONFIRM_OK';
    }
    return result;
  }

  /** Use an account code, action/outcome is determined by code type */

  static useAccountCode(req) {
    return new Promise((resolve, reject) => {
      User.findOne({
        'accountCodes.code': req.params.code
      })
        .then(user => {
          if (user) {
            let result = this.validateCode(user, req.params.code);
            let set;
            switch (result) {
              case 'RESET_OK':
                set = {
                  password: req.body.password,
                  'accountCodes.$.used': true
                };
                break;
              case 'CONFIRM_OK':
                set = {
                  'status.confirmed': true,
                  'accountCodes.$.used': true
                };
                break;
              default:
                reject(result);
                break;
            }
            User.findOneAndUpdate(
              {
                'accountCodes.code': req.params.code
              },
              {
                $set: set
              }
            )
              .then(_user => {
                resolve(result);
              })
              .catch(err => {
                reject(err);
              });
          } else {
            reject(new Error('CODE_NOT_FOUND'));
          }
        })
        .catch(err => {
          reject(err);
          utils.helpers.handleError(err, 'AccountStore.confirmUserByCode');
        });
    });
  }

  /** Generate a new code and send it to the user. */

  static resendCode(params) {
    return new Promise((resolve, reject) => {
      let query = [
        {
          'profile.email': params.searchString
        },
        {
          'accountCodes.guid': params.searchString
        }
      ];
      if (mongoose.Types.ObjectId.isValid(params.searchString)) {
        query.push({
          _id: params.searchString
        });
      }
      User.findOne({
        $or: query
      })
        .then(user => {
          if (!user) {
            reject(new Error('RESEND_NOT_FOUND'));
          }
          user.accountCodes.push({
            type: params.type
          });
          user
            .save()
            .then(user => {
              switch (params.type) {
                case 'CONFIRM':
                  this.sendConfirm(user).then(result => {
                    resolve('CONFIRM_RESENT_OK');
                  });
                  break;
                case 'RESET':
                  this.sendReset(user).then(result => {
                    resolve('RESET_RESENT_OK');
                  });
                  break;
                default:
                  reject(new Error('RESEND_ERROR'));
                  break;
              }
            })
            .catch(err => resolve(err));
        })
        .catch(err => {
          utils.helpers.handleError(err, 'AccountStore.resendCode');
          reject(err);
        });
    });
  }

  /** Get all users in the system. */

  static async getAllUsers(req) {
    return new Promise(async (resolve, reject) => {
      const skip = Number(req.query.skip) || 0;
      const limit = req.query.limit || config.PAGE_SIZE;
      let query = {};
      const qs = [];
      if (req.query.search) {
        const search = new RegExp(
          utils.helpers.escapeRegex(decodeURIComponent(req.query.search)),
          'gi'
        );
        query.$or = [{ 'profile.email': search }, { 'profile.lastName': search }];
        qs.push(`&search=${req.query.search}`);
      }
      if (req.query.confirmed) {
        query['status.confirmed'] = true;
        qs.push('&confirmed=true');
      }
      if (req.query.marketing) {
        query['status.optInEmail'] = req.query.marketing;
        qs.push('&marketing=true');
      }
      User.find(query)
        .sort('metadata.createdAt')
        .limit(limit)
        .skip(skip)
        .exec()
        .then(async users => {
          const payload = {};
          payload.payload = users;
          payload.$records = users.length;
          payload.$collectionSize = await User.find(query).count();
          // if the length of users is less than the size of skip, we can assume there are no more records.
          payload.$next =
            users.length < skip
              ? ''
              : `${config.API_URL}/admin/accounts?skip=${skip + config.PAGE_SIZE}${qs.join()}`;
          resolve(payload);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = AccountStore;
