import {calculatePrices} from "@/utils/calculatePrices";
import Product from "@/models/Product";
import connectDB from "@/config/db";

// POST api/products/verifyusd

export async function POST(req) {
    const { orderItems, validCode } = await req.json();
    try {
        if (orderItems?.length === 0) {
            return new Response("No products found", {status: 404});
        }
        await connectDB();
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id || x.productId) },
        });
        const orderItemsFromDB = orderItems.map((itemFromBody) => {
            delete itemFromBody.images

            // delete itemFromBody._id
            delete itemFromBody.price
            const matchingItemFromDB = itemsFromDB.find((item) => {
                    const productId = itemFromBody._id || itemFromBody.productId
                    return item._id.toString() === productId;
                }
            );
            return {
                ...itemFromBody,
                price: matchingItemFromDB.price,
            };
        });
        const { totalPrice } = calculatePrices(orderItemsFromDB, validCode);
        return Response.json(totalPrice);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}