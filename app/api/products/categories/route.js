import prisma from "@/lib/prisma";

//  GET /api/products/categories

export const revalidate= 300;
export const GET = async (req) => {
    let products = [];
    try {
        products = await prisma.product.findMany({
            where: {
                isDisabled: false
            },
            distinct: ["category"],
            select: {
                images: true,
                category: true
            },
            orderBy: {
                category: "asc"
            }
        });
        return Response.json(products);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
