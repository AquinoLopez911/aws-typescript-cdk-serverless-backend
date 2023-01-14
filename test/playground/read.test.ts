import { handler } from '../../services/SpacesTableLambdas/Read'

const event = {
    body: {
        
    }
}

const res = handler({} as any, {} as any).then(apiRes => {
    const items = JSON.parse(apiRes.body);
    console.log(items)
} );