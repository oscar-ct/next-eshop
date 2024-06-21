import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// api/users/forgotpassword/auth/[id]/[token]

export const GET = async (req, {params}) => {
    const { id, token } = params;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        });
        if (!user) return new Response("User not found", {status: 404});
        if (user) {
            const secret = process.env.JWT_SECERT + user.password;
            try {
                jwt.verify(token, secret);
                return new Response({status: 200});
            } catch (e) {
                if (e.expiredAt) {
                    return new Response("Link has expired", {status: 401});
                }
                return new Response("Invalid token", {status: 401});
            }
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};