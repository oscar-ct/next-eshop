import connectDB from "@/config/db";
import Order from "@/models/Order";
import {getServerSession} from "next-auth";
// import {getServerSession} from "next-auth";


//  GET /api/admin/orders

export const GET = async (req) => {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        await connectDB();
        const orders = await Order.find({}).sort({createdAt: -1});
        return Response.json(orders);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
};
