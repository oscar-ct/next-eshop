import connectDB from "@/config/db";
import Order from "@/models/Order";

// POST api/orders/validate

export async function POST(req) {
    const { orderId, email } = await req.json();
    try {
        await connectDB();
        const order = await Order.findOne({_id: orderId});
        if (!order) new Response("No order found...", {status: 404});
        if (order.user.email === email) {
            return Response.json({
                isValidOrder: true
            });
        } else {
            return Response.json({
                isValidOrder: false
            });
        }
    } catch ({message}) {
        return Response.json({
            message,
            isValidOrder: false
        });
    }
}


