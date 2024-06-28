import prisma from "@/lib/prisma";


// POST api/products/[id]/review
export async function POST(req, {params}) {
    try {
        const {username, userId, rating, comment, title} = await req.json();
        const review = await prisma.review.findFirst({
            where: {
                userId: userId,
                productId: params.id
            },
            select: {
                id: true
            },
        });
        if (review)  return new Response("You already reviewed this product!", {status: 406});
        const newReview = await prisma.review.create({
            data: {
                productId: params.id,
                userId: userId,
                name: username,
                title: title,
                rating: Number(rating),
                comment: comment
            },
        });
        if (!newReview)  return new Response("Something went wrong with this review", {status: 406});
        const ratings = await prisma.review.findMany({
            where: {
                productId: params.id
            },
            select: {
                rating: true
            }
        });
        const totalRatings = ratings.reduce((acc, x) => {
            return acc + x.rating;
        }, 0);
        const updatedProduct = await prisma.product.update({
            where: {
                id: params.id
            },
            data: {
                rating: (totalRatings / ratings.length)
            },
            include: {
                reviews: true,
                images: true
            }
        });
        return Response.json(updatedProduct);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}