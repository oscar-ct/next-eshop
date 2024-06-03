import connectDB from "@/config/db";
import Order from "@/models/Order";

// GET api/orders/user/[id]
export const GET = async (req, {params}) => {
    await connectDB();
    try {
        const order = await Order.find({ "user.id": params.id}).sort({createdAt: -1});
        if (!order) return new Response("User orders not found...", {status: 404});
        return Response.json(order);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};