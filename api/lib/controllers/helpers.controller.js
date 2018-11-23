'use strict';

class HelperController {
  static get(req, res) {
    return res.send({ message: 'OK' });
  }

  static getAll(req, res) {
    return res.send({ message: 'OK' });
  }
}

module.exports = HelperController;
