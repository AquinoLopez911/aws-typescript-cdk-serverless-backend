import { handler } from '../../services/LniTableLambdas/Create'

const clientEvent = {
    body: {
        buisnessName: "bar live",
        buisnessContactNumber: "7038561542",
        buisnessEmail: "barlive@barlive.com",
        type: "Client"
    }
}

const orderEvent = {
    body: {
        client: "Casta Rum Bar",
        iceQuantity: 21,
        propane: 0,
        type: "Order"
    }
}

handler(orderEvent as any, {} as any);