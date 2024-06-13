import Product from "@/models/Product";
import {getServerSession} from "next-auth";

//  POST /api/admin/products/add

export async function POST(req) {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        const {name, brand, model, description, category, price, countInStock, images, color} = await req.json();
        const newProduct = new Product({
            user: session.user.image,
            name: name,
            brand: brand,
            category: category,
            model: model,
            description: description,
            rating: 0,
            color: color,
            numReviews: 0,
            price: price,
            countInStock: countInStock,
            reviews: [],
            images: images || [],
        });
        const product = await newProduct.save();
        if (!product) return new Response("Something went wrong creating product", {status: 500});
        return Response.json(product);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}
