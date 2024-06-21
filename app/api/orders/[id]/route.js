import prisma from "@/lib/prisma";

//  GET /api/orders/[id]

export const GET = async (req, {params}) => {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: params.id
            },
            include: {
                orderItems: true,
                orderPayment: true
            }
        })
        if (!order) return new Response("Order not found...", {status: 404});
        return Response.json(order);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};