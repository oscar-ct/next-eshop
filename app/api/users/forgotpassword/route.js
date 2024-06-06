import connectDB from "@/config/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import {MailtrapClient} from "mailtrap";

// api/users/forgotpassword

export async function POST(req) {
    try {
        const { email } = await req.json();
        await connectDB();
        const user = await User.findOne({email: email});
        if (!user) {
            return new Response("User not found", {status: 400});
        } else {
            const {password, _id} = user;
            const secret = process.env.JWT_SECERT + password;
            const payload = {_id}
            const token = jwt.sign(payload, secret, {expiresIn: "3m"});
            let domain;
            if (process.env.NODE_ENV !== "development") {
                domain = "https://e-shop-us.com"
            } else {
                domain = "http://localhost:3000"
            }
            const link = `${domain}/forgotpassword/${_id}/${token}`

            const client = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });
            const sender = { name: "e-shop-us.com", email: "reset-password@e-shop-us.com" };
            client
                .send({
                    from: sender,
                    to: [{ email: email }],
                    subject: "Reset Password Link",
                    text: link,
                })
                .then(console.log)
                .catch(console.error);
            return new Response("Recovery link has been sent", {status: 200});
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}




