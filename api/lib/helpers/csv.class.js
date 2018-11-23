'use strict';

const json2csv = require('json2csv').parse;

class CSVHelper {
  toCsv(data, fields) {
    return new Promise((resolve, reject) => {
      const opts = { fields };
      try {
        resolve(json2csv(data, opts));
      } catch (ex) {
        reject(ex);
      }
    });
  }
}

module.exports = CSVHelper;
