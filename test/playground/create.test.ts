import { handler } from '../../services/LniTableLambdas/Create'

const event = {
    body: {
        buisnessName: "Bar Bao",
        buisnessContactNumber: "7038271823",
        buisnessEmail: "BarBao@gmail.com"
    }
}

handler(event as any, {} as any);