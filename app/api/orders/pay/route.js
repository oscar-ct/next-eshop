import Stripe from "stripe";
import connectDB from "@/config/db";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY);

// api/orders/pay
export async function PUT(req) {
console.log("testing")
    const { orderId, details } = await req.json();
    console.log(orderId, details)
    try {
        if (!orderId) {
            return new Response("No order found", {status: 404});
        }
        await connectDB();
        const order = await Order.findById(orderId);
        const { totalPrice, orderItems, paymentMethod } = order;

        if (paymentMethod === "Stripe / Credit Card") {
            try {
                const stripeResponse = await stripe.paymentIntents.retrieve(details.id);
                if (stripeResponse && stripeResponse.id === details.id) {
                    order.paidAmount = totalPrice;
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    order.paymentResult = details;
                }
            } catch (e) {
                console.log(e)
            }
        }
        if (paymentMethod === "PayPal / Credit Card") {
            order.paidAmount = totalPrice;
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: details.id,
                status: details.status,
                update_time: details.update_time,
                email_address: details.payer.email_address,
            };
        }
        orderItems.forEach((item) => {
            if (!item.isCanceled) {
                item.isPaid = true;
            }
        });
        const updatedOrder = await order.save();
        return Response.json(updatedOrder);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}

