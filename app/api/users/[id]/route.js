import connectDB from "@/config/db";
import User from "@/models/User";

//  GET /api/users/[id]

export const GET = async (req, {params}) => {
    await connectDB();
    try {
        const user = await User.findOne({email: params.id});
        if (!user) return new Response("User not found...", {status: 404});
        return Response.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            shippingAddresses: user.shippingAddresses,
        });
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};