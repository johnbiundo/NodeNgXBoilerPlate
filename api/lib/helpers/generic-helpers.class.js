'use strict';

const Logger = require('./logger.class');
const uuid = require('uuid/v4');
/** Generic Helpers */
class Helpers {
  /** handleError
   * @param error
   * @param source
   * @returns null
   */

  static handleError(err, source = 'ASYNC', event = 'APP') {
    Logger.error(err, source, event).catch(err => console.log(err));
  }

  /** Generates a random string without dashes */
  static generateId() {
    let id = uuid();
    return id.replace(/-/g, '');
  }

  /** Takes an array containing an object with an array.    Returns a flat array. */

  static flatten(arr, prop) {
    const _list = [];
    for (let i = 0; i < arr.length; i++) {
      for (let x = 0; x < arr[i][prop].length; x++) {
        _list.push(arr[i][prop][x]);
      }
    }
    return _list;
  }

  static escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}

module.exports = Helpers;
