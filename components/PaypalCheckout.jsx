"use client";

import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useContext, useEffect} from "react";
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";


const fetchDiscountValidity = async (body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    if (!apiDomain) {
        return null;
    }
    try {
        const response = await fetch(`${apiDomain}/discount`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const message = await response.text();
            toast.error(message);
            return null;
        }
        return response.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const fetchPayOrder = async (body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    if (!apiDomain) {
        return null;
    }
    try {
        const response = await fetch(`${apiDomain}/orders/pay`, {
            method: "PUT",
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const message = await response.text();
            toast.error(message);
            return null;
        }
        return response.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const fetchVerifiedOrderDollarAmount = async (body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    if (!apiDomain) {
        return null;
    }
    try {
        const response = await fetch(`${apiDomain}/products/verifyusd`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const message = await response.text();
            toast.error(message);
            return null;
        }
        return response.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};


const PaypalCheckout = ({createNewOrder, existingOrder, setSaveButtonDisabled}) => {

    const { discountKey, cartItems, totalPrice } = useContext(GlobalContext);
    const router = useRouter();

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    useEffect(() => {
        if (!isPending) {
            setSaveButtonDisabled(false);
        }

    },[isPending]);

    /// Paypal Actions ////
    const paypalPaymentIntent = async (data, actions) => {
            let isDiscounted = false;

            if (!existingOrder) {
                const discount = await fetchDiscountValidity({discountKey: discountKey});
                if (discount) {
                    isDiscounted = discount.validCode
                }
            }

            let totalPriceFromBackend = await fetchVerifiedOrderDollarAmount({
                orderItems: existingOrder ? existingOrder.orderItems : cartItems,
                validCode: existingOrder ? existingOrder.freeShipping : isDiscounted
            });
            totalPriceFromBackend = Number(totalPriceFromBackend);


            if (!existingOrder) {
                if (totalPriceFromBackend !== Number(totalPrice)) {
                    toast.error("Something went wrong, please try again later.");
                    return;
                }
            } else {
                if (totalPriceFromBackend !== existingOrder.totalPrice) {
                    toast.error("Something went wrong, please try again later.");
                    return;
                }
            }
            setSaveButtonDisabled(true);
            return await actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: totalPriceFromBackend.toFixed(2),
                        }
                    }
                ]
            });

    };
    const onPaypalApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            if (!existingOrder) {
                const orderId = await createNewOrder();
                if (orderId) {
                    const paidOrder = await fetchPayOrder({orderId: orderId, details});
                    if (paidOrder) {
                        router.push(`/orders/${orderId}/payment?paypal=successful`);
                    }
                }
            } else {
                await fetchPayOrder({orderId: existingOrder._id, details});
                router.refresh();
            }
        });
    };
    const onPaypalError = (error) => {
        setSaveButtonDisabled(false);
        toast.error(error.message);
        console.log(error || error.data.message);
    };

    // const onShippingChange = (data,actions) => {
    //     return actions.resolve();
    // }

    return (
        !isPending && (
            <PayPalButtons
                forceReRender={[totalPrice]}
                createOrder={paypalPaymentIntent}
                onApprove={onPaypalApprove}
                onError={onPaypalError}
                onCancel={() => setSaveButtonDisabled(false)}
                style={{shape: "rect", height: 40}}
                // onShippingChange={onShippingChange}

            >
            </PayPalButtons>
        )
    );
};

export default PaypalCheckout;