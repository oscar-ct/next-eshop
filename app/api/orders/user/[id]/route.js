import prisma from "@/lib/prisma";

// GET api/orders/user/[id]

export const GET = async (req, {params}) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: params.id
            },
            include: {
                orderItems: true
            }
        });
        if (!orders) return new Response("User orders not found...", {status: 404});
        return Response.json(orders);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};