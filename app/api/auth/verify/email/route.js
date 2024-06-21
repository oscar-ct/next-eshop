import prisma from "@/lib/prisma";

// POST auth/verify/email

export async function POST(req) {
    try {
        const { email } = await req.json();
        let user;
        const guest = await prisma.order.findFirst({
           where: {
               email: email
           }
        });
        if (guest) {
            return Response.json({
                isValidEmail: true
            });
        } else {
            user = await prisma.order.findFirst({
                where: {
                    user: {
                        email: email
                    }
                }
            });
        }
        if (user) {
            return Response.json({
                isValidEmail: true
            });
        }
        return Response.json({
                isValidEmail: false
        });
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}