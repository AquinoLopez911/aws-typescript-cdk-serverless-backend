import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/SpacesTableLambdas/Update'

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: "c0ae2d09-0e4d-40a0-bcee-dc8fd289a550"
    },
    body: { location: 'Washington D.C' },
    headers: { "content-type": "application/json" },
} as any

const res = handler(event, {} as any).then(apiRes => {
    const items = JSON.parse(apiRes.body);
    console.log(items)
} );