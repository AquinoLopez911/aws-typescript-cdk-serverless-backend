import { handler } from '../../services/LniTableLambdas/Create'

const clientEvent = {
    body: {
        buisnessName: "Farmers And Distillers",
        buisnessContactNumber: "2024643001",
        buisnessEmail: "manager@F&D.com",
        city: 'Washington D.C.',
        // state: 'VA',
        address: '600 Massachusetts Ave NW',
        type: "Client"
    }
}

const orderEvent = {
    body: {
        client: "Cleradon Ballroom",
        iceQuantity: 14,
        propane: 0,
        type: "Order"
    }
}

handler(orderEvent as any, {} as any);