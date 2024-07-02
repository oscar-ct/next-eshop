import Stripe from "stripe";
import jwt from "jsonwebtoken";
import {checkIfNewTransaction, verifyPayPalPayment} from "@/utils/paypal";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY);

// api/orders/pay
export async function PUT(req) {
    try {
        const { orderId, details, clientSecret, token } = await req.json();
        const order = await prisma.order.findFirst({
            where: {
                id: orderId
            }
        });
        if (!order) return new Response("No order found", {status: 404});

        if (order.paymentMethod === "Stripe / Credit Card") {
            const secret = process.env.JWT_SECERT + clientSecret;
            try {
                jwt.verify(token, secret);
                const stripeResponse = await stripe.paymentIntents.retrieve(details.id);
                if (stripeResponse && stripeResponse.id === details.id) {

                    const updatedOrder = await prisma.order.update({
                        where: {
                            id: orderId
                        },
                        data: {
                            paidAmount: order.totalPrice,
                            isPaid: true,
                            paidAt: new Date(),
                            orderPayment: {
                                create: {
                                    transaction_id: details.id,
                                    status: details.status,
                                    update_time: details.update_time.toString(),
                                }
                            },
                            orderItems : {
                                updateMany: {
                                    where: {
                                        isCanceled: false
                                    },
                                    data: {
                                        isPaid: true
                                    }
                                }
                            }
                        },
                        include: {
                            orderItems: true,
                            orderPayment: true
                        }
                    });
                    return Response.json(updatedOrder);
                }
            } catch (e) {
                console.log(e);
                return new Response("This action has been terminated", {status: 401});
            }
        }

        if (order.paymentMethod === "PayPal / Credit Card") {
            const { verified, value } = await verifyPayPalPayment(details.id);
            if (!verified) return new Response("Payment not verified", {status: 401});
            const isNewTransaction = await checkIfNewTransaction(details.id);
            if (!isNewTransaction) return new Response("Transaction has been used before", {status: 401});
            const paidCorrectAmount = Number(order.totalPrice / 100).toFixed(2) === value;
            if (!paidCorrectAmount) return new Response("Incorrect amount paid", {status: 401});
            const updatedOrder = await prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    paidAmount: order.totalPrice,
                    isPaid: true,
                    paidAt: new Date(),
                    orderPayment: {
                        create: {
                            transaction_id: details.id,
                            status: details.status,
                            update_time: details.update_time.toString(),
                            email_address: details.payer.email_address,
                        }
                    },
                    orderItems : {
                        updateMany: {
                            where: {
                                isCanceled: false
                            },
                            data: {
                                isPaid: true
                            }
                        }
                    },
                },
                include: {
                    orderItems: true,
                    orderPayment: true
                }
            });
            return Response.json(updatedOrder);
        }
        return new Response("Payment method not recognized...", {status: 401});
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}