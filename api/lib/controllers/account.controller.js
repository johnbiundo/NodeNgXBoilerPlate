'use strict';

const AccountStore = require('../stores/account.store');
const AuthStore = require('../stores/authentication.store');
const utils = require('../utilities');
const moment = require('moment');
const User = require('../models/user.model');

class AccountController {
  static self(req, res) {
    User.findById(req.user)
      .then(user => {
        return res.send({
          payload: user
        });
      })
      .catch(err => {
        utils.helpers.handleError(err, 'Account.self');
        return res.status(500).send('Error retrieving account');
      });
  }

  static async register(req, res) {
    let user = new User(req.body);
    user.accountCodes.push({
      type: 'CONFIRM'
    });
    user
      .save()
      .then(newUser => {
        AccountStore.sendConfirm(newUser)
          .then(resp => {
            res.status(200).send({
              message: 'Registration Succesful',
              action: {
                rel: 'redirect',
                href: 'confirm',
                param: newUser.accountCodes[0].guid
              }
            });
          })
          .catch(err => {
            utils.helpers.handleError(err, 'Account.register.sendConfirm');
            return res.status(500).send('Error sending account confirmation email.');
          });
      })
      .catch(err => {
        utils.helpers.handleError(err.message, 'Account.register');
        return res.status(500).send({
          message: err.message
        });
      });
  }

