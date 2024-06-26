import prisma from "@/lib/prisma";
import {getServerSession} from "next-auth";
//  DELETE /api/admin/products/[id]/image/[imageId]/delete

export const DELETE = async (req, {params}) => {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        await prisma.image.delete({
            where: {
                id: params.imageId
            }
        });
        const images = await prisma.image.findMany({
            where: {
                productId: params.id,
            }
        });
        if (!images) return new Response("Images not found", {status: 404});
        return Response.json(images);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};