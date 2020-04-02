/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { FreedomDividendContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('FreedomDividendContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new FreedomDividendContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"freedom dividend 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"freedom dividend 1002 value"}'));
    });

    describe('#freedomDividendExists', () => {

        it('should return true for a freedom dividend', async () => {
            await contract.freedomDividendExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a freedom dividend that does not exist', async () => {
            await contract.freedomDividendExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createFreedomDividend', () => {

        it('should create a freedom dividend', async () => {
            await contract.createFreedomDividend(ctx, '1003', 'freedom dividend 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"freedom dividend 1003 value"}'));
        });

        it('should throw an error for a freedom dividend that already exists', async () => {
            await contract.createFreedomDividend(ctx, '1001', 'myvalue').should.be.rejectedWith(/The freedom dividend 1001 already exists/);
        });

    });

    describe('#readFreedomDividend', () => {

        it('should return a freedom dividend', async () => {
            await contract.readFreedomDividend(ctx, '1001').should.eventually.deep.equal({ value: 'freedom dividend 1001 value' });
        });

        it('should throw an error for a freedom dividend that does not exist', async () => {
            await contract.readFreedomDividend(ctx, '1003').should.be.rejectedWith(/The freedom dividend 1003 does not exist/);
        });

    });

    describe('#updateFreedomDividend', () => {

        it('should update a freedom dividend', async () => {
            await contract.updateFreedomDividend(ctx, '1001', 'freedom dividend 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"freedom dividend 1001 new value"}'));
        });

        it('should throw an error for a freedom dividend that does not exist', async () => {
            await contract.updateFreedomDividend(ctx, '1003', 'freedom dividend 1003 new value').should.be.rejectedWith(/The freedom dividend 1003 does not exist/);
        });

    });

    describe('#deleteFreedomDividend', () => {

        it('should delete a freedom dividend', async () => {
            await contract.deleteFreedomDividend(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a freedom dividend that does not exist', async () => {
            await contract.deleteFreedomDividend(ctx, '1003').should.be.rejectedWith(/The freedom dividend 1003 does not exist/);
        });

    });

});