  static login(req, res) {
    User.findOne({
      'profile.email': req.body.profile.email.toLowerCase()
    })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'Please check your username and password.'
          });
        }
        user
          .comparePassword(req.body.password)
          .then(isMatch => {
            if (!isMatch) {
              return res.status(404).send({
                message: 'Please check your username and password.!'
              });
            }
            if (!user.status.confirmed) {
              const code = user.accountCodes
                .filter(x => x.type === 'CONFIRM' && x.used === false)
                .sort((a, b) => b.expires - a.expires)[0].guid;
              return res.status(400).send({
                message: 'Please verify your account.',
                action: {
                  rel: 'redirect',
                  href: 'confirm',
                  param: code ? code.guid : undefined
                }
              });
            }
            // Good to go.
            user.metadata.loginCount += 1;
            user.metadata.lastLogin = new Date();
            user.save();
            return res.status(200).send({
              message: 'Sign in succesful',
              payload: AuthStore.signJwt(user),
              action: {
                rel: 'redirect',
                href: 'home'
              }
            });
          })
          .catch(err => {
            utils.helpers.handleError(err, 'Account.login');
            return res.status(400).send({
              message: 'Error logging you in.'
            });
          });
      })
      .catch(err => {
        utils.helpers.handleError(err, 'Account.login');
        return res.status(500).send(err);
      });
  }

  static confirm(req, res) {
    AccountStore.useAccountCode(req)
      .then(result => {
        return res.status(200).send({
          message: 'Account confirmed.',
          action: {
            rel: 'redirect',
            href: 'login'
          }
        });
      })
      .catch(err => {
        let error;
        switch (err) {
          case 'CODE_INVALID_EXPIRED':
            error = {
              message: 'Code expired.   Use the resend button to get a new code.',
              key: err
            };
            break;
          case 'CODE_CONFLICT_USER_CONFIRMED':
            error = {
              message: 'Your account is already confirmed. Redirecting you to the login page.',
              key: err,
              action: {
                rel: 'redirect',
                href: 'login'
              }
            };
            break;
          case 'CODE_INVALID_USED':
            error = {
              message: 'This code has already been used.  Use the resend button to get a new code.',
              key: err
            };
            break;
          default:
            error = {
              message:
                'Code not found.   Use the resend button to get a new one if you are unable to locate your code.',
              key: err
            };
            break;
        }
        res.status(500).send(error);
      });
  }

  static forgotPassword(req, res) {
    User.findOneAndUpdate(
      {
        'profile.email': req.body.profile.email
      },
      {
        $push: {
          accountCodes: {
            type: 'RESET'
          }
        }
      }
    )
      .then(user => {
        if (!user) {
          return res.status(404).send('Account not found.');
        }
        user.code = user.accountCodes
          .filter(x => {
            return (
              x.type === 'RESET' && x.used === false && moment.unix(x.expires) > moment().unix()
            );
          })
          .sort((a, b) => b.expires - a.expires)[0];
        AccountStore.sendReset(user)
          .then(result => {
            return res.status(200).send({
              message: 'Password reset email sent',
              action: {
                rel: 'redirect',
                href: 'reset-password',
                param: user.code.guid
              }
            });
          })
          .catch(err => {
            return res.status(400).send(err);
          });
      })
      .catch(err => {
        utils.helpers.handleError(err, 'Account.forgotPassword');
        return res.status(500).send('Error Generating code');
      });
  }

  static resetPassword(req, res) {
    AccountStore.useAccountCode(req)
      .then(result => {
        return res.status(200).send({
          message: 'Password reset.',
          action: {
            rel: 'redirect',
            href: 'login'
          }
        });
      })
      .catch(err => {
        res.status(409).send(err);
      });
  }

  static update(req, res) {
    User.findByIdAndUpdate(req.params._id, {
      $set: req.body
    })
      .then(result => {
        return res
          .send({
            message: 'Success'
          })
          .status(200);
      })
      .catch(err => {
        utils.helpers.handleError(err);
        return res.send(400).send('Error saving.');
      });
  }

  static remove(req, res) {
    User.findById(req.params._id)
      .then(async doc => {
        await doc.remove();
        res.status(200).send({
          message: 'User removed'
        });
      })
      .catch(err => utils.helpers.handleError(err, 'Account.remove'));
  }

  static removeAll(req, res) {
    User.find({})
      .then(async docs => {
        for (let doc of docs) {
          await doc.remove();
        }
        res.status(200).send({
          message: 'Users removed'
        });
      })
      .catch(err => utils.helpers.handleError(err, 'Account.remove'));
  }

  static emailIsAvailable(req, res) {
    User.findOne({
      'profile.email': req.params.email
    })
      .then(user => {
        if (user) {
          return res.status(200).send({
            payload: false
          });
        }
        return res.status(200).send({
          payload: true
        });
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  }

  /** precheck makes it so confirming your account or resetting your password is two factor authentication.
   * @param searchSting
   */

  static precheckCode(req, res) {
    User.findOne({
      $or: [
        {
          'accountCodes.guid': req.params.searchString
        },
        {
          'profile.email': req.params.searchString
        }
      ]
    })
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'Unable to precheck your account.  No account was found.'
          });
        }
        return res.status(200).send({
          message: 'OK',
          payload: user
        });
      })
      .catch(err => {
        utils.helpers.handleError(err, 'Account.precheck');
        return res.status(500).send({
          message: 'Error attempting to precheck your account.'
        });
      });
  }

  static resendCode(req, res) {
    AccountStore.resendCode(req.body)
      .then(result => {
        return res.status(200).send({
          message: 'New code sent.   Check your email.',
          payload: result
        });
      })
      .catch(err => {
        utils.helpers.handleError(err);
        return res.status(500).send({});
      });
  }

  static role(req, res) {
    const result = User.findOneAndUpdate(
      {
        $or: [
          {
            _id: req.user
          },
          {
            _id: req.params.searchString
          },
          {
            email: req.params.searchSting
          }
        ]
      },
      {
        $set: {
          role: req.body.role
        }
      }
    );
    res.send({
      message: 'Success',
      payload: result
    });
  }

  static async confirmUserById(req, res) {
    await AccountStore.confirmUserById(req.params.searchString);
    res.send({
      message: 'Success'
    });
  }

  static async unsubscribeUserById(req, res) {
    await AccountStore.unsubscribeUserById(req.params.searchString);
    res.send({
      message: 'Unsubscribe Success'
    });
  }

  static async getById(req, res) {
    const user = await User.findById(req.params._id);
    res.send({
      payload: user
    });
  }

  /** Get all users.
   * @example   /v1/account/users?skip=25
   */

  static async getAll(req, res) {
    let payload = await AccountStore.getAllUsers(req);
    res.send(payload);
  }
}

module.exports = AccountController;
