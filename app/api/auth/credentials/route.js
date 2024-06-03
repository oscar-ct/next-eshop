import bcrypt from "bcrypt";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function PUT(req) {
    try {
        const { _id, name, email, password, newPassword } = await req.json();
        await connectDB();
        const user = await User.findById(_id);
        if (!user) {
            return new Response("User does not exist", {status: 400});
        }

        const bcryptMatchPassword = await bcrypt.compare(password, user.password);
        if (bcryptMatchPassword) {
            user.name = name || user.name;
            user.email = email || user.email;
            if (newPassword) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
            }
            const updatedUser = await user.save();
            return Response.json({
                _id: updatedUser.id,
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