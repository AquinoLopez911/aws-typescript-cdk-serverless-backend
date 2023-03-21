import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/LniTableLambdas/Read'

// // // getOneWithPrimaryKey
// const singleClientOrdersEvent: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         PK: "Bar Bao",
//         SK: "Order#"
//     }
// } as any

// const res = handler(singleClientOrdersEvent, {} as any).then(apiRes => {
//     const items = JSON.parse(apiRes.body);
//     console.log(items)
// } );

// -------------------------------------------------------->

const allOrdersEvent: APIGatewayProxyEvent = {
    queryStringParameters: {
        PK: "Order",
    }
} as any

const allClientsEvent: APIGatewayProxyEvent = {
    queryStringParameters: {
        PK: "Client",
    }
} as any

const res1 = handler(allClientsEvent, {} as any).then(apiRes => {
    const items = JSON.parse(apiRes.body);
    console.log(items)
} );

// -------------------------------------------------------->


//getAllWithSecondaryKey
// const allOrdersEvent: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         // PK: "Client#",
//         SK: "Order"
//     }
// } as any

// const res2 = handler(allOrdersEvent, {} as any).then(apiRes => {
//     console.log(apiRes)
//     const items = JSON.parse(apiRes.body);
//     console.log(items)
// } );


// // // scan 
// const res3 = handler({} as any, {} as any).then(apiRes => {
//     const items = JSON.parse(apiRes.body);
//     console.log(items)
// } );