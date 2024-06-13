import connectDB from "@/config/db";
import Product from "@/models/Product";
import {getServerSession} from "next-auth";

//  DELETE /api/admin/products/[id]/image/[imageId]/delete

export const DELETE = async (req, {params}) => {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        await connectDB();
        const product = await Product.findOneAndUpdate({_id: params.id}, {$pull: {images: {_id: params.imageId}}}, {returnDocument: "after"});
        if (!product) return new Response("Product not found", {status: 404});
        return Response.json(product.images);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};