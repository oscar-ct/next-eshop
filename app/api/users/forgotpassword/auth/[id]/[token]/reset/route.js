import connectDB from "@/config/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


// api/users/forgotpassword/auth/[id]/[token]/reset

export async function POST(req, {params}) {
    try {
        const { id, token } = params;
        const { newPassword } = await req.json();
        await connectDB();
        const user = await User.findById(id);
        if (!user) {
            return new Response("User not found", {status: 400});
        } else {

            const secret = process.env.JWT_SECERT + user.password;
            try {
                jwt.verify(token, secret);
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
                const updatedUser = await user.save();
                if (!updatedUser) return new Response("Failed to update password", {status: 400});
                return new Response("Password has been reset", {status: 200});
            } catch (e) {
                if (e.expiredAt) {
                    return new Response("Token expired, please try again", {status: 401});
                }
                return new Response("Invalid token", {status: 401});
            }
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}
