//  GET /api/stripe/config

export const GET = async (req) => {
    return Response.json({
        clientId: process.env.STRIPE_API_PUBLISHABLE_KEY,
    });
};