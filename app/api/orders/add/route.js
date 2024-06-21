import {calculatePrices} from "@/utils/calculatePrices";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

// POST api/orders/add

export async function POST(req) {
    try {
        const { orderItems, shippingAddress, paymentMethod, validCode, user, clientSecret, token } = await req.json();

        if (orderItems?.length === 0) {
            return new Response("No order found", {status: 404});
        }
        if (paymentMethod === "Stripe / Credit Card") {
            if (clientSecret || token) {
                const secret = process.env.JWT_SECERT + clientSecret;
                try {
                    jwt.verify(token, secret);
                } catch (e) {
                    console.log(e);
                    return new Response("This action has been terminated", {status: 401});
                }
            }
        }
        const orderItemIds = orderItems.map((item) => {
            return item.id;
        });
        const orderItemsFromDbMatchingClientOrderItems = await prisma.product.findMany({
            where: {
                id: {
                    in: orderItemIds
                }
            }
        });
        const orderItemsFromClientWithMutatedPriceFromDb = orderItems.map((itemFromClient) => {
            const matchingItem = orderItemsFromDbMatchingClientOrderItems.find(
                (item) => item.id === itemFromClient.id
            );
            return {
                ...itemFromClient,
                price: matchingItem.price,
            };
        });

        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices(orderItemsFromClientWithMutatedPriceFromDb, validCode);
        const formattedOrderItems = orderItemsFromClientWithMutatedPriceFromDb.map((item) => {
            return {
                productId: item.id,
                imageUrls: item.images.map((img) => img.url),
                name: item.name,
                brand: item.brand,
                quantity: item.quantity,
                price: item.price,
            }
        });
        const newOrder = await prisma.order.create({
            data: {
                name: shippingAddress.name,
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                state: shippingAddress.state,
                country: shippingAddress.country,
                itemsPrice: itemsPrice,
                taxPrice: taxPrice,
                shippingPrice: shippingPrice,
                totalPrice: totalPrice,
                paymentMethod: paymentMethod,
                freeShipping: !!validCode,
                userId: user.id ? user.id : undefined,
                email: user.email ? user.email : undefined,
                orderItems: {
                    createMany: {
                        data: formattedOrderItems,
                    }
                }
            },
            include: {
                orderItems: true
            }
        });
        return Response.json(newOrder);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}





