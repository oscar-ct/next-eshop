import prisma from "@/lib/prisma";

//  GET /api/users/[id]

export const GET = async (req, {params}) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: params.id
            },
            include: {
                shippingAddresses: true
            }
        })
        if (!user) return new Response("User not found...", {status: 404});
        return Response.json({
            id: user?.id,
            name: user?.name,
            email: user?.email,
            isAdmin: user?.isAdmin,
            shippingAddresses: user?.shippingAddresses,
        });
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};