'use strict'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME as string
const PRIMARY_KEY = process.env.PRIMARY_KEY as string
const dbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  => {
    console.log(JSON.stringify(`Event: event`))

    const spaceId = event.queryStringParameters?.[PRIMARY_KEY]

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: ""
    }
    
    try {
        if(spaceId) {
            const deleteResult = await dbClient.delete({
                TableName: TABLE_NAME,
                Key: { [PRIMARY_KEY]: spaceId }
            }).promise()

            result.body = JSON.stringify(deleteResult);
        
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