'use strict'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid';

const TABLE_NAME = 'LniTable'
const dbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  => {

    
    let item = typeof event.body == 'object' ? event.body: JSON.parse(event.body);

    let clientItem = {
        PK: `Client#${item.buisnessName}`,
        SK: `Client#${item.buisnessName}`,
        number: `${item.buisnessContactNumber}`,
        email: `${item.buisnessEmail}`
    }    

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
            // "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: ""
    }
    
    try {
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: clientItem
        }).promise()
    } catch (error: any) {
        console.log(typeof(error))
        result.statusCode = 500
        result.body = error.message
        return result;
    }
    console.log(JSON.stringify(item))
    console.log(`created new item with id: ${item.PK} ${item.SK}`)
    result.body = JSON.stringify(`created new item with id: ${item.PK} ${item.SK}`);
    return result;
}


export { handler }