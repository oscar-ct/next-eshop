import prisma from "@/lib/prisma";
import {getServerSession} from "next-auth";


//  GET /api/admin/orders

export const dynamic = 'force-dynamic'
export const GET = async (req) => {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                orderItems: true,
                user: true
            }
        })
        return Response.json(orders);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
