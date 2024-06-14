import connectDB from "@/config/db";
import Product from "@/models/Product";


//  GET /api/products/categories
export const revalidate= 300;
export const GET = async (req) => {
    let products = [];
    try {
        await connectDB();
        const categories = await Product.distinct("category").sort();
        for (let i = 0; i < categories.length; i++) {
            const product = await Product.where("category").equals(categories[i]).sort({rating: -1}).limit(1).select("images category");
            products.push(product[0]);
        }
        return Response.json(products);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
