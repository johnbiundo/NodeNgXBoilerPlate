'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

const config = require('../config');
const Logger = require('./logger.class');
const Helpers = require('./generic-helpers.class');

const Message = require('../models/message.model');

const mailgun = require('mailgun-js')({
  apiKey: config.MAILGUN_API,
  domain: config.MAILGUN_DOMAIN
});

/** Mailer */

class Mailer {
  /** Send a message
   * @param {Object} - data
   * @prop {string} data.to
   * @prop {string} data.from
   * @prop {string} data.html
   * @prop {string} data.subject
   * @param tpl
   */

  static send(data) {
    return new Promise((resolve, reject) => {
      data.from = data.from || config.EMAIL_FROM;
      data.to = data.to ? data.to : data.profile.email;
      if (!data.to || !data.subject || !data.html) {
        Helpers.handleError('Invalid Email Data', 'Mailer.send');
        reject(new Error('Invalid Email Data'));
      }
      mailgun.messages().send(data, (err, body) => {
        if (err) {
          Helpers.handleError(err, 'Mailer.send');
          reject(err);
        }
        Logger.info('SEND_EMAIL', data, 'Mailer.send', 'MAILER');
        resolve(body);
      });
    });
  }

  /** Abstraction of send, but grabs a premade email template first
   * @param tpl
   * @param {object} params
   */

  static sendTpl(tpl, params) {
    return new Promise((resolve, reject) => {
      this.compileTemplate(tpl, params)
        .then(_data => {
          this.send(_data)
            .then(res => {
              resolve(res);
            })
            .catch(err => reject(err));
        })
        .catch(err => {
          Helpers.handleError(err, 'AccountHelpers.sendTpl');
          reject(err);
        });
    });
  }

  /** Compile an email template
   * @param tpl - Template key
   * @param {object} params - object of params to interpolate into the tpl
   * @returns {object} data
   */

  static compileTemplate(tpl, params) {
    return new Promise((resolve, reject) => {
      params.APP_URL = config.APP_URL;
      console.log(params);
      Message.findOne({ messageType: tpl })
        .then(message => {
          if (!message) {
            Helpers.handleError('Invalid Email Template', 'AccountHelpers.compileTemplate');
            reject(new Error('Invalid Email Template'));
          }
          let template = _.template(message.body);
          message.html = template(params);
          message.from = message.from ? message.from : config.EMAIL_FROM;
          message.to = message.to ? message.to : params.profile.email;
          resolve(message);
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = Mailer;
