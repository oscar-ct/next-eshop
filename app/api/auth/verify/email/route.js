import connectDB from "@/config/db";
import Order from "@/models/Order";

// POST auth/verify/email

export async function POST(req) {
    try {
        const { email } = await req.json();
        await connectDB();
        const user = await Order.find({"user.email": email}).select("_id");
        console.log(user)
        if (user.length !== 0) {
            return Response.json({
                isValidEmail: true
            });
        } else {
            return Response.json({
                isValidEmail: false
            });
        }
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}