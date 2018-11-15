//Init and setup
const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
const indexName = 'index.lst';

//Lambda function event handler
exports.handler = async (event, context) => {
    const s3 = new AWS.S3();

    let indexMeta;
    const bucketName = event.Records[0].s3.bucket.name;

    //
    //implement missing logic here
    //

    await (s3.putObject(indexMeta).promise());

    return 'Indexer has completed successfully';
};