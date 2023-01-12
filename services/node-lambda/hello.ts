import {v4} from 'uuid'

exports.handler = async (event: any, context: any, callback: any) => {
    console.log(event);

    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: "hello from serverless " + v4()
    }
}