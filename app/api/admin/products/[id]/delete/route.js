import connectDB from "@/config/db";
import Product from "@/models/Product";
import {getServerSession} from "next-auth";

//  DELETE /api/admin/products/[id]/delete

export const DELETE = async (req, {params}) => {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        await connectDB();
        const product = await Product.findById(params.id);
        if (!product) return new Response("Product not found", {status: 404});
        await Product.deleteOne({_id: product._id});
        return Response.json({message: "Product deleted"});
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};