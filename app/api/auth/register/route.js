// import {NextResponse} from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { email, password, name } = await req.json();

        const userExists = await prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                email: true
            }
        });
        if (userExists) {
            return new Response("User already exists", {status: 400});
        } else {
            const salt = await bcrypt.genSalt(10);
            const protectedPassword = await bcrypt.hash(password, salt);

            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: protectedPassword
                }
            })
            return Response.json({
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                shippingAddresses: [],
            });
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
    // return NextResponse.json({message: "success"})
}