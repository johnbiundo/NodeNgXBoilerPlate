const mocha = require('mocha');
const assert = require('assert');
const chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

const account = require('../../lib/controllers/account.controller');
const mocks = require('../mocks/account.mocks');

account.removeAll();

describe('Controller.Account', function () {
    describe('Account.Register', function () {
        it('should register a user', function (done) {
            let userMock = {
                body: mocks.user
            };
            result = account.register(userMock);
            console.log(result);
            result.should.exist;
            account.removeAll()
        });
    });
});