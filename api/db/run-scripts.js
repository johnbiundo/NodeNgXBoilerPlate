'use strict';

const chalk = require('chalk');

/** Insert Data needed by the application */
console.log(chalk.blue('Running Scripts'));
require('./scripts/emails.script');
require('./scripts/styles.script');
require('./scripts/sso-tokens.script');
require('./scripts/object-types.script');
require('./scripts/api-keys.script');
require('./scripts/admin.script');
require('./scripts/test-data.script');
require('./scripts/templates.script');
console.log(chalk.green('Done running scripts'));
