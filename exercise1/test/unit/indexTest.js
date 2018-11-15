const sinon = require('sinon');
const expect = require('chai').expect;
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
AWSMock.setSDKInstance(AWS);
const fs = require('fs');

describe('index', function () {

    describe('#handler', function () {

        const indexBody = 'file1.txt\nfile2.txt\nfile3.txt\n';
        const newFileName = 'sample.text';
        const newIndexBody = indexBody + newFileName + "\n";
        const expectedNewIndex = {
            Bucket: "some-bucket",
            Key: "index.lst",
            Body: newIndexBody
        };

        let getObjectStub;
        let putObjectStub;
        let index;
        let sampleIndex;
        let sampleEvent;

        before(function () {
            sampleIndex = JSON.parse(fs.readFileSync('./test/data/sampleIndex.json').toString());
            sampleEvent = JSON.parse(fs.readFileSync("./test/data/sampleEvent.json").toString());
            getObjectStub = sinon.stub();
            getObjectStub.returns(Promise.resolve(sampleIndex));
            putObjectStub = sinon.stub();
            putObjectStub.returns(Promise.resolve());
            AWSMock.mock('S3', 'getObject', getObjectStub);
            AWSMock.mock('S3', 'putObject', putObjectStub);
            index = require("../../index");
        });

        after(function () {
            AWSMock.restore();
            sinon.restore();
        });

        afterEach(function () {
            getObjectStub.resetHistory();
            putObjectStub.resetHistory();
        });

        it('Should call getObject and then putObject functions of AWS SDK', async () => {
            await index.handler(sampleEvent, {});

            expect(getObjectStub.calledOnce).to.be.true;
            expect(putObjectStub.calledOnce).to.be.true;
        });

        it('Should add "sample.text" to the index.lst when passed sampleEvent', async () => {

            await index.handler(sampleEvent, {});

            const putObjCallArgs = putObjectStub.firstCall.args[0];
            expect(putObjCallArgs.Bucket).to.be.equal(expectedNewIndex.Bucket);
            expect(putObjCallArgs.Key).to.be.equal(expectedNewIndex.Key);
            expect(putObjCallArgs.Body).to.be.equal(expectedNewIndex.Body);
        });

        it('Should handle "NoSuchKey" error when no "index.lst" exists', async () => {
            const noSuchKeyError = JSON.parse(fs.readFileSync("./test/data/noSuchKeyError.json").toString());
            getObjectStub.returns(Promise.reject(noSuchKeyError));

            await index.handler(sampleEvent, {});

            const putObjCallArgs = putObjectStub.firstCall.args[0];
            expect(putObjCallArgs.Bucket).to.be.equal(expectedNewIndex.Bucket);
            expect(putObjCallArgs.Key).to.be.equal(expectedNewIndex.Key);
            expect(putObjCallArgs.Body).to.be.equal(newFileName + '\n');
        });

        it('Should ignore events on "index.lst"', async () => {
            const indexPutEvent = JSON.parse(fs.readFileSync("./test/data/indexPutEvent.json").toString());

            await index.handler(indexPutEvent, {});

            expect(getObjectStub.called).to.be.false;
            expect(putObjectStub.called).to.be.false;
        });

    })
});
