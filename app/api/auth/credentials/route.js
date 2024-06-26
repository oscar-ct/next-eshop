import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
export async function PUT(req) {
    try {
        const { id, name, email, password, newPassword } = await req.json();

        const user = await prisma.user.findFirst({
            where: {
                id: id
            },
        })
        if (!user) {
            return new Response("User does not exist", {status: 400});
        }

        const bcryptMatchPassword = await bcrypt.compare(password, user.password);
        if (bcryptMatchPassword) {
            let hashedPassword;
            if (newPassword) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(newPassword, salt);
            }
            const updatedUser = await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    name: name || user.name,
                    email: email || user.email,
                    password: newPassword ? hashedPassword : user.password
                },
                include: {
                    shippingAddresses: true
                }
            });

            return Response.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                shippingAddresses: updatedUser.shippingAddresses,
            });
        } else {
            return new Response("Invalid password", {status: 401});
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}