import bcrypt from "bcrypt";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { _id, password } = await req.json();
        await connectDB();
        const user = await User.findById(_id);
        if (!user) {
            return new Response("User does not exist", {status: 400});
        }
        const bcryptMatchPassword = await bcrypt.compare(password, user.password);
        if (bcryptMatchPassword) {
            return Response.json({
                passwordVerified: true,
            });
        } else {
            return Response.json({
                passwordVerified: false,
            });
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}