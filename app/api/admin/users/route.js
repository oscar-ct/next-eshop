import connectDB from "@/config/db";
import User from "@/models/User";
import {getServerSession} from "next-auth";


//  GET /api/admin/users

export const dynamic = 'force-dynamic'
export const GET = async (req) => {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        await connectDB();
        const users = await User.find({}).sort({createdAt: -1}).select("-password");
        return Response.json(users);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};