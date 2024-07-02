const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;
import prisma from "@/lib/prisma";

async function getPayPalAccessToken() {
    // Authorization header requires base64 encoding
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString(
        'base64'
    );
    const url = `${PAYPAL_API_URL}/v1/oauth2/token`;
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${auth}`,
    };
    const body = 'grant_type=client_credentials';
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
    });
    if (!response.ok) throw new Error('Failed to get access token');
    const paypalData = await response.json();
    return paypalData.access_token;
}

export async function checkIfNewTransaction(paypalTransactionId) {
    try {
        // Find all documents where Order.paymentResult.id is the same as the id passed paypalTransactionId
        const order = await prisma.orderPayment.findFirst({
            where: {
                transaction_id: paypalTransactionId
            }
        });
        // If there are no such orders, then it's a new transaction.
       return !order;
    } catch (err) {
        console.error(err);
    }
}

export async function verifyPayPalPayment(paypalTransactionId) {
    const accessToken = await getPayPalAccessToken();
    const paypalResponse = await fetch(
        `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    if (!paypalResponse.ok) throw new Error('Failed to verify payment');
    const paypalData = await paypalResponse.json();
    return {
        verified: paypalData.status === 'COMPLETED',
        value: paypalData.purchase_units[0].amount.value,
    };
}