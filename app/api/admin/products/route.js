import connectDB from "@/config/db";
import Product from "@/models/Product";
// import {getServerSession} from "next-auth";


//  GET /api/admin/products

export const GET = async (req) => {
    try {
        await connectDB();
        const orders = await Product.find({}).sort({createdAt: -1});
        return Response.json(orders);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
