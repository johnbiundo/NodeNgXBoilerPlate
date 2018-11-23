'use strict';

const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/user.model');
const config = require('../config');
const utils = require('../utilities');

/** Authentication */

class AuthenticationStore {
  static async isAuthenticated(req, res) {
    let outcome = await AuthenticationStore.consumeToken(req);
    return res.send({
      payload: outcome.sub
    });
  }

  /** authenticate */

  static async authenticate(req, res, next) {
    const payload = await AuthenticationStore.consumeToken(req);
    if (payload.status && payload.status !== 200) {
      return res.status(payload.status).send(payload.message);
    }
    req.user = payload.sub;
    req.role = payload.role;
    next();
  }

  static async isAdmin(req, res, next) {
    if (!req.user || req.role !== 'ADMIN') {
      return res.status(401).send('Unauthorized');
    }
    next();
  }

  /** Create a JWT
   * @param user
   */

  static signJwt(user) {
    let payload = {
      sub: user._id,
      role: user.role,
      iat: moment().unix(),
      exp: moment()
        .add(3, 'days')
        .unix()
    };
    return jwt.sign(payload, config.TOKEN_SECRET);
  }

  /** Decode a signed JWT
   * @param token
   */

  static decodeJwt(token) {
    let payload = null;

    try {
      payload = jwt.decode(token, config.TOKEN_SECRET);
    } catch (err) {
      utils.helpers.handleError(err, 'Authentication.authenticate');
    }
    return payload;
  }

  static bearer(token) {
    let payload = this.decodeJwt(token);
    return payload;
  }

  /** Decode a Basic token #PITA */

  static basic(token) {
    return new Promise(async (resolve, reject) => {
      const decoded = Buffer.from(token, 'base64').toString();
      let email = decoded.split(':')[0];
      let pw = decoded.split(':')[1];
      let user = await User.findOne({ 'profile.email': email });
      let isMatch;
      if (!user) {
        resolve();
      } else {
        isMatch = await user.comparePassword(pw);
      }
      if (isMatch) {
        resolve({
          sub: user._id,
          role: user.role,
          iat: moment().unix(),
          exp: moment()
            .add(30, 'minutes')
            .unix()
        });
      } else {
        resolve();
      }
    });
  }
  /** Consume Token */

  static async consumeToken(req) {
    let result = {};
    if (!req.headers.authorization) {
      result.status = 401;
      result.message = 'Please make sure your request has an authorization header';
      return result;
    }
    let token = req.headers.authorization.split(' ')[1];
    let type = req.headers.authorization.split(' ')[0];
    let payload;
    switch (type) {
      case 'Bearer':
        payload = AuthenticationStore.bearer(token);
        break;
      case 'Basic':
        payload = await AuthenticationStore.basic(token);
        break;
      default:
        result.status = 401;
        result.message = 'Invalid token type.  Must be type Bearer or Basic';
        return result;
    }
    if (!payload || !payload.sub) {
      result.status = 401;
      result.message = 'Authorization Denied.';
      return result;
    }

    if (payload.exp <= moment().unix()) {
      result.status = 401;
      result.message = 'Token has expired';
      result.action = {
        rel: 'clearToken'
      };
      return result;
    }
    return payload;
  }
}

module.exports = AuthenticationStore;
