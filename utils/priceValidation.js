import {fetchDiscountValidity, fetchVerifiedOrderDollarAmount} from "@/utils/apiFetchRequests";
import toast from "react-hot-toast";

// Determines if a discount applies based on order status
export const getDiscountStatus = async (existingOrder, newOrder) => {
    if (existingOrder) return existingOrder.freeShipping;
    const discountResponse = await fetchDiscountValidity({ discountKey: newOrder.discountKey });
    return discountResponse?.validCode ?? false; // Fallback to false if undefined
};


export const getVerifiedTotalPrice = async (existingOrder, newOrder, discountResponse) => {
    try {
        const verifiedTotalPrice = await verifyTotalPrice(existingOrder, newOrder, discountResponse);
        return comparePrices(existingOrder, newOrder, verifiedTotalPrice) ? verifiedTotalPrice : null;
    } catch (error) {
        console.error("Error verifying total price:", error);
        toast.error("Failed to verify price");
        return null;
    }
};

// Fetches the verified total price from the backend
const verifyTotalPrice = async (existingOrder, newOrder, discountResponse) => {
    const activeOrderItems = existingOrder !== null ? existingOrder.orderItems.filter((item) => !item.isCanceled) : newOrder.cartItems;
    return await fetchVerifiedOrderDollarAmount({
        orderItems: activeOrderItems,
        validCode: discountResponse,
        isNewOrder: newOrder !== null,
    });
};
// Compares backend and local total prices
const comparePrices = (existingOrder, newOrder, verifiedTotalPrice) => {
    const localTotalPrice = existingOrder !== null ? existingOrder.totalPrice : newOrder.totalPrice;
    const isMatch = verifiedTotalPrice === localTotalPrice;
    if (!isMatch) {
        console.warn(`Price mismatch: Backend=${verifiedTotalPrice} USD, Local=${localTotalPrice} USD`);
        toast.error("Price mismatch detected");
    }
    return isMatch;
};