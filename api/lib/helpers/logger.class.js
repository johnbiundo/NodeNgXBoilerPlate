'use strict';

const Log = require('../models/log.model');
const config = require('../config');

/** Logger */
class Logger {
  /** info
   * @param event
   * @param body
   * @param source
   */

  static info(event, body, source, component = 'GENERIC') {
    let entry = new Log({
      event: event,
      body: body,
      source: source,
      level: 'INFO'
    });
    if (config.LOG_LEVEL === 'VERBOSE') {
      console.log(entry);
    }
    entry.save().catch(err => console.log(err));
  }

  /** Error
   * @param err
   * @param source
   * @param event
   */
  static error(err, source, event = 'app', component = 'GENERIC') {
    return new Promise((resolve, reject) => {
      if (config.LOG_LEVEL !== 'SILENT') {
        console.log(err);
      }
      let entry = new Log({
        event: event,
        source: source,
        body: err,
        level: 'ERROR',
        component: component
      });
      entry.save().catch(err => console.log(err));
    });
  }
}

module.exports = Logger;
