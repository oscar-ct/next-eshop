// import {NextResponse} from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { email, password, name } = await req.json();
        console.log(email, password, name);

        await connectDB();

        const userExists = await User.findOne({email: email});
        if (userExists) {
            return new Response("User already exists", {status: 400});
        } else {
            const salt = await bcrypt.genSalt(10);
            const protectedPassword = await bcrypt.hash(password, salt);
            const user = await User.create({
                name: name,
                email: email,
                password: protectedPassword,
            });
            return Response.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                shippingAddresses: user.shippingAddresses,
            });
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
    // return NextResponse.json({message: "success"})
}