'use strict'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid';

const TABLE_NAME = process.env.TABLE_NAME
const dbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  => {
    console.log(JSON.stringify(`Event: event`))

    let item = typeof event.body == 'object' ? event.body: JSON.parse(event.body);
    console.log(item);
    item.spaceId = v4();
    console.log(item);

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: ""
    }
    
    try {
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()
    } catch (error: any) {
        console.log(typeof(error))
        result.statusCode = 500
        result.body = error.message
        return result;
    }
    console.log(JSON.stringify(item))
    console.log(`created new item with id: ${item.spaceId}`)
    result.body = JSON.stringify(`created new item with id: ${item.spaceId}`);
    return result;
}


export { handler }