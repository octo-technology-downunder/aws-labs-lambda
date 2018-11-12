const sinon = require('sinon');
const expect = require('chai').expect;
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
AWSMock.setSDKInstance(AWS);
const fs = require('fs');

describe('index', function () {

    describe('#handler', function () {

        before(function () {

        });
        after(function () {
            AWSMock.restore();
        });

        it('Should putObject "testObject" when passed sampleEvent', async () => {
            const indexBody = 'file1.txt\nfile2.txt\nfile3.txt';
            const newFileName = 'sample.text';
            const newIndexBody = indexBody + newFileName + "\n";
            const putObjectSpy = sinon.spy();

            AWSMock.mock('S3', 'getObject', JSON.parse(fs.readFileSync('./test/data/sampleIndex.json').toString()));
            AWSMock.mock('S3', 'putObject', putObjectSpy);

            let index = require("../../index");

            const expectedNewIndex = {
                Bucket: "some-bucket",
                Key: "index.lst",
                Body: newIndexBody
            };

            await index.handler(JSON.parse(fs.readFileSync("./test/data/sampleEvent.json").toString()), {});
            expect(putObjectSpy.calledOnce).to.be.true;
            console.log("ARGS:");
            console.log(putObjectSpy.args[0][0]);
            console.log("expectedNewIndex:");
            console.log(expectedNewIndex);
            expect(putObjectSpy.calledWith(expectedNewIndex)).to.be.true;

        });
    })
});
