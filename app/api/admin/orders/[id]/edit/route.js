import connectDB from "@/config/db";
import Order from "@/models/Order";


const calculateOrderAmountInCents = (dollarAmount) => {
    dollarAmount = (dollarAmount + '').replace(/[^\d.-]/g, '');
    if (dollarAmount && dollarAmount.includes('.')) {
        dollarAmount = dollarAmount.substring(0, dollarAmount.indexOf('.') + 3);
    }
    return dollarAmount ? Math.round(parseFloat(dollarAmount) * 100) : 0;
};

// POST api/orders/[id]/edit

export async function PUT(req, {params}) {
    const { isShipped,
        isDelivered,
        isReimbursed,
        reimbursedAmount,
        trackingNumber, } = await req.json();

    try {
        await connectDB();
        const order = await Order.findById(params.id);
        if (!order) return new Response("Order not found...", {status: 404});

        order.trackingNumber = trackingNumber || order.trackingNumber;
        if (isShipped) {
            order.isShipped = isShipped === "true";
        }
        if (isDelivered) {
            if (isDelivered === "true") {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            } else {
                order.isDelivered = false;
            }
        }
        if (isReimbursed) {
            if (isReimbursed  === "true") {
                order.isReimbursed = true;
                order.reimbursedAt = Date.now();
            } else {
                order.isReimbursed = false;
            }
        }
        if (reimbursedAmount) {
            order.reimbursedAmount = calculateOrderAmountInCents(Number(reimbursedAmount));
        }

        const newOrder = await order.save();
        return Response.json(newOrder);

    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}
