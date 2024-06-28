import prisma from "@/lib/prisma";


// POST api/products/[id]/review/[reviewId]/delete
export const DELETE = async (req, {params}) => {
    try {
        const { sessionUserId, reviewUserId } = await req.json();
        if (sessionUserId === reviewUserId) {
            await prisma.review.delete({
                where: {
                    id: params.reviewId
                }
            });
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
                    rating: ratings.length !== 0 ? (totalRatings / ratings.length) : 0
                },
                include: {
                    reviews: true,
                    images: true
                }
            });
            return Response.json(updatedProduct);
        }
        return new Response("You do not have permission to delete this review..", {status: 406});
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
