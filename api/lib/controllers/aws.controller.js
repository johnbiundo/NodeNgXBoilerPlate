'use strict';

const S3 = require('lazy-s3');
const s3 = new S3();

class AWSController {
    static async get(req, res) {
        try {
            const result = s3.download(req.body.key);
            return res.send({
                payload: result
            });
        } catch (ex) {
            return res.status(400).send({
                message: ex
            });
        }
    }

    static async post(req, res) {
        try {
            const result = s3.upload(req.body.key);
            return res.send({
                payload: result
            });
        } catch (ex) {
            return res.status(400).send({
                message: ex
            });
        }
    }

    static async delete(req, res) {
        try {
            const result = s3.deleteS3Object(req.body.key);
            return res.send({
                payload: result
            });
        } catch (ex) {
            return res.status(400).send({
                message: ex
            });
        }
    }

    static async getSignedUrl(req, res) {
        try {
            const result = await s3.getSignedUrl(req.params.key);
            return res.send({
                payload: result
            });
        } catch (ex) {
            return res.status(400).send({
                message: ex
            });
        }
    }
}

module.exports = AWSController;