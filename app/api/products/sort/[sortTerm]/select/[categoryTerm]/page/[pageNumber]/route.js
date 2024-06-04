import connectDB from "@/config/db";
import Product from "@/models/Product";
import { parse } from "url";

// helper function
const capitalizeFirstChar = (string) => {
    return string.substring(0, 1).toUpperCase() + string.substring(1, string.length);
};

//  GET /api/products
export const GET = async (req, {params}) => {
    console.log(params)
    try {
        await connectDB();
        const { query } = parse(req.url, true);
        let products;
        // set number of products per page, search or sort queries will return 16 products, else only 8 (i.e. homepage)
        const pageSize = query.searchTerm || query.sortByTerm ? 16 : 14;
        // if page number exists from url search params, set page number, else set to 1
        const page = Number(query.pageNumber) || 1;
        // if url search params includes a search or sort or category parameter, set keyword/categoryTerm to that, else leave blank, this is used to update the title of the search or category page
        const keyword = query.searchTerm || query.sortByTerm || "";
        const categoryTerm = query.filterTerm || "";
        // if url sort param exists, sort by that params, else default to sort by newest to oldest
        const sortTerm = query.sortByTerm === "toprated" ? {rating: -1} : query.sortByTerm === "latest" ? {createdAt: -1} : query.sortByTerm === "price-asc" ? {price: +1} : query.sortByTerm === "price-dsc" ? {price: -1} : {createdAt: -1};
        // if url search param exists, filter by that search keyword param, else default to all i.e. {}
        const searchTerm = query.searchTerm ? { name: {$regex: query.searchTerm, $options: "i"}, isDisabled: false} : query.sortByTerm === "toprated" ? {rating: {$gt: 0}, isDisabled: false} : {isDisabled: false};
        // initialize count variable
        let count;
        // if category exists and category term does not equal all do this
        if (query.filterTerm && query.filterTerm !== "all") {
            // set count to the numbers of results found based on category parameter
            count = await Product
                .countDocuments({...searchTerm})
                .where("category")
                .equals(capitalizeFirstChar(req.query.filterTerm));
            // set products to query category parameter
            products = await Product
                .find({...searchTerm})
                .where("category")
                .equals(capitalizeFirstChar(req.query.filterTerm))
                .sort({...sortTerm})
                .limit(pageSize)
                .skip(pageSize * (page-1));
            // return JSON to api call
            return Response.json(
                {
                    products,
                    page,
                    pages: Math.ceil(count / pageSize),
                    keyword: keyword,
                    categoryTerm: categoryTerm
                }
            );
        }
        // set count to the numbers of results found based on category parameter
        count = await Product.countDocuments({...searchTerm});
        // set products to query search parameter
        products = await Product
            .find({...searchTerm})
            .sort({...sortTerm})
            .limit(pageSize)
            .skip(pageSize * (page-1));
        return Response.json(
            {
                products,
                page,
                pages: Math.ceil(count / pageSize),
                keyword: keyword, categoryTerm: categoryTerm
            }
        );
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
