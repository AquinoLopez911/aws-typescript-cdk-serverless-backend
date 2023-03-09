import { handler } from '../../services/SpacesTableLambdas/Create'

const event = {
    body: {
        location: 'your mom'
    }
}

handler(event as any, {} as any);