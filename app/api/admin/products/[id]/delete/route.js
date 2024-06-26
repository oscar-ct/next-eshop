import {getServerSession} from "next-auth";
import prisma from "@/lib/prisma";
//  DELETE /api/admin/products/[id]/delete

export const DELETE = async (req, {params}) => {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        const deleteImages = prisma.image.deleteMany({
            where: {
                productId: params.id
            }
        })
        const deleteProduct = prisma.product.delete({
            where: {
                id: params.id
            }
        });
        await prisma.$transaction([deleteImages, deleteProduct]);
        return Response.json({message: "Product deleted"});
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};