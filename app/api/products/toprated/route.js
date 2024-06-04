import connectDB from "@/config/db";
import Product from "@/models/Product";


//  GET /api/products/toprated

export const GET = async (req) => {
    try {
        await connectDB();
        const products = await Product.find({}).sort({rating: -1}).limit(5);
        return Response.json(products);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
