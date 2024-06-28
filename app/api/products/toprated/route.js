import prisma from "@/lib/prisma";

//  GET /api/products/toprated

export const GET = async (req) => {
    try {
        const products = await prisma.product.findMany({
            take: 5,
            orderBy: {
                rating: "desc"
            },
            include: {
                images: true,
                reviews: true
            }
        })
        return Response.json(products);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
