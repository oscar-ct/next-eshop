import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import {MailtrapClient} from "mailtrap";

// api/users/forgotpassword

export async function POST(req) {
    try {
        const { email } = await req.json();
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user) {
            return new Response("User not found", {status: 400});
        } else {
            const {password, id} = user;
            const secret = process.env.JWT_SECERT + password;
            const payload = {id}
            const token = jwt.sign(payload, secret, {expiresIn: "3m"});
            let domain;
            if (process.env.NODE_ENV !== "development") {
                domain = "https://www.shoposcar.com"
            } else {
                domain = "http://localhost:3000"
            }
            const link = `${domain}/forgotpassword/${id}/${token}`

            const client = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });
            const sender = { name: "ShopOscar", email: "no-reply@shoposcar.com" };
            await client
                .send({
                    from: sender,
                    to: [{ email: email }],
                    template_uuid: "5b02a698-e877-4efa-8666-a545d8315467",
                    template_variables: {
                        "reset_link": link
                    }
                })
                .then(console.log)
                .catch(console.error)
            return new Response("Recovery link has been sent", {status: 200});
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}




