import connectDB from "@/config/db";
import Order from "@/models/Order";

//  GET /api/orders/[id]

export const GET = async (req, {params}) => {
    await connectDB();
    try {
        const order = await Order.findById(params.id);
        if (!order) return new Response("Order not found...", {status: 404});
        return Response.json(order);
    } catch (e) {
        console.log(e);
        if (e.name === 'CastError' || e.kind === 'ObjectId') {
            return new Response("Invalid resource id", {status: 404});
        }
        return new Response("Something went wrong...", {status: 500});
    }

};