"use client"

import {useState, useEffect, useCallback, useContext} from "react";
import {PaymentElement, LinkAuthenticationElement, useStripe, useElements} from "@stripe/react-stripe-js";
import CustomBtn from "./CustomBtn";
import {toast} from "react-hot-toast";
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";

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
        }
        return response.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const fetchNewOrder = async (body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    if (!apiDomain) {
        return null;
    }
    try {
        const response = await fetch(`${apiDomain}/orders/add`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const message = await response.text();
            toast.error(message);
        }
        return response.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const fetchStripePaymentIntent = async (body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    if (!apiDomain) {
        return null;
    }
    try {
        const response = await fetch(`${apiDomain}/stripe/paymentintent`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const message = await response.text();
            toast.error(message);
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
        }
        return response.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};


const StripeCheckoutForm = ({existingOrder}) => {

    const stripe = useStripe();
    const elements = useElements();

    const { user: userData, dispatch, discountKey, cartItems, totalPrice, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, guestData } = useContext(GlobalContext);

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState();
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [clientHasSecret, setClientHasSecret] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);

    const placeNewOrder = useCallback(async () => {
        const res = await fetchDiscountValidity({discountKey: discountKey});
        let user;
        if (userData) {
            user = {
                id: userData._id,
                name: userData.name,
                email: userData.email,
            };
        } else {
            user = {
                name: shippingAddress.name,
                email: guestData,
            };
        }
        const body = {
            user,
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            validCode: res.validCode,
        }
        const newOrder = await fetchNewOrder(body);
        return newOrder._id;
    }, [cartItems, discountKey, itemsPrice, paymentMethod, shippingAddress, shippingPrice, taxPrice, totalPrice, userData, guestData]);

    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        if (!clientSecret) {
            return;
        } else {
            setClientHasSecret(true);
            // dispatch(setLoading(true));
        }
        if (!stripe) {
            return;
        }
        if (clientSecret) {
            stripe.retrievePaymentIntent(clientSecret).then(async ({paymentIntent}) => {
                switch (paymentIntent.status) {
                    case "succeeded": {
                        setMessage("Payment succeeded!");
                        const details = {
                            id: paymentIntent.id,
                            status: paymentIntent.status,
                            update_time: paymentIntent.created.toString(),
                        };
                        if (!existingOrder) {
                            const orderId = await placeNewOrder();
                            if (orderId) {
                                const order = await fetchPayOrder({orderId: orderId, details});
                                if (order) {
                                    router.push(`/orders/${order._id}/payment?stripe=successful`);
                                    // window.location.href = `/order/${data}/payment?stripe=successful`;
                                }
                            }
                        } else {
                            if (!existingOrder.isPaid) {
                                await fetchPayOrder({orderId: existingOrder._id, details});
                                router.refresh();
                            }
                            // router.push(`/orders/${existingOrder._id}`)
                        }
                        // dispatch(setLoading(false));
                        // dispatch({type: "REMOVE_DISCOUNT"});
                        // dispatch({type: "SET_LOCAL_STORAGE"});
                        break;
                    }
                    case "processing": {
                        setMessage("Your payment is processing.");
                        break;
                    }
                    case "requires_payment_method": {
                        setPaymentFailed(true);
                        setMessage("Your payment was not successful, please try again.");
                        // dispatch(setLoading(false));
                        break;
                    }
                    default: {
                        setMessage("Something went wrong.");
                        setPaymentFailed(true);
                        // dispatch(setLoading(false));
                        break;
                    }
                }
            });
        }
    }, [stripe, dispatch, placeNewOrder, existingOrder, router]);

    const handleError = (error) => {
        // dispatch(setLoading(false));
        setLoadingBtn(false);
        setErrorMessage(error.message);
    };

    const handlePriceError = () => {
        toast.error("Something went wrong, please try again later.");
        setLoadingBtn(false);
        // dispatch(setLoading(false));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        // dispatch(setLoading(true));
        setLoadingBtn(true);
        // Trigger form validation and wallet collection
        const {error: submitError} = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }
        // Create the PaymentIntent and obtain clientSecret
        let isDiscounted;
        if (!existingOrder) {
            const discount = await fetchDiscountValidity({discountKey: discountKey});
            isDiscounted = discount.validCode;
        }
        let totalPriceFromBackend = await fetchVerifiedOrderDollarAmount({
            orderItems: existingOrder ? existingOrder.orderItems.filter((item) => !item.isCanceled) : cartItems,
            validCode : existingOrder ? existingOrder.freeShipping : isDiscounted,
        });
        totalPriceFromBackend = Number(totalPriceFromBackend);

        if (!existingOrder) {
            if (totalPriceFromBackend !== Number(totalPrice)) {
                handlePriceError();
                return;
            }
        } else {
            if (totalPriceFromBackend !== existingOrder.totalPrice) {
                handlePriceError();
                return;
            }
        }

        const {clientSecret} = await fetchStripePaymentIntent({totalPriceFromBackend});

        // Confirm the PaymentIntent using the details collected by the Payment Element
        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: existingOrder ? `${window.location.origin}/orders/${existingOrder._id}` : `${window.location.origin}/checkout`,
            },
        });
        if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            handleError(error);
        } else {
            console.log("This is active")
            // Your customer is redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer is redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    const linkAuthenticationElementOptions = {
        defaultValues: {
            email: userData ? userData.email : ""
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {
                !clientHasSecret && (
                    <>
                        <LinkAuthenticationElement options={linkAuthenticationElementOptions} className={"pb-5"}/>
                        <PaymentElement className={"pb-3"} options={paymentElementOptions}/>
                        <div className={"flex justify-center"}>
                            <CustomBtn customClass={"w-full flex justify-center items-center my-3"} type={"submit"}
                                       isDisabled={loadingBtn || !stripe || !elements}>
                                {
                                    loadingBtn ? <span className="loading loading-bars loading-sm"/> : `Pay Now - ($${existingOrder ? existingOrder.totalPrice : totalPrice})`
                                }
                            </CustomBtn>
                        </div>
                    </>
                )
            }
            {
                (errorMessage || message) && (
                    <div className={`text-center leading-[20px] text-lg ${errorMessage && "pt-4"}`}>
                        {errorMessage || message}
                    </div>
                )
            }
            {
                paymentFailed && (
                    <div className={"pt-6"}>
                        <CustomBtn customClass={"w-full"} type={"button"} onClick={(e) => {
                            e.preventDefault();
                            window.location.href = existingOrder ? `${window.location.origin}/order/${existingOrder._id}` : `${window.location.origin}/submitorder`
                        }}>
                            Try Again
                        </CustomBtn>
                    </div>
                )
            }
        </form>
    );
};

export default StripeCheckoutForm;