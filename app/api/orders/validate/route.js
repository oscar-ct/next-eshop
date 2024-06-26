import prisma from "@/lib/prisma";

// POST api/orders/validate

export async function POST(req) {
    try {
        const { orderId, email } = await req.json();
        let order;
        const guestOrder = await prisma.order.findFirst({
            where: {
                id: orderId,
                email: email
            }
        });
        if (guestOrder) {
            return Response.json({
                isValidOrder: true
            });
        } else {
            order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    user: {
                        email: email
                    }
                }
            });
        }
        if (order) {
            return Response.json({
                isValidOrder: true
            });
        }
        return Response.json({
            isValidOrder: false
        });
    } catch ({message}) {
        return Response.json({
            message,
            isValidOrder: false
        });
    }
}


