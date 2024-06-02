//  POST /api/discount

export const POST = async (req) => {
    const { discountKey } = await req.json();
    if (discountKey === process.env.DISCOUNT_CODE) {
        return Response.json({validCode: true});
    } else {
        return Response.json({validCode: false});
    }
};