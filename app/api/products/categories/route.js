import prisma from "@/lib/prisma";

//  GET /api/products/categories

export const revalidate= 300;
export const GET = async (req) => {
    const url = req.url
    const { searchParams } = new URL(url);
    const includeImages  = searchParams.get("images");
    let products = [];
    const selectWithoutImages = {
        category: true
    }
    const selectWithImages = {
        images: true,
        category: true
    }
    try {
        products = await prisma.product.findMany({
            where: {
                isDisabled: false
            },
            distinct: ["category"],
            select: includeImages === "yes" ? selectWithImages : selectWithoutImages,
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
