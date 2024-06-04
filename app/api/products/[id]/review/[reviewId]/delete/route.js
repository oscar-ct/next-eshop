import connectDB from "@/config/db";
import Product from "@/models/Product";


// POST api/products/[id]/review/[reviewId]/delete
export const DELETE = async (req, {params}) => {
    await connectDB();
    try {
        const { id: productId, reviewId } = params;
        const { sessionUserId, reviewUserId } = await req.json();
        if (sessionUserId === reviewUserId) {
            const partialUpdatedProduct = await Product.updateOne({_id: productId}, {$pull: {reviews: {_id: reviewId}}});
            if (!partialUpdatedProduct)  return new Response("No product or review found", {status: 404});
            const product = await Product.findById(productId);
            if (!product)  return new Response("No product found", {status: 404});
            product.numReviews = product.reviews.length;
            if (product.reviews.length !== 0) {
                const totalRatings = product.reviews.reduce(function (acc, review) {
                    return acc + review.rating;
                }, 0);
                product.rating = totalRatings/product.reviews.length;
            } else {
                product.rating = 0;
            }
            const updatedProduct = await product.save();
            return Response.json(updatedProduct);
        }
        return new Response("You do not have permission to delete this review..", {status: 406});
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
