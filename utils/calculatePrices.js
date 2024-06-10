export function calculatePrices(orderItems, validCode) {
    const itemsPrice = orderItems.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
    }, 0);
    const shippingPrice =  validCode ? 0 : itemsPrice > 10000 ? 0 : 1000;
    const taxableAmount = itemsPrice + shippingPrice;
    const taxPrice = Math.round(0.0825 * taxableAmount);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}




