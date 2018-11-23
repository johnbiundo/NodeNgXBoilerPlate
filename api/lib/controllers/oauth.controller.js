'use strict';

const OAuthStore = require('../stores/oauth.store');
const AuthenticationStore = require('../stores/authentication.store');
const User = require('../models/user.model');

class OAuthController {

    // NOTE: Facebook and Google are handled via the direct upsert since oAuth is not really needed.

    static async linkLi(req, res) {
        try {
            const result = await OAuthStore.linkLi(req.body.code);
            return res.send(OAuthController.linkSuccess(result));
        } catch (ex) {
            return res.status(500).send(ex);
        }
    }
    static async linkGh(req, res) {
        try {
            const result = await OAuthStore.linkGh(req.body.code);
            return res.send(OAuthController.linkSuccess(result));
        } catch (ex) {
            return res.status(500).send(ex);
        }
    }

    static async directUpsert(req, res) {
        try {
            const result = await OAuthStore.upsertOAuthUser(req.body.provider, req.body.profile);
            return res.send(OAuthController.linkSuccess(result));
        } catch (ex) {
            return res.status(500).send(ex);
        }
    }

    static linkSuccess(result) {
        return {
            message: result.isNew ? 'Thanks for signing up and welcome!   Please take a moment to complete your profile and set an optional password.' : 'Sign in Success',
            payload: AuthenticationStore.signJwt(result.payload),
            action: {
                rel: 'redirect',
                href: result.isNew ? 'profile' : 'home'
            }
        };
    }

    static async unlink(req, res) {
        User.findOne({
            $or: [{
                _id: req.user
            }, {
                _id: req.params.searchString
            }, {
                email: req.params.searchString
            }]
        }).then(user => {
            console.log(user['providers'][req.params.provider]['id']);
            user['providers'][req.params.provider]['id'] = undefined;
            user.save().then(result => {
                res.send({
                    message: 'OK'
                });
            }).catch(err => {
                res.status(400).send({
                    message: 'Error unlinking account'
                })
            })

        }).catch(err => {
            res.status(400).send({
                message: 'Error unlinking account'
            })
        });

    }
}

module.exports = OAuthController;