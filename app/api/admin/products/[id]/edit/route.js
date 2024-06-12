import connectDB from "@/config/db";
import Product from "@/models/Product";


// POST api/product/[id]/edit

export async function PUT(req, {params}) {
    const { name,
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

    try {
        await connectDB();
        const product = await Product.findById(params.id);
        if (!product) return new Response("Product not found...", {status: 404});
            product.color = color || product.color;
            product.name = name || product.name;
            product.brand = brand || product.brand;
            product.model = model || product.model
            product.price = Number(price) || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.countInStock = Number(countInStock) || product.countInStock;
            if (isDisabled) {
                product.isDisabled = isDisabled === "true";
            }
            if (image) {
                if (product.images.length === 0) {
                    product.images = [image]
                } else {
                    product.images = [...product.images, image];
                }
            }
        const newProduct = await product.save();
        return Response.json(newProduct);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}
