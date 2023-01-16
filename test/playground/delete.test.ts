import { handler } from '../../services/SpacesTableLambdas/Delete'
// // getOneWithPrimaryKey
const event = {
    queryStringParameters: {
        spaceId: "c0ae2d09-0e4d-40a0-bcee-dc8fd289a550"
    }
} as any

const res = handler(event, {} as any).then(apiRes => {
    const items = JSON.parse(apiRes.body);
    console.log(items)
} );
