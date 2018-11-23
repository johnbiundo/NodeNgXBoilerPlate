'use strict';

const compression = require('compression');
const helmet = require('helmet');
const config = require('./config');
const utils = require('./utilities');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const origins = require('./origins-cache');

// Authentication middleware is in the authentication store.

module.exports = function(app) {
  console.log(`Configuring Middleware for ${config.ENVIRONMENT}`);
  /** Use CORS.   If RESTRICT_ORIGINS is enabled, only certain domains can call the API. **/
  if (config.ENVIRONMENT === 'production' || config.RESTRICT_ORIGINS) {
    console.log('Configuring CORS with Restricted Origins');
    const corsOptionsDelegate = async (req, callback) => {
      let corsOptions;
      let _origins = await origins.getAsync();
      let __origin;
      if (_origins) {
        __origin = _origins
          .map(x => {
            return x;
          })
          .indexOf(req.header('Origin'));
      }
      if (__origin !== -1) {
        corsOptions = {
          origin: true
        };
      } else {
        corsOptions = {
          origin: false
        };
      }
      callback(null, corsOptions);
    };
    app.use(cors(corsOptionsDelegate));
    app.options('*', cors(corsOptionsDelegate));
  } else {
    console.log('Configuring generic CORS');
    app.use(cors());
  }

  /** Enable bodyParser for JSON and Form Data */
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(morgan('tiny'));

  /** Use Compression */
  app.use(compression());

  /** Use Helmet */
  if (config.ENVIRONMENT === 'production' || config.USE_HELMET) {
    app.use(helmet());

    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          fontSrc: ["'self', 'assets-cdn.github.com'"],
          styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
        }
      })
    );
  }
  /** Enforce SSL.   Rejects the request outright.   */
  if (config.ENVIRONMENT === 'production' || config.FORCE_SSL) {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }

  /** Catch Errors */
  app.use(function(err, req, res, next) {
    utils.helpers.handleError(err);
    next();
  });
};
