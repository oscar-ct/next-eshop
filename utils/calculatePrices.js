export function calculatePrices(orderItems, validCode) {
    const addDecimals = (num) => {
        return Math.round(num * 1e2) / 1e2;
    }
    const itemsPrice = addDecimals(orderItems.reduce((acc, item) => {
            return acc + item.price * item.quantity
    }, 0));
    const shippingPrice =  validCode ? 0 : Math.round(itemsPrice > 100 ? 0 : 10);
    const taxableAmount = itemsPrice + shippingPrice;
    const taxPrice = addDecimals((0.0825 * taxableAmount));
    const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};




