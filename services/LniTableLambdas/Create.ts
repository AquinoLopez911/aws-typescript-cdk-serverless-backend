'use strict'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid';

const TABLE_NAME = 'LniTable'
const dbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  => {
    // helper function to format date strings
    function formatDate(date: Date) {
        const year = date.getFullYear();
        let month = '' + (date.getMonth() + 1);
        let day = '' + (date.getDate());
        let hour = '' + date.getHours();
        let minute = '' + date.getMinutes();
      
        if (month.length < 2) {
          month = '0' + month;
        }
        if (day.length < 2) {
          day = '0' + day;
        }
        if (hour.length < 2) {
          hour = '0' + hour;
        }
        if (minute.length < 2) {
          minute = '0' + minute;
        }
      
        const formattedDate = [year, month, day].join('-');
        const militaryTime = [hour, minute].join(':');
      
        return `${formattedDate} ${militaryTime}`;
      }

    
    let item = typeof event.body == 'object' ? event.body: JSON.parse(event.body);

    const dbItem = item.type == "Client" ?  {
        PK: `Client`,
        SK: item.state ? `${item.address}-${item.city}-${item.state}` : `${item.address}-${item.city}`,
        client: `${item.buisnessName}`,
        number: `${item.buisnessContactNumber}`,
        email: `${item.buisnessEmail}`
    } : {
        PK: `Order`,
        SK: JSON.stringify(formatDate(new Date())),
        details: {
            ice: item.iceQuantity,
            propane: item.propane
        },
        client: `${item.client}`
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
            Item: dbItem
        }).promise()
    } catch (error: any) {
        console.log(typeof(error))
        result.statusCode = 500
        result.body = error.message
        return result;
    }
    console.log(JSON.stringify(item))
    console.log(`created a new ${item.type}: ${dbItem.PK} ${dbItem.SK}`)
    result.body = JSON.stringify(`created a new ${item.type}: ${dbItem.PK} ${dbItem.SK}`);
    return result;
}


export { handler }