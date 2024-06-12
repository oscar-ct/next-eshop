import connectDB from "@/config/db";
import User from "@/models/User";


//  GET /api/admin/users

export const GET = async (req) => {
    try {
        await connectDB();
        const users = await User.find({}).sort({createdAt: -1}).select("-password");
        return Response.json(users);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};