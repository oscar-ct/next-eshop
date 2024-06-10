import Stripe from "stripe";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import {checkIfNewTransaction, verifyPayPalPayment} from "@/utils/paypal";

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY);

// api/orders/pay
export async function PUT(req) {

    const { orderId, details, clientSecret, token } = await req.json();
    try {
        await connectDB();
        const order = await Order.findById(orderId);
        if (!order) return new Response("No order found", {status: 404});
        const { totalPrice, orderItems, paymentMethod } = order;

        if (paymentMethod === "Stripe / Credit Card") {
            const secret = process.env.JWT_SECERT + clientSecret;
            try {
                jwt.verify(token, secret);
                const stripeResponse = await stripe.paymentIntents.retrieve(details.id);
                if (stripeResponse && stripeResponse.id === details.id) {
                    order.paidAmount = totalPrice;
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    order.paymentResult = details;
                }
            } catch (e) {
                console.log(e);
                return new Response("This action has been terminated", {status: 401});
            }
        }

        if (paymentMethod === "PayPal / Credit Card") {
            const { verified, value } = await verifyPayPalPayment(details.id);
            if (!verified) return new Response("Payment not verified", {status: 401});
            const isNewTransaction = await checkIfNewTransaction(Order, details.id);
            if (!isNewTransaction) return new Response("Transaction has been used before", {status: 401});
            const paidCorrectAmount = Number(totalPrice / 100).toFixed(2) === value;
            if (!paidCorrectAmount) return new Response("Incorrect amount paid", {status: 401});
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