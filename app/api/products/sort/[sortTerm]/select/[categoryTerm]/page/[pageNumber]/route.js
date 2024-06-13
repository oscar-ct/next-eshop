import connectDB from "@/config/db";
import Product from "@/models/Product";

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
        const pageSize = 16;

        const validQueries = ["toprated", "latest", "price-asc","price-dec"];

        if (!validQueries.includes(sortTerm)) {
            return Response.json({
                categoryTermString,
                page,
                pages: 0,
                sortTermString,
                products: []
            });
        }
        await connectDB();
        const sortTermQuery = sortTerm === "toprated" ? {rating: -1} : sortTerm === "latest" ? {createdAt: -1} : sortTerm === "price-asc" ? {price: +1} : sortTerm === "price-dsc" ? {price: -1} : {createdAt: -1};
        const filterTerm = sortTerm === "toprated" ? {rating: {$gt: 0}, isDisabled: false} : {isDisabled: false};

        let count;
        if (categoryTerm && categoryTerm !== "all") {
            count = await Product
                .countDocuments({...filterTerm})
                .where("category")
                .equals(capitalizeFirstChar(categoryTerm));
            products = await Product
                .find({...filterTerm})
                .where("category")
                .equals(capitalizeFirstChar(categoryTerm))
                .sort({...sortTermQuery})
                .limit(pageSize)
                .skip(pageSize * (page-1));
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

        count = await Product.countDocuments({...filterTerm});
        products = await Product
            .find({...filterTerm})
            .sort({...sortTermQuery})
            .limit(pageSize)
            .skip(pageSize * (page-1));
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
