import connectDB from "@/config/db";
import Product from "@/models/Product";

//  GET /api/products/[id]

export const GET = async (req, {params}) => {
    await connectDB();
    try {
        const product = await Product.findById(params.id);
        if (!product) return new Response("Product not found...", {status: 404});

        return Response.json(product);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }

};