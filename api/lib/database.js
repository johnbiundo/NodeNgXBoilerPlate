'use strict';

const mongoose = require('mongoose');
const bluebird = require('bluebird');
const chalk = require('chalk');

const config = require('./config');

console.log(chalk.blue('Attempting to connect to DB.'));
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true }, err => {
  if (err) {
    console.log(chalk.cyan(err));
  }
});

mongoose.Promise = bluebird;

mongoose.connection.on('connected', () => {
  console.log(chalk.green('Connected to DB, running scripts'));
  require('../db/run-scripts');
});

const gracefulExit = () => {
  mongoose.connection.close(() => {
    console.log(chalk.blue('Closing Mongo connection'));
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
