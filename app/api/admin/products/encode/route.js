import crypto from "crypto";
import {getServerSession} from "next-auth";

//  POST /api/admin/products/encode

export const POST = async (req) => {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        const { handle } = await req.json();
        let policyObj = {
            // EXPIRES DECEMBER 31, 2025!!!!!!
            expiry: 1767225600,
            handle: handle,
            call: ['remove'],
        }
        let policyString = JSON.stringify(policyObj);
        let policy = Buffer.from(policyString).toString('base64');
        let signature = crypto.createHmac('sha256', process.env.FILESTACK_SECERT).update(policy).digest('hex');
        return Response.json({
            handle: handle,
            policy,
            signature,
        })
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500})
    }
};