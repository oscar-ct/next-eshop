import Order from "@/models/Order";
import connectDB from "@/config/db";
import prisma from "@/lib/prisma";

//  DELETE /api/orders/[id]/cancel/product/[productId]

const SHIPPING_PRICE = 1000;
const TAX_PERCENTAGE = 0.0825;

export const DELETE = async (req, {params}) => {
    try {
        const order = await prisma.order.findFirst({
            where : {
                id: params.id
            },
            include: {
                orderItems: true
            }
        });
        if (!order) return new Response("Order not found...", {status: 404});

        if (!order.isShipped && !order.isCanceled) {

            const canceledItem = order.orderItems.find((item) => {
                return params.productId === item.id
            });

            const existingCanceledItems = order.orderItems.filter((item) => {
                return item.isCanceled
            });

            const newItemsPrice = order.itemsPrice - (canceledItem.price * canceledItem.quantity);
            let newShippingPrice = order.shippingPrice;
            if (!order.freeShipping && newItemsPrice < 10000) {
                newShippingPrice = SHIPPING_PRICE;
            }
            const newTaxPrice = Math.round(TAX_PERCENTAGE * (newItemsPrice + newShippingPrice));
            const newTotalPrice = newItemsPrice + newTaxPrice + newShippingPrice;

            let orderRequiresCancellation = false;
            if (order.orderItems.length - 1 === existingCanceledItems.length) {
                orderRequiresCancellation = true;
            }

            const updatedOrder = await prisma.order.update({
                where: {
                    id: params.id
                },
                data: {
                    isCanceled: orderRequiresCancellation,
                    canceledAt: orderRequiresCancellation ? new Date() : undefined,
                    itemsPrice: !order.isPaid && orderRequiresCancellation ? 0 : !order.isPaid ? newItemsPrice : order.itemsPrice,
                    shippingPrice: !order.isPaid && orderRequiresCancellation ? 0 : !order.isPaid ? newShippingPrice : order.shippingPrice,
                    taxPrice: !order.isPaid && orderRequiresCancellation ? 0 : !order.isPaid ? newTaxPrice : order.taxPrice,
                    totalPrice: !order.isPaid && orderRequiresCancellation ? 0 : !order.isPaid ? newTotalPrice : order.totalPrice,
                    orderItems: {
                        updateMany: {
                            where: {
                                id: params.productId
                            },
                            data: {
                                isCanceled: true,
                                canceledAt: new Date(),
                            }
                        }
                    }
                },
                include: {
                    orderItems: true
                }
            });
            return Response.json(updatedOrder);
        } else {
            return new Response("This item cannot be canceled...", {status: 403});
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};