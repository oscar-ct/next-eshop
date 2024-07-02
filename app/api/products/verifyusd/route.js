import {calculatePrices} from "@/utils/calculatePrices";
import prisma from "@/lib/prisma";

// POST api/products/verifyusd

export async function POST(req) {
    try {
        const { orderItems, validCode, isNewOrder } = await req.json();
        if (orderItems?.length === 0) {
            return new Response("No products found", {status: 404});
        }
        let orderItemsIds;
        if (isNewOrder) {
            orderItemsIds = orderItems.map((item) => {
                return item.id;
            });
        } else {
            orderItemsIds = orderItems.map((item) => {
                return item.productId;
            });
        }
        const itemsFromDB = await prisma.product.findMany({
            where: {
                id: {
                    in: orderItemsIds
                }
            }
        })
        const orderItemsFromDB = orderItems.map((itemFromBody) => {
            delete itemFromBody.images
            delete itemFromBody.price
            const matchingItemFromDB = itemsFromDB.find((item) => {
                    let productId;
                    if (isNewOrder) {
                        productId = itemFromBody.id;
                    } else {
                        productId = itemFromBody.productId;
                    }
                    return item.id === productId;
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