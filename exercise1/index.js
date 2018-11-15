//Init and setup
const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
const indexName = 'index.lst';

//Lambda function event handler
exports.handler = async (event, context) => {
    const s3 = new AWS.S3();

    const bucketName = event.Records[0].s3.bucket.name;
    const objectKey = event.Records[0].s3.object.key;

    if (objectKey === indexName)
        return 'Skipping index file updagte event';

    const indexMeta = {
        Bucket: bucketName,
        Key: indexName
    };

    let indexData;
    try{
        const indexObject = await (s3.getObject(indexMeta).promise());
        indexData = indexObject.Body
    } catch (err) {
        if (err.code === 'NoSuchKey')
            indexData = "";
        else
            throw err;
    }

    indexData += `${objectKey}\n`;
    indexMeta.Body = indexData;

    await (s3.putObject(indexMeta).promise());

    return 'Indexer has completed successfully';
};