import {v4} from 'uuid'
import { S3 } from 'aws-sdk'
import { Handler } from 'aws-cdk-lib/aws-lambda';

const s3Client: S3 = new S3();

const handler = async (event: any, context: any, callback: any) => {
    console.log(event);

    const buckets = await s3Client.listBuckets().promise();

    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: 'here are your buckets ' + JSON.stringify(buckets.Buckets, null, 2)
    }
}

export { handler }