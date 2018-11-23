const ApiKey = require('../../lib/models/api-key.model');
const utils = require('../../lib/utilities');

ApiKey.findOneAndUpdate(
  {
    origins: {
      $in: ['https://localhost:4200', 'https://v2mysampleappstage.herokuapp.com']
    }
  },
  {
    $set: {
      client_id: 'C8193FCF99C7440FBF01515BAD5F3C65',
      client_secret: 'CA95980819284122AB22399EB73CD8BD',
      origins: [
        'https://localhost:4200',
        'https://v2mysampleappstage.herokuapp.com'
      ]
    }
  },
  {
    upsert: true,
    setDefaultsOnInsert: true
  }
).catch(err => utils.helpers.handleError(err, 'db.apikey.insert'));
