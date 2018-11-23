'use strict';

global.Promise = require('bluebird');

const express = require('express');
const fs = require('fs');
const https = require('https');
const chalk = require('chalk');
const app = express();

require('./database');
require('./middleware')(app);
require('./routes/index.js')(app);

const config = require('./config');
const options = {}; // hoist
const path = require('path');

function start() {
  if (config.ENVIRONMENT === 'production' || config.ENVIRONMENT === 'stage') {
    console.log('Configuring for serving local files.');
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  // Should always be set to true - use openssl to generate a certificate and place it in the ssl folder
  if (config.USE_LOCAL_SSL) {
    options.key = fs.readFileSync(path.resolve(__dirname, '../../ssl/private.key'));
    options.cert = fs.readFileSync(path.resolve(__dirname, '../../ssl/mysampleapp.crt'));
    console.log(chalk.green(`HTTPs server listening on ${config.PORT}`));
    https.createServer(options, app).listen(config.PORT);
  } else {
    console.log(chalk.green(`HTTP server listening on ${config.PORT}`));
    app.listen(config.PORT);
  }
}

module.exports = {
  start: start,
  app: app
};
