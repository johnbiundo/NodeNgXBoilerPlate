'use strict';

const config = require('../config');
const contentful = require('contentful');

class ContentController {
  static async get(req, res) {
    const client = contentful.createClient({
      accessToken: config.CONTENTFUL_API,
      space: config.CONTENTFUL_SPACE
    });
    client
      .getEntries()
      .then(response => {
        res.send({ payload: response });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
}

module.exports = ContentController;
