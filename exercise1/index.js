//Init and setup
const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
const indexName = 'index.lst';

//Lambda function event handler
exports.handler = async (event, context) => {
    const s3 = new AWS.S3();

    console.log(JSON.stringify(event));

    //Get index.lst from S3 bucket
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
        console.log("Trying to get with indexMeta:");
        console.log(JSON.stringify(indexMeta));
        const indexObject = await (s3.getObject(indexMeta).promise());
        indexData = indexObject.Body
    } catch (err) {
        if (err.code === 'NoSuchKey')
            indexData = "";
        else
            throw err;
    }

    console.log("indexData:");
    console.log(JSON.stringify(indexData));

    //Modify index.lst data
    indexData += `${objectKey}\n`;
    indexMeta.Body = indexData;
    console.log("New indexMeta:");
    console.log(JSON.stringify(indexMeta));
    //Upload updated index.lst back to S3 bucket
    await (s3.putObject(indexMeta).promise());

    return 'Indexer has completed successfully';
};