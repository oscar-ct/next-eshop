import {getServerSession} from "next-auth";
import prisma from "@/lib/prisma";


const calculateOrderAmountInCents = (dollarAmount) => {
    dollarAmount = (dollarAmount + '').replace(/[^\d.-]/g, '');
    if (dollarAmount && dollarAmount.includes('.')) {
        dollarAmount = dollarAmount.substring(0, dollarAmount.indexOf('.') + 3);
    }
    return dollarAmount ? Math.round(parseFloat(dollarAmount) * 100) : 0;
};

// POST api/orders/[id]/edit

export async function PUT(req, {params}) {
    try {
        const session = await getServerSession();
        if (!session.user.name.userIsAdmin) return new Response("This action is forbidden", {status: 403});
        const { isShipped,
            isDelivered,
            isReimbursed,
            reimbursedAmount,
            trackingNumber, } = await req.json();
        const order = await prisma.order.findFirst({
            where: {
                id: params.id
            }
        });
        if (!order) return new Response("Order not found...", {status: 404});
        const updatedOrder = await prisma.order.update({
            where: {
                id: params.id
            },
            data: {
                trackingNumber: trackingNumber ? trackingNumber : order.trackingNumber,
                isShipped: isShipped ? isShipped === "true" : order.isShipped,
                isDelivered: isDelivered ? isDelivered === "true" : order.isDelivered,
                deliveredAt: !isDelivered ? order.deliveredAt : isDelivered === "true" ? new Date() : null,
                isReimbursed: isReimbursed ? isReimbursed === "true" : order.isReimbursed,
                reimbursedAt: !isReimbursed ? order.reimbursedAt : isReimbursed === "true" ? new Date() : null,
                reimbursedAmount: !reimbursedAmount ? order.reimbursedAmount : Number(reimbursedAmount) !== 0 ? calculateOrderAmountInCents(Number(reimbursedAmount)) : null,
            },
            include: {
                orderItems: true,
                user: true
            }
        });
        if (!updatedOrder) return new Response("Order not updated...", {status: 404});
        return Response.json(updatedOrder);
    } catch (e) {
        console.log(e);
        return new Response("Something went wrong...", {status: 500});
    }
}
