'use strict'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid';

const TABLE_NAME = process.env.TABLE_NAME as string
const PRIMARY_KEY = process.env.PRIMARY_KEY as string
const dbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  => {
    console.log(JSON.stringify(`Event: event`))

    let requestBody = typeof event.body == 'object' ? event.body: JSON.parse(event.body);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY]

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: ""
    }
    
    try {
       if(requestBody && spaceId) {
        const requestBodyKey = Object.keys(requestBody)[0];
        const requestBodyValue = requestBody[requestBodyKey];

        const updatedResult = await dbClient.update({
            TableName: TABLE_NAME,
            Key: {
                [PRIMARY_KEY]: spaceId
            },
            ExpressionAttributeNames: {
                '#K': requestBodyKey
            },
            ExpressionAttributeValues: {
                ':NV' : requestBodyValue
            },
            UpdateExpression: 'set #K = :NV',
            ReturnValues: 'UPDATED_NEW'
        }).promise()

        result.body = JSON.stringify({updatedResult});
       }
    } catch (error: any) {
        console.log(typeof(error))
        result.statusCode = 500
        result.body = error.message
        return result;
    }

    return result;
}


export { handler }