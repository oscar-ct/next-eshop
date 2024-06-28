import prisma from "@/lib/prisma";

//  GET /api/products/[id]

export const GET = async (req, {params}) => {
    try {
        const product = await prisma.product.findFirst({
            where: {
                id: params.id
            },
            include: {
              reviews: true,
              images: true
            }
        })
        if (!product) return new Response("Product not found...", {status: 404});
        return Response.json(product);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }

};