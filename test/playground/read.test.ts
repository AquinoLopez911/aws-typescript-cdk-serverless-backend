import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/LniTableLambdas/Read'

// // getOneWithPrimaryKey
const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: "c0ae2d09-0e4d-40a0-bcee-dc8fd289a550"
    }
} as any

const res = handler(event, {} as any).then(apiRes => {
    const items = JSON.parse(apiRes.body);
    console.log(items)
} );


//getAllWithSecondaryKey
const event2: APIGatewayProxyEvent = {
    queryStringParameters: {
        location: "gateway"
    }
} as any

const res2 = handler(event2, {} as any).then(apiRes => {
    console.log(apiRes)
    const items = JSON.parse(apiRes.body);
    console.log(items)
} );


// // scan 
const res3 = handler({} as any, {} as any).then(apiRes => {
    const items = JSON.parse(apiRes.body);
    console.log(items)
} );