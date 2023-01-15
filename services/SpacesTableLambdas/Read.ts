'use strict'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

// function gets one Location if there is an event.queryStringParameter with the PRIMARY_KEY as a key
// in the query param is provided, it scans for all locations.
const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  => {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: ""
    }
    
    try {
        if(event.queryStringParameters) {
            if(PRIMARY_KEY! in event.queryStringParameters) {
                result.body = await getLocationWithPrimaryKey(event.queryStringParameters)
            }
            else {
                result.body = await getLocationWithSecondaryPartition(event.queryStringParameters)
            }
        }
        else {
            result.body = await scanTable();
        }
    } catch (error: any) {
        result.statusCode = 500
        result.body = error.message
        return result;
    }
     return result;
}

const getLocationWithSecondaryPartition = async (queryParams: APIGatewayProxyEventQueryStringParameters) => {

    const queryKey = Object.keys(queryParams)[0];
    const queryValue = queryParams[queryKey];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        IndexName: queryKey,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': queryKey!
        },
        ExpressionAttributeValues: {
            ':zzzz': queryValue
        }
    }).promise()
    return JSON.stringify(queryResponse)
}

const getLocationWithPrimaryKey = async (queryParams: APIGatewayProxyEventQueryStringParameters) => {
    const keyValue = queryParams[PRIMARY_KEY!];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': PRIMARY_KEY!
        },
        ExpressionAttributeValues: {
            ':zzzz': keyValue
        }
    }).promise()
    return JSON.stringify(queryResponse)
}

const scanTable = async () => {
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME!,
    }).promise()
    return JSON.stringify(queryResponse);
}

export { handler }