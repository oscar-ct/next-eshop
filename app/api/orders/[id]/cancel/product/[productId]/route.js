import Order from "@/models/Order";
import connectDB from "@/config/db";

//  DELETE /api/orders/[id]/cancel/product/[productId]

const SHIPPING_PRICE = 10;
const TAX_PERCENTAGE = 0.0825;

export const DELETE = async (req, {params}) => {
    await connectDB();

    try {
        const order = await Order.findById(params.id);
        if (!order) return new Response("Order not found...", {status: 404});

        const { isShipped, isCanceled, orderItems, canceledItems } = order;
        const canceledItem = orderItems.find(function (item) {
            return params.productId === item.productId.toString();
        });
        orderItems.forEach((item) => {
            if (params.productId === item.productId.toString()) {
                item.isCanceled = true;
            }
        });
        const newItemsPrice = order.itemsPrice - Number(canceledItem.price * canceledItem.quantity);
        const newTaxPrice = TAX_PERCENTAGE * newItemsPrice;

        if (!isShipped && !isCanceled) {
            if (orderItems.length - 1 === canceledItems.length) {
                order.isCanceled = true;
                order.canceledAt = Date.now();
                order.shippingPrice = 0;
            }
            const data = {
                productId: canceledItem.productId.toString(),
                productPrice: canceledItem.price,
                productQuantity: canceledItem.quantity,
                canceledAt: Date.now(),
            }
            canceledItems.push(data);
            if (!order.freeShipping && newItemsPrice < 100 && !order.isPaid) {
                order.shippingPrice = SHIPPING_PRICE;
            }
            order.itemsPrice = newItemsPrice.toFixed(2);
            order.taxPrice = newTaxPrice.toFixed(2);
            order.totalPrice = (newItemsPrice + newTaxPrice + order.shippingPrice).toFixed(2);

            const updatedOrder = await order.save();
            return Response.json(updatedOrder);
        } else {
            return new Response("This item cannot be canceled...", {status: 403});
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};