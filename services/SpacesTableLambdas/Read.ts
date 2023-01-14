'use strict'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME
const dbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  => {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: ""
    }
    
    try {
        const queryResponse = await dbClient.scan({
            TableName: TABLE_NAME!,
        }).promise()
        result.body = JSON.stringify(queryResponse);
    } catch (error: any) {
        result.statusCode = 500
        result.body = error.message
        return result;
    }

    return result;
}

export { handler }