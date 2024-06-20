import prisma from "@/lib/prisma";

//  GET /api/products/search/[searchTerm]/page/[pageNumber]

export const GET = async (req, {params}) => {
    const { searchTerm, pageNumber } = params;

    try {
        const page = pageNumber || 1;
        const pageSize = 6;
        const count = await prisma.product.count({
            where: {
                isDisabled: false,
                name: {
                    search: searchTerm
                },
                category: {
                    search: searchTerm
                }
            },
        });
        const products = await prisma.product.findMany({
            skip: pageSize * (page-1),
            take: pageSize,
            where: {
                isDisabled: false,
                name: {
                    search: searchTerm
                },
                category: {
                    search: searchTerm
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                images: true
            }
        });
        return Response.json(
            {
                products,
                page,
                pages: Math.ceil(count / pageSize),
                searchTerm,
            }
        );
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
