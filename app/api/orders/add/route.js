import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import {calculatePrices} from "@/utils/calculatePrices";

// POST api/orders/add

export async function POST(req) {
    const { orderItems, shippingAddress, paymentMethod, validCode, user } = await req.json();

    try {
        await connectDB();
        if (orderItems?.length === 0) {
            return new Response("No order found", {status: 404});
        }
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        });
        const orderItemsFromDB = orderItems.map((itemFromBody) => {
            const matchingItemFromDB = itemsFromDB.find(
                (item) => item._id.toString() === itemFromBody._id
            );
            return {
                ...itemFromBody,
                productId: itemFromBody._id,
                price: matchingItemFromDB.price,
                _id: null,
            };
        });
        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices(orderItemsFromDB, validCode);
        const order = new Order({
            user,
            orderItems: orderItemsFromDB,
            freeShipping: !!validCode,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: itemsPrice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
        });
        const newOrder = await order.save();
        return Response.json(newOrder);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}





