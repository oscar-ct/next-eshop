import prisma from "@/lib/prisma";
import {getServerSession} from "next-auth";


// POST api/product/[id]/edit

export async function PUT(req, {params}) {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        const {
            name,
            model,
            brand,
            color,
            countInStock,
            category,
            description,
            isDisabled,
            price,
            image,
        } = await req.json();
        if (image) {
            await prisma.image.create({
                data: {
                    handle: image.handle,
                    url: image.url,
                    productId: params.id,
                }
            });
            const images = await prisma.image.findMany({
                where: {
                    productId: params.id
                }
            });
            return Response.json(images);
        }
        const product = await prisma.product.findFirst({
            where: {
                id: params.id
            }
        });
        if (!product) return new Response("Product not found...", {status: 404});
        const updatedProduct = await prisma.product.update({
            where: {
                id: params.id
            },
            data: {
                color: color ? color : product.color,
                name: name ? name : product.name,
                brand: brand ? brand : product.brand,
                model: model ? model : product.model,
                price: price ? Number(price) : product.price,
                description: description ? description : product.description,
                category: category ? category : product.category,
                countInStock: countInStock ? Number(countInStock) : product.countInStock,
                isDisabled: isDisabled ? isDisabled === "true" : product.isDisabled,
            },
            include: {
                images: true
            }
        });
        return Response.json(updatedProduct);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}
