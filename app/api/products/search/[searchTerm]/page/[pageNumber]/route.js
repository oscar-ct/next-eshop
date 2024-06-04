import connectDB from "@/config/db";
import Product from "@/models/Product";


//  GET /api/products/search/[searchTerm]/page/[pageNumber]

export const GET = async (req, {params}) => {
    const { searchTerm, pageNumber } = params;

    try {
        const page = pageNumber || 1;
        const pageSize = 6;

        await connectDB();

        const sortTermQuery = {createdAt: -1};
        const filterTerm = { name: {$regex: searchTerm, $options: "i"}, isDisabled: false};

        const count = await Product.countDocuments({...filterTerm});
        const products = await Product
            .find({...filterTerm})
            .sort({...sortTermQuery})
            .limit(pageSize)
            .skip(pageSize * (page-1));
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
