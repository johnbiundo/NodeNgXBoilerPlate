'use strict';

const User = require('../models/user.model');
const utils = require('../utilities');
const request = require('request-promise');
const config = require('../config');

class OAuthStore {
    /** Link a LinkedIn Account  */
    static async linkLi(code) {
        return new Promise(async(resolve, reject) => {
            try {
                const accessCode = await request({
                    method: 'POST',
                    uri: `https://www.linkedin.com/oauth/v2/accessToken`,
                    json: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        code: code,
                        client_id: '863wbzo04o3vfc', // config.LINKEDIN_CLIENTID,
                        client_secret: 'BBQN6tke7spEzLPS', // config.LINKEDIN_SECRET,
                        grant_type: 'authorization_code',
                        redirect_uri: `${config.APP_URL}/oauth/linkedin`
                    }
                });
                try {
                    const result = await request({
                        method: 'GET',
                        uri: 'https://api.linkedin.com/v1/people/~:(id,email-address,first-name,last-name,positions,picture-url)?format=json',
                        json: true,
                        headers: {
                            Authorization: `Bearer ${accessCode.access_token}`
                        }
                    });
                    try {
                        const user = await OAuthStore.upsertOAuthUser({
                            type: 'linkedin',
                            id: result.id
                        }, {
                            firstName: result.firstName,
                            lastName: result.lastName,
                            email: result.emailAddress,
                            avatar: result.pictureUrl,
                            company: result.positions.values[0].company.name,
                            jobRole: result.positions.values[0].title
                        });
                        resolve(user);
                    } catch (ex) {
                        reject(ex);
                    }
                } catch (ex) {
                    return reject(ex.body);
                }
            } catch (ex) {
                return reject(ex);
            }
        });
    }

    /** Link a Github Account  */
    static async linkGh(code) {
        return new Promise(async(resolve, reject) => {
            try {
                const accessCode = await request({
                    method: 'POST',
                    uri: `https://github.com/login/oauth/access_token`,
                    json: true,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: {
                        code: code,
                        client_id: '7345d437f762a32e5dd4', // config.GITHUB_CLIENTID,
                        client_secret: 'f4a6041716097af46836799574414140d54fefd0' // config.GITHUB_CLIENTID,
                    }
                });
                try {
                    const result = await request({
                        method: 'GET',
                        uri: 'https://api.github.com/user',
                        json: true,
                        headers: {
                            Authorization: `token ${accessCode.access_token}`,
                            'User-Agent': 'Scormify.io'
                        }
                    });
                    try {
                        const user = await OAuthStore.upsertOAuthUser({
                            type: 'github',
                            id: result.id
                        }, {
                            firstName: result.name
                                .split(' ')
                                .slice(0, -1)
                                .join(' '),
                            lastName: result.name
                                .split(' ')
                                .slice(-1)
                                .join(' '),
                            email: result.email,
                            company: result.company ? result.company : undefined,
                            avatar: result.avatar_url
                        });
                        resolve(user);
                    } catch (ex) {
                        reject(ex);
                    }
                } catch (ex) {
                    return reject(ex);
                }
            } catch (ex) {
                return reject(ex);
            }
        });
    }

    /** Upsert oAuth User */

    static upsertOAuthUser(provider, profile) {
        return new Promise((resolve, reject) => {
            const query = {
                providers: {
                    [provider.type]: {
                        id: provider.id
                    }
                }
            };
            User.findOne({
                    $or: [{
                            'profile.email': profile.email
                        },
                        query
                    ]
                })
                .then(user => {
                    let isNew = true;  // hoist
                    let isLinked = false;
                    if (!user) {
                        user = new User();
                        user.profile = profile;
                    } else if (user) {
                        isNew = false; // Existing user.
                        isLinked = !!user['providers'][provider.type]['id']; // See if this is the first time they're linking the account.
                        user.profile.firstName = user.profile.firstName || profile.firstName;
                        user.profile.lastName = user.profile.lastName || profile.lastName;
                        user.profile.avatar = profile.avatar || user.profile.avatar; // Reverse.
                        user.profile.email = user.profile.email || profile.email;
                        user.password = user.password || undefined;
                    }
                    user.status.confirmed = true;
                    user['providers'][provider.type]['id'] = provider.id;
                    user['providers'][provider.type]['lastUseDate'] = Date.now();
                    user['providers'][provider.type]['token'] = provider.token ? provider.token : undefined;
                    user.metadata.lastLogin = Date.now();
                    user
                        .save()
                        .then(_user => {
                            resolve({
                                payload: _user,
                                isNew: isNew,
                                isLinked: isLinked
                            });
                        })
                        .catch(err => reject(err));
                })
                .catch(err => {
                    utils.helpers.handleError(err);
                    reject(err);
                });
        });
    }
}

module.exports = OAuthStore;