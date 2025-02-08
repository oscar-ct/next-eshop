import prisma from "@/lib/prisma";

const capitalizeFirstChar = (string) => {
    return string.substring(0, 1).toUpperCase() + string.substring(1, string.length);
};

//  GET /api/products/sort/[sortTerm]/select/[categoryTerm]/page/[pageNumber]


export const GET = async (req, {params}) => {
    const { sortTerm, categoryTerm, pageNumber } = params;
    try {
        let products;
        const sortTermString = sortTerm || "";
        const categoryTermString = categoryTerm || "";

        const page = pageNumber || 1;
        const pageSize = 15;

        const validQueries = ["toprated", "latest", "price-asc","price-desc"];

        if (!validQueries.includes(sortTerm)) {
            return Response.json({
                categoryTermString,
                page,
                pages: 0,
                sortTermString,
                products: []
            });
        }
        const sortTermQuery = sortTerm === "toprated" ? {rating: 'desc'} : sortTerm === "latest" ? {createdAt: 'desc'} : sortTerm === "price-asc" ? {price: "asc"} : sortTerm === "price-desc" ? {price: 'desc'} : {createdAt: 'desc'};

        let count;
        if (categoryTerm && categoryTerm !== "all") {
            count = await prisma.product.count({
                where: {
                    isDisabled: false,
                    category: {
                        equals: capitalizeFirstChar(categoryTerm)
                    }
                },
            });
            products = await prisma.product.findMany({
                skip: pageSize * (page-1),
                take: pageSize,
                where: {
                    isDisabled: false,
                    category: {
                        equals: capitalizeFirstChar(categoryTerm)
                    }
                },
                orderBy: sortTermQuery,
                include: {
                    images: true,
                    reviews: true
                }
            });
            // return JSON to api call
            return Response.json(
                {
                    products,
                    page,
                    pages: Math.ceil(count / pageSize),
                    sortTermString,
                    categoryTermString,
                }
            );
        }
        const query = {
            skip: pageSize * (page-1),
            take: pageSize,
            where: {
                isDisabled: false
            },
            orderBy: sortTermQuery,
        };
        products = await prisma.product.findMany({...query, include: {images: true, reviews: true} })
        count = await prisma.product.count({
            where: {
                isDisabled: false
            },
        })
        return Response.json(
            {
                products,
                page,
                pages: Math.ceil(count / pageSize),
                sortTermString,
                categoryTermString,
            }
        );
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
