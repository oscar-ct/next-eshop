import prisma from "@/lib/prisma";

//  DELETE /api/orders/[id]/cancel

export const DELETE = async (req, {params}) => {
    try {
        const order = await prisma.order.findFirst({
            where : {
                id: params.id
            }
        });
        if (!order) return new Response("Order not found...", {status: 404});
        if (!order.isShipped) {
            const updatedOrder = await prisma.order.update({
                where: {
                    id: params.id
                },
                data: {
                    isCanceled: true,
                    canceledAt: new Date(),
                    itemsPrice: !order.isPaid ? 0 : order.itemsPrice,
                    shippingPrice: !order.isPaid ? 0 : order.shippingPrice,
                    taxPrice: !order.isPaid ? 0 : order.taxPrice,
                    totalPrice: !order.isPaid ? 0 : order.totalPrice,
                    orderItems : {
                        updateMany: {
                            where: {
                                isCanceled: false
                            },
                            data: {
                                isCanceled: true,
                                canceledAt: new Date()
                            }
                        }
                    }
                },
                include: {
                    orderItems: true,
                    orderPayment: true,
                }
            });
            return Response.json(updatedOrder);
        } else {
            return new Response("This order cannot be canceled...", {status: 403});
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};