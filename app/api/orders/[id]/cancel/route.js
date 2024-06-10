import Order from "@/models/Order";
import connectDB from "@/config/db";

//  DELETE /api/orders/[id]/cancel

export const DELETE = async (req, {params}) => {
    await connectDB();
    try {
        const order = await Order.findById(params.id);
        if (!order) return new Response("Order not found...", {status: 404});

        const { isShipped, canceledItems, orderItems } = order;
        if (!isShipped) {
            order.isCanceled = true;
            order.canceledAt = Date.now();
            if (canceledItems.length > 0) {
                orderItems.forEach(function (item) {
                    if (!item.isCanceled) {
                        const data = {
                            productId: item.productId,
                            productPrice: item.price,
                            productQuantity: item.quantity,
                            canceledAt: Date.now(),
                        }
                        canceledItems.push(data);
                    }
                    item.isCanceled = true;
                });
            } else {
                orderItems.forEach(function (item) {
                    item.isCanceled = true;
                    const data = {
                        productId: item.productId.toString(),
                        productPrice: item.price,
                        productQuantity: item.quantity,
                        canceledAt: Date.now(),
                    }
                    canceledItems.push(data);
                });
            }
            if (!order.isPaid) {
                order.itemsPrice = 0;
                order.shippingPrice = 0;
                order.taxPrice = 0;
                order.totalPrice = 0;
            }
            const updatedOrder = await order.save();
            return Response.json(updatedOrder);
        } else {
            return new Response("This order cannot be canceled...", {status: 403});
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};