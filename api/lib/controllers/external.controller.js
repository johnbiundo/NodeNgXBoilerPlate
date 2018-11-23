'use strict';

const AuthenticationStore = require('../stores/authentication.store');
const utils = require('../utilities');
const ApiKey = require('../models/api-key.model');
const SSOToken = require('../models/sso-token.model');
const User = require('../models/user.model');
const sid = require('shortid');
const ident = require('crypto-random-string');
const moment = require('moment');

class ExternalController {
  static async getToken(req, res) {
    if (
      !req.body.client_id ||
      !req.body.client_secret ||
      req.body.grant_type !== 'client_credentials'
    ) {
      return res.status(400).send({
        message: 'Invalid request'
      });
    }
    let requester = await ApiKey.findOne({
      client_id: req.body.client_id,
      client_secret: req.body.client_secret
    })
      .populate('user')
      .exec();
    if (!requester) {
      return res
        .status(404)
        .send('Client credential request yielded no account with specified keys.');
    }
    let payload = {
      access_key: AuthenticationStore.signJwt(requester.user),
      iat: moment().unix(),
      token_type: 'Bearer',
      expires: moment()
        .add(1, 'days')
        .unix()
    };
    return res.status(200).send(payload);
  }

  static async sso(req, res) {
    const token = await SSOToken.findOne({
      token: req.body.providers.sso.token
    });

    if (!token) {
      return res.status(401).send('Access denied.  No provenance token found.');
    }

    const conflict = await User.findOne({
      'providers.sso.id': req.body.providers.sso.id,
      'providers.sso.token': token._id
    });

    if (conflict && conflict.profile.email !== req.body.profile.email) {
      return res
        .status(403)
        .status('Email conflict detected.   SSOID and Email ID must be unique.');
    }
    // swap out for ID.
    req.body.providers.sso.token = token._id;
    User.findOneAndUpdate(
      {
        'providers.sso.id': req.body.providers.sso.id
      },
      {
        $set: req.body
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true
      }
    )
      .then(user => {
        const action = {
          rel: 'redirect',
          href: user.state() === 'OK' ? 'home' : 'profile',
          param: user.state().toLowerCase()
        };
        return res.status(200).send({
          message: 'Success',
          payload: AuthenticationStore.signJwt(user),
          action: action
        });
      })
      .catch(err => {
        utils.helpers.handleError(err);
        res.status(500).send({
          message: 'Error provisioning SSO user.'
        });
      });
  }

  /** Generate API Keys */

  static generateApiKey(req, res) {
    ApiKey.findOneAndUpdate(
      {
        user: req.user
      },
      {
        $set: {
          client_id: sid.generate(),
          client_secret: ident(23),
          user: req.user
        }
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true
      }
    )
      .then(key => {
        return res.status(200).send({
          message: 'API key generated',
          payload: key
        });
      })
      .catch(err => {
        utils.helpers.handleError(err);
        res.status(500).send({
          message: 'Error generating keys'
        });
      });
  }

  static getApiKey(req, res) {
    ApiKey.findOne({
      user: req.user
    })
      .then(key => {
        return res.status(200).send({
          payload: key
        });
      })
      .catch(err => {
        utils.helpers.handleError(err);
        res.status(500).send({
          message: 'Error getting keys'
        });
      });
  }

  static updateApiKey(req, res) {
    ApiKey.findOneAndUpdate(
      {
        user: req.user
      },
      {
        $set: req.body
      }
    )
      .then(key => {
        return res.status(200).send({
          payload: key
        });
      })
      .catch(err => {
        utils.helpers.handleError(err);
        res.status(500).send({
          message: 'Error getting keys'
        });
      });
  }

  static ping(req, res) {
    return res.send();
  }
}

module.exports = ExternalController;
