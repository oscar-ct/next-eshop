import prisma from "@/lib/prisma";
import {getServerSession} from "next-auth";

//  POST /api/admin/products/add

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        const {name, brand, model, description, category, price, countInStock, color} = await req.json();
        const newProduct = await prisma.product.create({
            data: {
                userId: session.user.image,
                name: name,
                brand: brand,
                category: category,
                model: model,
                description: description,
                color: color,
                price: Number(price),
                countInStock: Number(countInStock),
            }
        });
        if (!newProduct) return new Response("Something went wrong creating product", {status: 500});
        return Response.json(newProduct);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}
