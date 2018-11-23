'use strict';

/** Configuration Variables.   Any functions the config needs should live within this file since this  */

const p = process.env;
/** Casts a value as a boolean, ie a string containing 'true' */

const boolean = function(value) {
  if (typeof value === 'string') {
    return /^(true|t|yes|y|1)$/i.test(value.trim());
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return false;
};

module.exports = {
  PORT: p.PORT || 5000,
  ENVIRONMENT: p.ENVIRONMENT || 'local',
  MONGODB_URI: p.MONGODB_URI,
  REDIS_URI: p.REDIS_URI,
  TOKEN_SECRET: p.TOKEN_SECRET,
  LOG_LEVEL: p.LOG_LEVEL || 'VERBOSE',
  APP_URL: p.APP_URL || 'https://localhost:4200',
  API_ROOT: p.API_ROOT || 'https://localhost:5000',
  API_URL: `${p.API_ROOT}/api/v1`,
  SITE_NAME: 'Scormify',
  MAILGUN_API: p.MAILGUN_API,
  MAILGUN_DOMAIN: p.MAILGUN_DOMAIN,
  EMAIL_FROM: p.EMAIL_FROM || 'mysampleapp@mysampleapp.com',
  USE_LOCAL_SSL: boolean(p.USE_LOCAL_SSL),
  USE_HELMET: boolean(p.USE_HELMET),
  FORCE_SSL: boolean(p.FORCE_SSL),
  RESTRICT_ORIGINS: boolean(p.RESTRICT_ORIGINS),
  GOOGLE_CLIENTID: p.GOOGLE_CLIENTID,
  GOOGLE_SECRET: p.GOOGLE_SECRET,
  FACEBOOK_APPID: p.FACEBOOK_APPID,
  FACEBOOK_SECRET: p.FACEBOOK_SECRET,
  LINKEDIN_CLIENTID: p.LINKEDIN_CLIENTID,
  LINKEDIN_SECRET: p.LINKEDIN_SECRET,
  GITHUB_CLIENTID: p.GITHUB_CLIENTID,
  GITHUB_SECRET: p.GITHUB_SECRET,
  CONTENTFUL_API: p.CONTENTFUL_API,
  CONTENTFUL_SPACE: p.CONTENTFUL_SPACE,
  PAGE_SIZE: 25
};
