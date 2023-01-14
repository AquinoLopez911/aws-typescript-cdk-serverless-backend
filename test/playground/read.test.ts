import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/SpacesTableLambdas/Read'

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: "c0ae2d09-0e4d-40a0-bcee-dc8fd289a550"
    }
} as any

// get one 
const res = handler(event, {} as any).then(apiRes => {
    const items = JSON.parse(apiRes.body);
    console.log(items)
} );

// scan 
const res2 = handler({} as any, {} as any).then(apiRes => {
    const items = JSON.parse(apiRes.body);
    console.log(items)
} );