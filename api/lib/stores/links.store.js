'use strict';

const config = require('../config');

class LinksStore {
  static getUserAdminLinks(user) {
    const links = [];
    links.push({
      rel: 'page',
      href: `${config.APP_URL}/admin/user/${user._id}`
    });
    return links;
  }

  static getUserAdminActions(user) {
    const actions = [];
    if (user.role !== 'ADMIN') {
      actions.push({
        rel: 'user-delete',
        text: 'Delete Account',
        method: 'DELETE',
        icon: 'faTrash',
        css: 'text-danger',
        href: `${config.API_URL}/account/${user._id}`
      });
      actions.push({
        rel: 'user-promote',
        text: 'Promote',
        method: 'PATCH',
        icon: 'faLevelUpAlt',
        css: 'text-primary',
        href: `${config.API_URL}/admin/account/role/${user._id}/ADMIN`
      });
    }
    if (user.role === 'ADMIN') {
      actions.push({
        rel: 'user-demote',
        text: 'Demote',
        method: 'PATCH',
        icon: 'faLevelDownAlt',
        css: 'text-primary',
        href: `${config.API_URL}/admin/account/role/${user._id}/END_USER`
      });
    }
    if (!user.status.confirmed) {
      actions.push({
        rel: 'user-confirm',
        text: 'Confirm',
        icon: 'faCheck',
        css: 'text-primary',
        method: 'PATCH',
        href: `${config.API_URL}/admin/account/confirm/${user._id}`
      });
    }
    if (user.status.optInEmail) {
      actions.push({
        rel: 'user-unsubscribe',
        text: 'Unsubscribe',
        method: 'PATCH',
        icon: 'faEnvelope',
        css: 'text-primary',
        href: `${config.API_URL}/admin/account/unsubscribe/${user._id}`
      });
    }
    return actions;
  }

  static getStyleLinks(style) {
    const links = [];
      links.push({
        rel: 'page',
        href: `${config.APP_URL}/style/${style._id}`
      });
      links.push({
        rel: 'self',
        href: `${config.API_URL}/style/${style._id}`
      });
      links.push({
        rel: 'update',
        method: 'PUT',
        href: `${config.API_URL}/style/${style._id}`
      });
    return links;
  }

  static getStyleActions(style) {
    const actions = [];
    actions.push({
      rel: 'style-delete',
      text: 'Delete Style',
      method: 'DELETE',
      icon: 'faTrash',
      css: 'text-danger',
      href: `${config.API_URL}/account/${style._id}`
    });
     return actions;
  }
}
module.exports = LinksStore;
