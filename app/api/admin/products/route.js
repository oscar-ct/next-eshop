import prisma from "@/lib/prisma";
import {getServerSession} from "next-auth";


//  GET /api/admin/products

export const dynamic = 'force-dynamic'
export const GET = async (req) => {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                images: true
            }
        });
        return Response.json(products);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
