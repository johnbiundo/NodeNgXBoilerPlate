'use strict';

const NodeCache = require('node-cache');
const chalk = require('chalk');
const origins = new NodeCache();
const ApiKey = require('./models/api-key.model');
const utils = require('./utilities');
const cache = {};

cache.set = () => {
    return new Promise((resolve, reject) => {
        ApiKey.find().select('origins').exec().then(keys => {
            origins.set('origins', utils.helpers.flatten(keys, 'origins'), (err, success) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                if (!err && success) {
                    console.log(chalk.green('Origin Data set'));
                    resolve(success);
                }
            });
        });
    });
};
cache.get = () =>
    origins.get('origins', (err, value) => {
        if (!err) {
            if (value === undefined) {
                // key not found
            } else {
                return value;
            }
        }
    });

cache.getAsync = async() =>
    await origins.get('origins', function(err, value) {
        if (!err) {
            if (value == undefined) {
                // key not found
            } else {
                return value;
            }
        }
    });

cache.set();

module.exports = cache;