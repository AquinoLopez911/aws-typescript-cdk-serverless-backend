import {v4} from 'uuid'
import { S3 } from 'aws-sdk'
import { Handler } from 'aws-cdk-lib/aws-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

const s3Client: S3 = new S3();

const handler = async (event: any, context: any, callback: any) => {
    console.log(event);
    
    if(isAuthorized(event)) {

        return {
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 200,
            body: 'authorized'
        }
    }
    else {
        return {
            statusCode: 401,
            body: 'unauthorized'
        }
    }
}


const isAuthorized = (event: APIGatewayProxyEvent) => {
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if(groups) {
        return (groups as string).includes('admins');
    }
    else {
        return false;
    }
}

export { handler }