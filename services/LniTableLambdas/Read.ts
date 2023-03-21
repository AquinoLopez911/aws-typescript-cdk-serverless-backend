'use strict'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda';

const TABLE_NAME = "LniTable";
const PRIMARY_KEY = "PK";
const dbClient = new DynamoDB.DocumentClient();

// function gets one Location if there is an event.queryStringParameter with the PRIMARY_KEY as a key
// in the query param is provided, it scans for all locations.
const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  => {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "",
        headers: {
            "Access-Control-Allow-Origin": '*'
        }
    }
    
    try {
        if(event.queryStringParameters) {
            if(PRIMARY_KEY! in event.queryStringParameters) {
                if(event.queryStringParameters.PK === "Order"){
                    result.body = await getAllOrdersWithPrimaryKey(event.queryStringParameters)
                    return result;
                }
                if(event.queryStringParameters.PK === "Client"){
                    result.body = await getAllClientsWithPrimaryKey(event.queryStringParameters)
                    return result;
                }

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
        IndexName: "Orders",
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

const getAllClientsWithPrimaryKey = async (queryParams: APIGatewayProxyEventQueryStringParameters) => {
    const keyValue = queryParams[PRIMARY_KEY!];

    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        KeyConditionExpression: '#PK = :client ',
        ExpressionAttributeNames: {
            '#PK': PRIMARY_KEY!,
        },
        ExpressionAttributeValues: {
            ':client': keyValue,
        }
    }).promise()
    return JSON.stringify(queryResponse)
}

const getAllOrdersWithPrimaryKey = async (queryParams: APIGatewayProxyEventQueryStringParameters) => {
    const keyValue = queryParams[PRIMARY_KEY!];
    const sKeyValue = queryParams["SK"];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        KeyConditionExpression: '#PK = :order ',
        ExpressionAttributeNames: {
            '#PK': PRIMARY_KEY!,
        },
        ExpressionAttributeValues: {
            ':order': keyValue,

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