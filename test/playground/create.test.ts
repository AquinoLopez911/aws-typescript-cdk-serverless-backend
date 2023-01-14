import { handler } from '../../services/SpacesTableLambdas/Create'

const event = {
    body: {
        location: 'Washington D.C'
    }
}

handler(event as any, {} as any);