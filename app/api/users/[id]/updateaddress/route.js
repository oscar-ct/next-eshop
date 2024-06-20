import prisma from "@/lib/prisma";

//  PUT /api/users/[id]/updateaddress

export const PUT = async (req, {params}) => {
    try {
        const { name, address, city, postalCode, state, country } = await req.json();
        const user = await prisma.user.update({
            where: {
                id: params.id
            },
            data: {
                shippingAddresses: {
                    create: {
                        name: name,
                        address: address,
                        city: city,
                        postalCode: postalCode,
                        state: state,
                        country: country
                    }
                }
            },
            include: {
                shippingAddresses : true
            }
        })
        if (!user) return new Response("User not found...", {status: 404});
        return Response.json(user.shippingAddresses);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};