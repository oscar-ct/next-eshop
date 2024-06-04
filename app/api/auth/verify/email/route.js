import connectDB from "@/config/db";
import User from "@/models/User";

// POST auth/verify/email

export async function POST(req) {
    try {
        const { email } = await req.json();
        await connectDB();
        const user = await User.findOne({email: email});
        if (user) {
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