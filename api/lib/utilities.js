'use strict';

const Helpers = require('./helpers/generic-helpers.class');
const Logger = require('./helpers/logger.class');
const Mailer = require('./helpers/mailer.class');
const FSHelper = require('./helpers/fs.class');

/** Utilities
 */

// Note, if you add a reference here to this object, it cannot use the other members of the object... otherwise you get reference errors.

module.exports = {
  mailer: Mailer,
  logger: Logger,
  helpers: Helpers,
  fs: FSHelper
};
