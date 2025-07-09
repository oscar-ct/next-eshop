import Stripe from "stripe";
import jwt from "jsonwebtoken";

// POST api/stripe/paymentintent

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY);

// const calculateOrderAmountInCents = (dollarAmount) => {
//     dollarAmount = (dollarAmount + '').replace(/[^\d.-]/g, '');
//     if (dollarAmount && dollarAmount.includes('.')) {
//         dollarAmount = dollarAmount.substring(0, dollarAmount.indexOf('.') + 3);
//     }
//     return dollarAmount ? Math.round(parseFloat(dollarAmount) * 100) : 0;
// };

export async function POST(req) {
    const { verifiedTotalPrice } = await req.json();
    const paymentIntent = await stripe.paymentIntents.create({
        amount: verifiedTotalPrice,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });
    const secret = process.env.JWT_SECERT + paymentIntent.client_secret;
    const payload = {clientSecret: paymentIntent.client_secret}
    const authToken = jwt.sign(payload, secret, {expiresIn: "15s"});
    return Response.json({
        stripeClientSecret: paymentIntent.client_secret,
        authToken,
    });
}

