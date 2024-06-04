import connectDB from "@/config/db";
import Product from "@/models/Product";


// POST api/products/[id]/review

export async function POST(req, {params}) {
    const {username, userId, rating, comment, title} = await req.json();
    try {
        await connectDB();
        console.log(params.id);
        const product = await Product.findById(params.id);
        if (!product) {
            return new Response("No product found", {status: 404});
        }
        const alreadyReviewed = product.reviews.find(function(review) {
            return review.user.toString() === userId.toString();
        });
        if (alreadyReviewed) {
            return new Response("You already reviewed this product!", {status: 406});
        }
        const review = {
            name: username,
            title,
            rating: Number(rating),
            comment,
            user: userId,
        }
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        const totalRatings = product.reviews.reduce(function (acc, review) {
            return acc + review.rating;
        }, 0);
        product.rating = totalRatings/product.reviews.length;
        const updatedProduct = await product.save();
        return Response.json(updatedProduct);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}