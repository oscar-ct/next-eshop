import User from "@/models/User";
import connectDB from "@/config/db";


//  PUT /api/users/[id]/updateaddress

export const PUT = async (req, {params}) => {
    const { name, address, city, postalCode, state, country } = await req.json();
    await connectDB();
    try {
        const user = await User.findById(params.id);
        if (!user) return new Response("User not found...", {status: 404});
        const shippingAddress = {
            name,
            address,
            city,
            postalCode,
            state,
            country
        };
        if (user.shippingAddresses.length === 0) {
            user.shippingAddresses = [shippingAddress]
            const updatedUser = await user.save();
            return Response.json(updatedUser.shippingAddresses);
        } else {
            user.shippingAddresses = [...user.shippingAddresses, shippingAddress];
            const updatedUser = await user.save();
            await user.save();
            return Response.json(updatedUser.shippingAddresses);
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};