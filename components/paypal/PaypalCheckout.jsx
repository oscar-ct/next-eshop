"use client";

import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {fetchNewOrder, fetchPayOrder} from "@/utils/apiFetchRequests";
import {getDiscountStatus, getVerifiedTotalPrice} from "@/utils/priceValidation";


const PaypalCheckout = ({ newOrder, existingOrder, setSaveButtonDisabled }) => {

    const router = useRouter();
    // PayPal script loading state
    const [{isPending : isPaypalLoading}] = usePayPalScriptReducer();


    useEffect(() => {
        if (!isPaypalLoading) {
            setSaveButtonDisabled(false);
        }
    },[isPaypalLoading]);



    // Creates a new order and returns its ID or null if it fails.
    const createNewOrder = async () => {
        const discountResponse = await getDiscountStatus(existingOrder, newOrder);
        const totalPriceResponse = await getVerifiedTotalPrice(existingOrder, newOrder, discountResponse);
        // Exit out if verified price returns null
        if (!totalPriceResponse) {
            setSaveButtonDisabled(false);
            return;
        }
        const orderPayload = {
            user: newOrder.user ? { id: newOrder.user.id } : { email: newOrder.guestEmail },
            orderItems: newOrder.cartItems,
            shippingAddress: newOrder.shippingAddress,
            paymentMethod: newOrder.paymentMethod,
            itemsPrice: newOrder.itemsPrice,
            shippingPrice: newOrder.shippingPrice,
            taxPrice: newOrder.taxPrice,
            totalPrice: totalPriceResponse,
            validCode: discountResponse,
        }
        const orderResponse = await fetchNewOrder(orderPayload);
        return orderResponse ? orderResponse.id : null;
    };



    // Creates a PayPal order with validated price
    const createPaypalOrder = async (data, actions) => {
        setSaveButtonDisabled(true);
        const discountResponse = await getDiscountStatus(existingOrder, newOrder);
        const totalPriceResponse = await getVerifiedTotalPrice(existingOrder, newOrder, discountResponse);
        // Exit out if verified price returns null
        if (!totalPriceResponse) {
            setSaveButtonDisabled(false);
            return;
        }
        // Create PayPal order with amount in dollars
        return await actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: Number(totalPriceResponse / 100).toFixed(2),
                    }
                }
            ]
        });
    };



    // Handles PayPal payment approval and order processing
    const handlePaypalApprove = (data, actions) => {
        return actions.order.capture().then(async function (paymentDetails) {
            if (!existingOrder) {
                // Create and process new order
                const orderId = await createNewOrder();
                if (orderId) {
                    const paidOrder = await fetchPayOrder({orderId: orderId, paymentDetails});
                    if (!paidOrder) {
                        router.push(`/orders/${orderId}/payment?paypal=unsuccessful`);
                    } else {
                        router.push(`/orders/${orderId}/payment?paypal=successful`);
                    }
                }
            } else {
                // Update existing order
                await fetchPayOrder({orderId: existingOrder.id, paymentDetails});
                router.refresh(); // Refresh page to reflect updated order status
            }
        });
    };



    // Handles PayPal payment errors
    const handlePaypalError = (error) => {
        setSaveButtonDisabled(false);
        toast.error(error.message || "An error occurred during PayPal payment");
        console.error("PayPal Error:", error); // Log error for debugging
    };


    if (isPaypalLoading) return "Loading Paypal..."

    return (
        <PayPalButtons
            forceReRender={[newOrder]} // Re-render if total price changes
            createOrder={createPaypalOrder}
            onApprove={handlePaypalApprove}
            onError={handlePaypalError}
            onCancel={() => setSaveButtonDisabled(false)}
            style={{shape: "rect", height: 40}}
        />
    );
};

export default PaypalCheckout;